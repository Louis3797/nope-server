/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type Server } from 'socket.io';
import config from '../config/config';
import prismaClient from '../config/prisma';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '../types/socket';
import { matchMakingQueues } from '../app';
import { getTournamentInfo } from '../service/tournament.service';
import startMatch from './startMatch';
import type { Player } from '@prisma/client';

export const matchmaking = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  tournamentId: string
) => {
  while (true) {
    const queue = matchMakingQueues.get(tournamentId);

    // if matchmaking queue does not exists we can end the matchmaking
    if (!queue) {
      return;
    }

    const tournamentData = await prismaClient.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        currentSize: true,
        bestOf: true,
        matches: { select: { id: true, status: true } }
      }
    });

    // if tournament was not found than quit
    if (!tournamentData) {
      return;
    }

    const numOfAllMatches =
      (tournamentData.currentSize * (tournamentData.currentSize - 1)) / 2;
    const allMatchesEnded = tournamentData.matches.filter(
      (m) => m.status !== 'FINISHED'
    );
    if (
      tournamentData.matches.length >= numOfAllMatches &&
      allMatchesEnded.length === 0
    ) {
      // get winner
      const endStatistics = await prismaClient.tournament.findUnique({
        where: { id: tournamentId },
        select: {
          tournamentStatistic: {
            select: { playerId: true, wonMatches: true }
          }
        }
      });

      const winnerStatisitc = endStatistics?.tournamentStatistic.reduce(
        (prev, current) => {
          return prev.wonMatches > current.wonMatches ? prev : current;
        }
      );

      await prismaClient.tournament.update({
        where: { id: tournamentId },
        data: {
          status: 'FINISHED',
          endedAt: new Date(),
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          winner: { connect: { id: winnerStatisitc!.playerId } }
        }
      });
      // emit ending

      const endedTournamentInfo = await getTournamentInfo(
        tournamentId,
        'The tournament ended'
      );

      io.to(`tournament:${tournamentId}`).emit(
        'tournament:info',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        endedTournamentInfo!
      );
      console.log('The tournament Ended');
      return;
    }

    if (queue.size() >= 2) {
      // check if all matches are played

      let player1Priority = queue.frontPriority()!;
      const player1 = queue.dequeue()!;
      let player2Priority = queue.frontPriority()!;
      const player2 = queue.dequeue()!;

      // check if players played a match against each other before
      const playedBefore = await prismaClient.match.findFirst({
        where: {
          AND: [
            {
              opponents: {
                some: {
                  id: player1.id
                }
              }
            },
            {
              opponents: {
                some: {
                  id: player2.id
                }
              }
            },
            {
              tournamentId
            }
          ]
        }
      });

      if (playedBefore) {
        // Add the players back to the queue with the same priority
        queue.enqueue(player2, player2Priority);
        queue.enqueue(player1, player1Priority);
      } else {
        // get all sockets in tournament to find the sockets of both players
        const sockets = await io
          .in(`tournament:${tournamentId}`)
          .fetchSockets();
        // find sockets of both players
        const socketPlayer1 = sockets.find(
          (socket) => socket.data.user.id === player1.id
        );

        const socketPlayer2 = sockets.find(
          (socket) => socket.data.user.id === player2.id
        );

        // if one socket is undefined that means that a client disconnected
        if (!socketPlayer1 || !socketPlayer2) {
          if (socketPlayer1) {
            queue.enqueue(player1, player1Priority);
          }
          if (socketPlayer2) {
            queue.enqueue(player2, player2Priority);
          }
        } else {
          // create match
          const match = await prismaClient.match.create({
            data: {
              round: 0,
              status: 'PENDING', // update if both players accept,
              tournament: { connect: { id: tournamentId } },
              opponents: {
                connect: [{ id: player1.id }, { id: player2.id }]
              }
            },
            select: { id: true }
          });

          // send invite to players

          const invitationTimeout = new Date(
            new Date().getTime() + config.matchMaking.invitationTimeout
          ).getTime();

          // send invite to both clients
          io.to([socketPlayer1.id, socketPlayer2.id])
            .timeout(config.matchMaking.invitationTimeout)
            .emit(
              'match:invite',
              {
                message: 'Your invited to a match',
                matchId: match.id,
                players: [
                  {
                    id: player1.id,
                    username: player1.username
                  },
                  {
                    id: player2.id,
                    username: player2.username
                  }
                ],
                invitationTimeout
              },
              async (err, responses) => {
                if (err) {
                  // some clients did not acknowledge the event in the given delay
                  // check if both does not acknowledge
                  // check if only one does not acknowledge

                  // delete match
                  await prismaClient.match.delete({
                    where: { id: match.id }
                  });

                  io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                    'match:info',
                    {
                      message:
                        'You and your opponent rejected the invite, therefore both of you will be put back in the matchmaking queue',
                      tournamentId,
                      match: null
                    }
                  );

                  if (responses.length === 1 && responses[0]?.id) {
                    // One client acknowledged the invite
                    const checkId =
                      responses[0].id === player1.id
                        ? player1.id
                        : responses[0].id === player2.id
                        ? player2.id
                        : undefined;

                    // check received id
                    if (!checkId) {
                      queue.enqueue(player1, player1Priority + 1);
                      queue.enqueue(player2, player2Priority + 1);
                    } else {
                      player1Priority += checkId === player1.id ? 1 : 2;
                      player2Priority += checkId === player2.id ? 1 : 2;

                      queue.enqueue(player1, player1Priority);
                      queue.enqueue(player2, player2Priority);
                    }
                    // client did accept
                  } else {
                    // Both clients did not acknowledge

                    // Add the players back to the queue with the same priority
                    queue.enqueue(player1, player1Priority + 2);
                    queue.enqueue(player2, player2Priority + 2);
                  }
                } else {
                  // if both clients does acknowledge

                  // check if a client rejected the invitation
                  if (!responses[0]?.accepted && !responses[1]?.accepted) {
                    // both rejected the invitation put them back in the queue

                    // delete match
                    await prismaClient.match.delete({
                      where: { id: match.id }
                    });

                    io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                      'match:info',
                      {
                        message:
                          'You and your opponent rejected the invite, therefore both of you will be put back in the matchmaking queue',
                        tournamentId,
                        match: null
                      }
                    );
                    // Add the players back to the queue with the same priority

                    queue.enqueue(player1, player1Priority + 1);
                    queue.enqueue(player2, player2Priority + 1);
                  } else if (
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                    (responses[0]?.accepted && !responses[1]?.accepted) ||
                    (!responses[0]?.accepted && responses[1]?.accepted)
                  ) {
                    // one client rejected the invite

                    const winnerId = responses[0]?.accepted
                      ? responses[0].id
                      : responses[1]?.id;

                    if (
                      !winnerId ||
                      (winnerId !== player1.id && winnerId !== player2.id)
                    ) {
                      io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                        'match:info',
                        {
                          message:
                            'An error appeared you will be put back into the matchmaking queue',
                          tournamentId,
                          match: null
                        }
                      );

                      queue.enqueue(player1, player1Priority + 1);
                      queue.enqueue(player2, player2Priority + 1);
                    } else {
                      // update match winner
                      const updatedMatch = await prismaClient.match.update({
                        where: { id: match.id },
                        data: {
                          status: 'FINISHED',
                          winner: { connect: { id: winnerId } }
                        },
                        select: {
                          id: true,
                          opponents: { select: { id: true, username: true } },
                          winner: { select: { id: true, username: true } },
                          round: true,
                          status: true
                        }
                      });

                      // find tournamentStatistic of players for the current tournament
                      const statistic =
                        await prismaClient.tournamentStatistic.findFirst({
                          where: {
                            AND: [
                              {
                                playerId: winnerId
                              },
                              {
                                tournamentId
                              }
                            ]
                          },
                          select: {
                            id: true,
                            player: { select: { username: true } }
                          }
                        });

                      // update the statistic
                      await prismaClient.tournamentStatistic.update({
                        where: {
                          id: statistic!.id
                        },
                        data: {
                          wonMatches: { increment: 1 }
                        }
                      });

                      const winner: Pick<Player, 'id' | 'username'> & {
                        points: number;
                      } = Object.assign(updatedMatch.winner!, { points: 0 });

                      const playerData: Array<
                        Pick<Player, 'id' | 'username'> & { points: number }
                      > = [];

                      for (const player of updatedMatch.opponents) {
                        playerData.push(Object.assign(player, { points: 0 }));
                      }

                      io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                        'match:info',
                        {
                          message: `${statistic?.player.username} won the game, because his opponent rejected the match invitation.`,
                          tournamentId,
                          match: {
                            id: updatedMatch.id,
                            round: updatedMatch.round,
                            bestOf: tournamentData.bestOf,
                            status: updatedMatch.status,
                            winner,
                            opponents: playerData
                          }
                        }
                      );

                      // Send tournament info with new score
                      const tInfo = await getTournamentInfo(
                        tournamentId,
                        `${statistic?.player.username} won the game bc the opponent rejected the match invitation.`
                      );

                      io.in(`tournament:${tournamentId}`)
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        .emit('tournament:info', tInfo!);

                      queue.enqueue(player1, player1Priority + 1);
                      queue.enqueue(player2, player2Priority + 1);
                    }
                  } else {
                    const updatedMatch = await prismaClient.match.update({
                      where: { id: match.id },
                      data: { status: 'IN_PROGRESS' },
                      select: {
                        id: true,
                        opponents: { select: { id: true, username: true } },
                        winner: { select: { id: true, username: true } },
                        round: true,
                        status: true
                      }
                    });

                    const playerData: Array<
                      Pick<Player, 'id' | 'username'> & { points: number }
                    > = [];

                    for (const player of updatedMatch.opponents) {
                      playerData.push(Object.assign(player, { points: 0 }));
                    }
                    // both accepted
                    socketPlayer1.join(`tournament-match:${match.id}`);
                    socketPlayer2.join(`tournament-match:${match.id}`);

                    io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                      'match:info',
                      {
                        message:
                          'You accepted the invite. Please wait for the match to start',
                        tournamentId,
                        match: {
                          id: updatedMatch.id,
                          round: updatedMatch.round,
                          bestOf: tournamentData.bestOf,
                          status: updatedMatch.status,
                          winner: null,
                          opponents: playerData
                        }
                      }
                    );

                    const opponents = {
                      player1: {
                        id: player1.id,
                        username: player1.username,
                        socket: socketPlayer1,
                        points: 0,
                        priority: player1Priority
                      },
                      player2: {
                        id: player2.id,
                        username: player2.username,
                        socket: socketPlayer2,
                        points: 0,
                        priority: player2Priority
                      }
                    };

                    // ! dont await startMatch it will stop
                    // ! the matchmaking and wait till the match ends
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    await startMatch(
                      io,
                      opponents,
                      tournamentId,
                      match.id,
                      tournamentData.bestOf
                    );
                  }
                }
              }
            );
        }
      }
    }

    // eslint-disable-next-line promise/avoid-new
    await new Promise((resolve) =>
      setTimeout(resolve, config.matchMaking.timeoutInterval)
    );
  }
};
