import type { GamePlayer, ICard, IGameRoom } from '../interfaces';
import { shuffle } from '../utils/';

export default class GameRoom {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  private props: IGameRoom;

  constructor(props: IGameRoom) {
    this.props = props;
    this.props.started = false; // as a precautionary measure
  }

  /**
   * Starts the game if called and the player count is greater than 1
   * Also calls generatePile()
   */
  startGame(): void {
    if (this.props.playerCount > 1) {
      this.props.started = true;
      this.generatePile();
    }
  }

  /**
   * Adds a player to the game
   * @param player Player
   * @returns Returns void
   */
  addPlayer(player: GamePlayer): void {
    if (this.props.playerCount < this.props.maxRoomSize) {
      return; // Todo Add error handling
    }
    this.props.players.push(player);
    this.props.playerCount++;
  }

  nextTurn(): void {
    if (
      this.props.started &&
      this.props.currentPlayerIndex &&
      this.props.players.length > 1
    ) {
      const nextPlayerIdx =
        (this.props.currentPlayerIndex + 1) % this.props.players.length;

      // eslint-disable-next-line security/detect-object-injection
      this.props.currentPlayer = this.props.players[
        nextPlayerIdx
      ] as GamePlayer;
      this.props.currentPlayerIndex = nextPlayerIdx;
    }
  }

  playCard(card: ICard | null | undefined): void {
    if (this.props.started && this.isConformMove(card) && card) {
      this.props.topCard = card;
      this.props.discardPile.unshift(card);

      this.props.drawPileSize++;
      // Todo Add check for winner
      this.nextTurn();
    }
  }

  /**
   * Checks if the move if conform or not
   * @param card Played Card from the player
   * @returns Returns true of move is compliant
   */
  isConformMove(card: ICard | null | undefined): boolean {
    // Todo check move more properly
    // Todo store move in db

    if (!card) return false;

    // Check if player has the card in the hand
    const foundCard = this.props.currentPlayer?.hand.find((c) => c === card);

    // Check top card

    return Boolean(foundCard);
  }

  /**
   * Generates the draw card pile with all cards for the game and calls dispenseCards()
   * @returns Returns void
   */
  generatePile(): void {
    if (!this.props.started) return;

    const pile = this.props.drawPile;

    // Add 2 Value 1 Cards, 2 Value 2 Cards and 1 Value 3 Card in each color (Red, Green, Blue, Yellow)
    for (const color of ['red', 'green', 'blue', 'yellow']) {
      for (const value of [1, 1, 2, 2, 3]) {
        pile.push({
          type: 'number',
          color: color as 'red' | 'green' | 'blue' | 'yellow',
          value: value as 1 | 2 | 3
        });
      }
    }

    // Add the double color cards
    const values = [
      { value: 1, count: 8 },
      { value: 2, count: 8 },
      { value: 3, count: 6 }
    ];

    const cards: ICard[] = ['red-yellow', 'blue-green', 'yellow-blue'].flatMap(
      (color) =>
        values.flatMap(({ value, count }) =>
          Array<ICard>(count).fill({
            type: 'number',
            color: color as 'red-yellow' | 'blue-green' | 'yellow-blue',
            value: value as 1 | 2 | 3
          })
        )
    );

    pile.push(...cards);

    // Add 4 Joker cards
    for (let i = 0; i < 4; i++) {
      pile.push({
        type: 'joker',
        color: null,
        value: null
      });
    }

    // Todo uncomment action cards

    // // Add 4 Reboot cards
    // for (let i = 0; i < 4; i++) {
    //   pile.push({
    //     type: 'reboot',
    //     color: null,
    //     value: null
    //   });
    // }

    // // Add 4 See through cards
    // for (let i = 0; i < 4; i++) {
    //   pile.push({
    //     type: 'see-through',
    //     color: null,
    //     value: null
    //   });
    // }

    // // Add 4 Selection cards
    // for (let i = 0; i < 6; i++) {
    //   pile.push({
    //     type: 'selection',
    //     color: null,
    //     value: null
    //   });
    // }

    shuffle(pile);
    // There are 104 cards at the beginning

    this.dispenseCards();

    this.props.topCard = pile.unshift() as unknown as ICard;

    this.props.drawPileSize = this.props.drawPile.length;
  }

  /**
   * Dispenses 7 Cards too each player at the beginning of the game
   * @returns Returns void
   */
  dispenseCards(): void {
    if (this.props.playerCount <= 1 || !this.props.started) return;

    // playerCount * 7, bc every playe gets 7 cards at the beginning
    for (let i = 0; i < this.props.players.length * 7; i++) {
      const player = this.props.players[
        i % this.props.players.length
      ] as GamePlayer;

      const card = this.props.drawPile.shift();
      player.hand.push(card as ICard);
      player.handSize++;
    }

    this.props.drawPileSize = this.props.drawPile.length;

    // Send player the cards
    // Todo change event later to the right one
    this.props.players.forEach((player) => {
      player.socket.to(player.socket.id).emit('game:update', player.hand);
    });
  }
}
