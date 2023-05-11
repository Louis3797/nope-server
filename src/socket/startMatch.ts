import type { RemoteSocket, Server } from 'socket.io';
import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData
} from '../types/socket';
import { matchMakingQueues } from '../app';
import prismaClient from '../config/prisma';
import GameState from '../model/GameState';
import config from '../config/config';
import { getTournamentInfo } from '../service/tournament.service';
import type { Prisma } from '@prisma/client';

interface MatchPlayer {
  id: string;
  username: string;
  socket: RemoteSocket<ServerToClientEvents<false>, SocketData>;
  points: number;
  priority: number;
}

interface Opponents {
  player1: MatchPlayer;
  player2: MatchPlayer;
}

const startMatch = async (
  io: Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >,
  opponents: Opponents,
  tournamentId: string,
  matchId: string,
  bestOf: number
): Promise<void> => {
  while (true) {
    // create game instance
    const game = new GameState({
      players: [
        {
          id: opponents.player1.id,
          username: opponents.player1.username,
          socket: opponents.player1.socket,
          hand: [],
          cheated: false
        },
        {
          id: opponents.player2.id,
          username: opponents.player2.username,
          socket: opponents.player2.socket,
          hand: [],
          cheated: false
        }
      ],
      currentPlayer: null,
      currentPlayerIdx: null,
      prevPlayer: null,
      prevPlayerIdx: null,
      winner: null,
      direction: 1,
      topCard: null,
      lastTopCard: null,
      drawPile: [],
      discardPile: [],
      prevTurnCards: [],
      lastMove: null
    });

    // update match
    const match = await prismaClient.match.update({
      where: { id: matchId },
      data: { round: { increment: 1 } },
      select: { id: true, round: true, status: true }
    });

    // create game in db and connect players and match
    const createdGame = await prismaClient.game.create({
      data: {
        roomSize: 2,
        playerCount: 2,
        players: {
          connect: [{ id: opponents.player1.id }, { id: opponents.player2.id }]
        },
        gameMode: 'TOURNAMENT',
        status: 'IN_PROGRESS',
        private: true,
        match: { connect: { id: matchId } }
      }
    });

    io.to([opponents.player1.socket.id, opponents.player2.socket.id]).emit(
      'match:info',
      {
        message: `Round ${match.round} in the match ${opponents.player1.username} vs. ${opponents.player2.username} will start in 5 seconds`,
        tournamentId,
        match: {
          id: match.id,
          round: match.round,
          bestOf,
          status: match.status,
          winner: null,
          opponents: [
            {
              id: opponents.player1.id,
              username: opponents.player1.username,
              points: opponents.player1.points
            },
            {
              id: opponents.player2.id,
              username: opponents.player2.username,
              points: opponents.player2.points
            }
          ]
        }
      }
    );

    // Wait 5 seconds
    // eslint-disable-next-line promise/avoid-new
    await new Promise((resolve) => setTimeout(resolve, 5000));

    let isEnd = false;

    while (!isEnd) {
      const state = game.getState();

      const {
        players,
        topCard,
        lastTopCard,
        drawPile,
        currentPlayer,
        currentPlayerIdx,
        prevPlayer,
        prevPlayerIdx,
        prevTurnCards,
        lastMove
      } = state;

      const playersData: Array<{
        username: string;
        id: string;
        handSize: number;
      }> = [];

      players.forEach((p) =>
        playersData.push({
          id: p.id,
          username: p.username,
          handSize: p.hand.length
        })
      );

      // send state to both players
      for (const player of players) {
        player.socket.emit('game:state', {
          matchId,
          gameId: createdGame.id,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          topCard: topCard!,
          lastTopCard,
          drawPileSize: drawPile.length,
          players: playersData,
          hand: player.hand,
          handSize: player.hand.length,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          currentPlayer: currentPlayer!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          currentPlayerIdx: currentPlayerIdx!,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          prevPlayer: prevPlayer!,
          prevPlayerIdx,
          prevTurnCards,
          lastMove
        });
      }

      // Wait 2 seconds for next turn
      // eslint-disable-next-line promise/avoid-new
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const currPlayer = players.find((p) => p.id === currentPlayer!.id)!;

      const turnTimeout = new Date(
        new Date().getTime() + config.game.turnTimeout
      ).getTime();

      // request turn from current player

      // eslint-disable-next-line promise/avoid-new
      await new Promise((resolve) => {
        currPlayer.socket.timeout(10000).emit(
          'game:makeMove',
          {
            message: `It's your turn ${currPlayer.username}!`,
            timeout: turnTimeout
          },
          async (err, response) => {
            if (err) {
              // Timeout means the other player wins the game

              // get winner
              const winner =
                opponents.player1.id === currPlayer.id
                  ? opponents.player2
                  : opponents.player1;

              // Emit cheating and game end to players
              io.to([
                opponents.player1.socket.id,
                opponents.player2.socket.id
              ]).emit('game:status', {
                message: `${currPlayer.username} is disqualified from the game, because he did not answer in time. This means that ${winner.username} won this game`,
                winner: {
                  id: winner.id,
                  username: winner.username,
                  points: winner.points
                }
              });

              // there are two players in this array so find returns not undefined
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const findWinner = game
                .getState()
                .players.find((p) => p.id === winner.id)!;

              game.setWinner(findWinner);

              // end game
              isEnd = true;
            } else {
              // 1. Check move
              // 2. not conform = handle cheating
              // 3. conform update game state
              // 4. if return of updateState is null its most likely because of cheating
              // loop

              const conform = game.checkMove(response);

              // if move is not conform
              if (!conform) {
                // handle cheating

                // get winner
                const winner =
                  opponents.player1.id === currPlayer.id
                    ? opponents.player2
                    : opponents.player1;

                // Emit cheating and game end to players
                io.to([
                  opponents.player1.socket.id,
                  opponents.player2.socket.id
                ]).emit('game:status', {
                  message: `${currPlayer.username} is disqualified from the game for cheating. This means that ${winner.username} won this game`,
                  winner: {
                    id: winner.id,
                    username: winner.username,
                    points: winner.points
                  }
                });
                // there are two players in this array so find returns not undefined
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const findWinner = game
                  .getState()
                  .players.find((p) => p.id === winner.id)!;

                game.setWinner(findWinner);

                // end game
                isEnd = true;
              } else {
                // handle conform move
                const newGameState = game.updateState(response);

                if (!newGameState) {
                  // handle cheating

                  // get winner
                  const winner =
                    opponents.player1.id === currPlayer.id
                      ? opponents.player2
                      : opponents.player1;

                  // Emit cheating and game end to players
                  io.to([
                    opponents.player1.socket.id,
                    opponents.player2.socket.id
                  ]).emit('game:status', {
                    message: `${currPlayer.username} is disqualified from the game for cheating. This means that ${winner.username} won this game`,
                    winner: {
                      id: winner.id,
                      username: winner.username,
                      points: winner.points
                    }
                  });
                  // there are two players in this array so find returns not undefined
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const findWinner = game
                    .getState()
                    .players.find((p) => p.id === winner.id)!;

                  game.setWinner(findWinner);

                  // end game
                  isEnd = true;
                } else {
                  // check if game ended
                  isEnd = game.isWon();
                }
              }
            }
            resolve(response);
          }
        );
      });
    }

    // Game ended

    const lastGameState = game.getState();

    // update data in players
    if (opponents.player1.id === lastGameState.winner?.id) {
      opponents.player1.points += 1;
    } else {
      opponents.player2.points += 1;
    }

    // update game in db

    await prismaClient.game.update({
      where: { id: createdGame.id },
      data: {
        status: 'FINISHED',
        endedAt: new Date(),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        winner: { connect: { id: lastGameState.winner!.id } },
        moveHistory: game.getHistory() as unknown as Prisma.JsonArray
      }
    });

    // emit last gameState to players
    const {
      players: gamePlayers,
      topCard,
      lastTopCard,
      drawPile,
      currentPlayer,
      currentPlayerIdx,
      prevPlayer,
      prevPlayerIdx,
      prevTurnCards,
      lastMove
    } = lastGameState;

    const playersData: Array<{
      username: string;
      id: string;
      handSize: number;
    }> = [];

    gamePlayers.forEach((p) =>
      playersData.push({
        id: p.id,
        username: p.username,
        handSize: p.hand.length
      })
    );

    // send state to both players
    for (const player of gamePlayers) {
      player.socket.emit('game:state', {
        matchId,
        gameId: createdGame.id,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        topCard: topCard!,
        lastTopCard,
        drawPileSize: drawPile.length,
        players: playersData,
        hand: player.hand,
        handSize: player.hand.length,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currentPlayer: currentPlayer!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currentPlayerIdx: currentPlayerIdx!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        prevPlayer: prevPlayer!,
        prevPlayerIdx,
        prevTurnCards,
        lastMove
      });
    }

    const gameWinner =
      opponents.player1.id === lastGameState.winner?.id
        ? opponents.player1
        : opponents.player2;

    const gameLoser =
      opponents.player1.id !== lastGameState.winner?.id
        ? opponents.player1
        : opponents.player2;

    // Emit winner of the game to both
    io.to([opponents.player1.socket.id, opponents.player2.socket.id]).emit(
      'game:status',
      {
        message: `${lastGameState.winner?.username} won the game of round ${match.round}`,
        winner: {
          id: gameWinner.id,
          username: gameWinner.username,
          points: gameWinner.points
        }
      }
    );

    const tInfo = await getTournamentInfo(
      tournamentId,
      `${gameWinner.username} won a game in the match between ${gameWinner.username} vs. ${gameLoser.username}. The score is now ${gameWinner.points} to ${gameLoser.points}.`
    );

    io.to(`tournament:${tournamentId}`)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
      .emit('tournament:info', tInfo!);

    // check if all games are played
    if (gameWinner.points > bestOf / 2) {
      // else

      // find match winner
      const matchWinner =
        opponents.player1.points > opponents.player2.points
          ? opponents.player1
          : opponents.player2;

      // update match data
      await prismaClient.match.update({
        where: { id: matchId },
        data: {
          status: 'FINISHED',
          winner: { connect: { id: matchWinner.id } }
        }
      });

      const [player1Statistic, player2Statistic] =
        await prismaClient.$transaction([
          prismaClient.tournamentStatistic.findFirst({
            where: {
              tournamentId,
              playerId: opponents.player1.id
            },
            select: { id: true }
          }),
          prismaClient.tournamentStatistic.findFirst({
            where: {
              tournamentId,
              playerId: opponents.player2.id
            },
            select: { id: true }
          })
        ]);

      await prismaClient.$transaction([
        prismaClient.tournamentStatistic.update({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          where: { id: player1Statistic!.id },
          data: {
            gamesPlayed: match.round,
            wonGames: { increment: opponents.player1.points },
            lostGames: { increment: opponents.player2.points },
            matchesPlayed: { increment: 1 },
            wonMatches: {
              increment: matchWinner.id === opponents.player1.id ? 1 : 0
            },
            lostMatches: {
              increment: matchWinner.id === opponents.player1.id ? 0 : 1
            }
          }
        }),
        prismaClient.tournamentStatistic.update({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          where: { id: player2Statistic!.id },
          data: {
            gamesPlayed: match.round,
            wonGames: { increment: opponents.player2.points },
            lostGames: { increment: opponents.player1.points },
            matchesPlayed: { increment: 1 },
            wonMatches: {
              increment: matchWinner.id === opponents.player2.id ? 1 : 0
            },
            lostMatches: {
              increment: matchWinner.id === opponents.player2.id ? 0 : 1
            }
          }
        })
      ]);

      // remove players from room
      io.in(`tournament-match:${match.id}`).socketsLeave(
        `tournament-match:${match.id}`
      );

      // Put players back in the queue
      const queue = matchMakingQueues.get(tournamentId);

      if (!queue) return;

      queue.enqueue(
        { id: opponents.player1.id, username: opponents.player1.username },
        opponents.player1.priority + 1
      );
      queue.enqueue(
        { id: opponents.player2.id, username: opponents.player2.username },
        opponents.player2.priority + 1
      );
      return;
    }
  }
};

export default startMatch;
