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

export const matchmaking = (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  tournamentId: string
) => {
  setTimeout(async () => {
    const queue = matchMakingQueues.get(tournamentId);

    // if matchmaking queue does not exists we can end the matchmaking
    if (!queue) {
      return;
    }

    const tournamentData = await prismaClient.tournament.findUnique({
      where: { id: tournamentId },
      select: { currentSize: true, matches: { select: { id: true } } }
    });

    // if tournament was not found than quit
    if (!tournamentData) {
      return;
    }

    const numOfAllMatches =
      (tournamentData.currentSize * (tournamentData.currentSize - 1)) / 2;

    if (tournamentData.matches.length >= numOfAllMatches) {
      return;
    }

    if (queue.size() >= 2) {
      // check if all matches are played

      const player1Priority = queue.frontPriority()!;
      const player1 = queue.dequeue()!;
      const player2Priority = queue.frontPriority()!;
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
                  id: player1.id
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

        queue.enqueue(player1, player1Priority);
        queue.enqueue(player2, player2Priority);
        // recursive call
        matchmaking(io, tournamentId);
        return;
      }

      // get all sockets in tournament to find the sockets of both players
      const sockets = await io.in(`tournament:${tournamentId}`).fetchSockets();
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
        matchmaking(io, tournamentId);
        return;
      }

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
            players: [player1, player2],
            invitationTimeout
          },
          async (err, responses) => {
            console.log(err);
            console.log(responses);
            console.log(responses.length);
            console.log(responses[0]?.id);
            console.log(responses[1]?.id);
            if (err) {
              // some clients did not acknowledge the event in the given delay
              // check if both does not acknowledge
              // check if only one does not acknowledge

              if (responses.length === 1) {
                // One client acknowledged the invite
                // Todo

                // if client rejected
                if (!responses[0]?.accepted) {
                  // Todo add logic
                  matchmaking(io, tournamentId);
                }

                // client did accept
                // Todo add logic
              } else {
                // Both clients did not acknowledge

                // delete match
                await prismaClient.match.delete({
                  where: { id: match.id }
                });

                io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                  'match:info',
                  'You and your opponent rejected the invite, therefore both of you will be put back in the matchmaking queue'
                );
                // Add the players back to the queue with the same priority
                queue.enqueue(player1, player1Priority);
                queue.enqueue(player2, player2Priority);
                matchmaking(io, tournamentId);
              }
            } else {
              // if both clients does acknowledge

              // check if a client rejected the invitation
              if (!responses[0]?.accepted && !responses[0]?.accepted) {
                // both rejected the invitation put them back in the queue

                // delete match
                await prismaClient.match.delete({
                  where: { id: match.id }
                });

                io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                  'match:info',
                  'You and your opponent rejected the invite, therefore both of you will be put back in the matchmaking queue'
                );
                // Add the players back to the queue with the same priority

                queue.enqueue(player1, player1Priority);
                queue.enqueue(player2, player2Priority);
                matchmaking(io, tournamentId);
              } else if (
                (responses[0]?.accepted && !responses[1]?.accepted) ||
                (!responses[0]?.accepted && responses[1]?.accepted)
              ) {
                // one client rejected the invite

                const winnerId = responses[0].accepted
                  ? responses[0].id
                  : responses[1]?.id;

                if (
                  winnerId !== socketPlayer1.data.user.id &&
                  winnerId !== socketPlayer2.data.user.id
                ) {
                  io.to([socketPlayer1.id, socketPlayer2.id]).emit(
                    'match:info',
                    'An error appeared you will be put back into the matchmaking queue'
                  );

                  queue.enqueue(player1, player1Priority);
                  queue.enqueue(player2, player2Priority);
                  matchmaking(io, tournamentId);
                  return;
                }
                // update match winner
                await prismaClient.match.update({
                  where: { id: match.id },
                  data: {
                    status: 'FINISHED',
                    winner: { connect: { id: winnerId } }
                  }
                });

                // find tournamentStatistic of players for the current tournament
                const statisticId =
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
                    select: { id: true }
                  });

                // update the statistic
                await prismaClient.tournamentStatistic.update({
                  where: {
                    id: statisticId!.id
                  },
                  data: {
                    wonMatches: { increment: 1 }
                  }
                });

                queue.enqueue(player1, player1Priority + 1);
                queue.enqueue(player2, player2Priority + 1);

                // Todo Send client that he has won
                // ! You was here create match:won emit or so

                // Send tournament info with new score
                const tInfo = await getTournamentInfo(
                  tournamentId,
                  'Tournament started'
                );

                io.in(`tournament:${tournamentId}`)
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  .emit('tournament:info', tInfo!);
              } else {
                await prismaClient.match.update({
                  where: { id: match.id },
                  data: { status: 'IN_PROGRESS' }
                });
                // both accepted
                socketPlayer1.join(`tournament-match:${match.id}`);
                socketPlayer2.join(`tournament-match:${match.id}`);

                // Todo send match begin

                // Todo send players back in queue after their match
              }
            }
          }
        );
    }

    // recursive call
    matchmaking(io, tournamentId);
  }, config.matchMaking.timeoutInterval);
};
