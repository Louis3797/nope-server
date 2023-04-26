import type {
  BasicPlayer,
  ITournamentRoom,
  TournamentPlayer
} from '../interfaces';

export default class TournamentRoom {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private options: ITournamentRoom;

  constructor(props: ITournamentRoom) {
    this.options = props;
  }

  start(): void {
    if (!this.options.started) {
      this.options.started = true;
    }
  }

  /**
   * Generates the Matches for the Tournament
   * In each tournament each player must play against
   * each other in a 1 vs. 1 of a best of match
   */
  generateMatches(): void {
    const { players, matches } = this.options;
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        // eslint-disable-next-line security/detect-object-injection
        const pair = {
          player1: players.at(i)?.id as string,
          player2: players.at(j)?.id as string
        };
        matches.push(pair);
      }
    }

    this.options.numMatches = matches.length;
  }

  getAvailableMatches(): Array<{ player1: string; player2: string }> {
    const availableMatches = [];
    for (const match of this.options.matches) {
      const player1 = this.options.players.find(
        (player) => player.id === match.player1
      );
      const player2 = this.options.players.find(
        (player) => player.id === match.player2
      );
      if (!player1?.inMatch && !player2?.inMatch) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        availableMatches.push({ player1: player1!.id, player2: player2!.id });
      }
    }
    return availableMatches;
  }

  assignPlayersToMatch(player1Id: string, player2Id: string): void {
    const player1 = this.options.players.find(
      (player) => player.id === player1Id
    );
    const player2 = this.options.players.find(
      (player) => player.id === player2Id
    );

    if (!player1 || !player2) {
      throw new Error('One or both players are not in this tournament');
    }

    if (player1.inMatch || player2.inMatch) {
      throw new Error('One or both players are already in a match');
    }

    player1.inMatch = true;
    player2.inMatch = true;
  }

  increaseRound(): void {
    this.options.currentRound++;
  }

  addPlayer(player: BasicPlayer): boolean {
    // cant add player if tournament already started
    if (this.options.started) return false;

    const { id, username, socket } = player;

    this.options.players.push({
      id,
      username,
      socket,
      inMatch: false,
      wonMatches: 0
    });

    this.options.playerCount++;
    return true;
  }

  removePlayer(playerId: string): boolean {
    this.options.players = this.options.players.filter(
      (p) => p.id !== playerId
    );

    this.options.playerCount--;

    // Todo check also if we need to adjust the match lists and so on
    // Todo what is when the tournament started ???

    return true;
  }

  getAllPlayers(): TournamentPlayer[] {
    return this.options.players;
  }
}
