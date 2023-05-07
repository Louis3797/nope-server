/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/prefer-readonly */
import { shuffle } from '../utils';
import type {
  GamePlayer,
  ICard,
  IGameState,
  Move,
  MoveHistoryObject,
  State
} from '../interfaces';
import { v4 } from 'uuid';

export default class GameState implements IGameState {
  private readonly state: State;
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  private moveNumber: number = 1;
  private readonly history: Array<{
    move: MoveHistoryObject | null;
    state: State;
  }> = [];

  constructor(state: State) {
    this.state = state;

    this.generateDeck();
    shuffle(this.state.drawPile);

    // Give cards to player
    this.dispenseCards();

    // set top card
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.state.topCard = this.state.drawPile.shift()!;

    // also put top card on discardPile
    this.state.discardPile.unshift(this.state.topCard);

    this.nextPlayer();
  }

  /**
   * Checks if the given move is conform or not
   * @param move Move object
   * @returns Returns true by conform move, otherwise false
   */
  checkMove = (move: Move): boolean => {
    const { currentPlayerIdx, players, topCard, lastMove } = this.state;
    const currentPlayerHand = players[currentPlayerIdx!]!.hand;
    if (!topCard) return false;

    switch (move.type) {
      case 'take':
        if (lastMove && lastMove.type === 'take') return false;
        // true if player defined no cards in his move and also has no cards in his hand he can place
        return (
          !(move.card1 || move.card2 || move.card3) && !this.canPlaceCard()
        );
      case 'put': {
        if (!move.card1 || currentPlayerHand.length < 1) {
          return false; // first card is not defined or hand is empty;
        }

        const { value: topCardValue, color: topCardColor } = topCard;

        if (!topCardColor) return false; // top card not defined

        const { card1, card2, card3 } = move;

        if (card1 && !card2 && !card3) {
          if (!this.isConformCard(card1)) return false; // not a conform card
          if (topCardValue !== 1 || !card1.color?.includes(topCardColor)) {
            return false; // not enough cards or not the right color
          }
          const card1InHand = currentPlayerHand.some(
            (c) => c.color === card1.color && c.value === card1.value
          );
          return card1InHand; // true if player has the card in his hand
        }
        if (card1 && card2 && !card3) {
          if (!this.isConformCard(card1) || !this.isConformCard(card2)) {
            return false; // not a conform card
          }
          if (
            topCardValue !== 2 ||
            !card1.color?.includes(topCardColor) ||
            !card2.color?.includes(topCardColor)
          ) {
            return false; // false amount of placed cards or false color
          }
          const card1InHand = currentPlayerHand.some(
            (c) => c.color === card1.color && c.value === card1.value
          );
          const card2InHand = currentPlayerHand.some(
            (c) => c.color === card2.color && c.value === card2.value
          );
          return card1InHand && card2InHand; // true if player has specified cards in hand
        }
        if (card1 && card2 && card3) {
          if (
            !this.isConformCard(card1) ||
            !this.isConformCard(card2) ||
            !this.isConformCard(card3)
          ) {
            return false; // not a conform card
          }
          if (
            topCardValue !== 3 ||
            !card1.color?.includes(topCardColor) ||
            !card2.color?.includes(topCardColor) ||
            !card3.color?.includes(topCardColor)
          ) {
            return false; // false amount of placed cards or false color
          }
          const card1InHand = currentPlayerHand.some(
            (c) => c.color === card1.color && c.value === card1.value
          );
          const card2InHand = currentPlayerHand.some(
            (c) => c.color === card2.color && c.value === card2.value
          );
          const card3InHand = currentPlayerHand.some(
            (c) => c.color === card3.color && c.value === card3.value
          );
          return card1InHand && card2InHand && card3InHand; // true if player has specified cards in hand
        }
        return false; // fallback
      }
      case 'nope':
        // if null or last move was not a take return false
        if (!lastMove || lastMove.type !== 'take') return false;
        // check if cards are all null
        if (move.card1 || move.card2 || move.card3) return false;

        if (this.canPlaceCard()) {
          return true; // player can place card
        }

        return true;
      default:
        return false;
    }
  };

  updateState = (move: Move): State | null => {
    const compliant = this.checkMove(move);

    if (!compliant) return null;

    const {
      players,
      currentPlayerIdx,
      drawPile,
      topCard,
      discardPile,
      prevTurnCards
    } = this.state;

    // get currentPlayer
    const currentPlayer = players[currentPlayerIdx! % players.length];

    if (!currentPlayer) return null; // currentPlayer is null

    // update last move
    this.state.lastMove = move;

    switch (move.type) {
      case 'take':
        // check if drawPile is empty
        if (!drawPile.length) {
          this.refillDrawPile();
        }

        // Give currentPlayer a card
        currentPlayer.hand.push(drawPile.shift()!); // drawPile must be full, bc we refilled at the beginning of put when not
        prevTurnCards.splice(0, prevTurnCards.length); // empty prevTurnCards

        // make the currentPlayer the prevPlayer but let him currentPlayer
        this.state.prevPlayer = currentPlayer;
        this.state.prevPlayerIdx = currentPlayerIdx;

        this.updateHistory(move, compliant);
        return this.state;

      case 'put': {
        const { card1, card2, card3 } = move;

        // remove cards from player hand
        if (card1 && !card2 && !card3) {
          const index = currentPlayer.hand.indexOf(card1);
          if (index !== -1) {
            currentPlayer.hand.splice(index, 1);
          }
        } else if (card1 && card2 && !card3) {
          const index1 = currentPlayer.hand.indexOf(card1);
          const index2 = currentPlayer.hand.indexOf(card2);
          if (index1 !== -1) {
            currentPlayer.hand.splice(index1, 1);
          }
          if (index2 !== -1) {
            currentPlayer.hand.splice(index2, 1);
          }
        } else if (card1 && card2 && card3) {
          const index1 = currentPlayer.hand.indexOf(card1);
          const index2 = currentPlayer.hand.indexOf(card2);
          const index3 = currentPlayer.hand.indexOf(card3);
          if (index1 !== -1) {
            currentPlayer.hand.splice(index1, 1);
          }
          if (index2 !== -1) {
            currentPlayer.hand.splice(index2, 1);
          }
          if (index3 !== -1) {
            currentPlayer.hand.splice(index3, 1);
          }
        }

        // add cards
        this.state.prevTurnCards = [card1, card2, card3].filter(
          Boolean
        ) as ICard[];

        // add cards to discardPile
        if (card1) {
          discardPile.unshift(card1);
        }
        if (card2) {
          discardPile.unshift(card2);
        }
        if (card3) {
          discardPile.unshift(card3);
        }

        this.state.lastTopCard = topCard;
        this.state.topCard = discardPile.shift() ?? null;

        this.updateHistory(move, compliant);
        // Next players turn
        this.nextPlayer();
        return this.state;
      }
      case 'nope':
        prevTurnCards.splice(0, prevTurnCards.length); // empty prevTurnCards

        this.updateHistory(move, compliant);

        // Next players turn
        this.nextPlayer();
        return this.state;
      default:
        return null;
    }
  };

  /**
   * Generates the cards and the drawPile
   */
  private generateDeck = (): void => {
    const pile = this.state.drawPile;

    // Add 2 Value 1 Cards, 2 Value 2 Cards and 1 Value 3 Card in each color (Red, Green, Blue, Yellow)
    for (const color of ['red', 'green', 'blue', 'yellow']) {
      for (const value of [1, 1, 2, 2, 3]) {
        pile.push({
          type: 'number',
          color: color as 'red' | 'green' | 'blue' | 'yellow',
          value
        });
      }
    }

    // Add the double color cards
    const values = [
      { value: 1, count: 4 },
      { value: 2, count: 4 },
      { value: 3, count: 3 }
    ];

    // Todo add the other cards
    const doubleColorCards: ICard[] = [
      'red-yellow',
      'blue-green',
      'yellow-blue',
      'red-blue',
      'red-green',
      'yellow-green'
    ].flatMap((color) =>
      values.flatMap(({ value, count }) =>
        Array<ICard>(count).fill({
          type: 'number',
          color: color as
            | 'red-yellow'
            | 'blue-green'
            | 'yellow-blue'
            | 'red-blue'
            | 'red-green'
            | 'yellow-green',
          value
        })
      )
    );

    pile.push(...doubleColorCards);

    // // Add 4 Joker cards
    // for (let i = 0; i < 4; i++) {
    //   pile.push({
    //     type: 'joker',
    //     color: null,
    //     value: null
    //   });
    // }
  };

  /**
   * Fill player hands on start of the game
   */
  private dispenseCards = (): void => {
    for (let i = 0; i < this.state.players.length * 7; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const player = this.state.players.at(i % this.state.players.length)!;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const card = this.state.drawPile.shift()!;
      player?.hand.push(card);
    }
  };

  private nextPlayer = (): void => {
    const { players } = this.state;

    if (players.length > 0) {
      // first call
      if (!this.state.currentPlayerIdx) {
        this.state.currentPlayerIdx = 0;
        const next = players[this.state.currentPlayerIdx % players.length]!;
        this.state.currentPlayer = { id: next?.id, username: next?.username };
        return;
      }

      // make last current player to prev player
      this.state.prevPlayerIdx = this.state.currentPlayerIdx;
      this.state.prevPlayer = this.state.currentPlayer;

      // get new idx of current player
      this.state.currentPlayerIdx =
        (this.state.currentPlayerIdx + this.state.direction) % players.length;

      // get player
      const next = players[this.state.currentPlayerIdx % players.length]!;

      // set current player
      this.state.currentPlayer = { id: next?.id, username: next?.username };
    }
  };

  /**
   * Refills draw pile with discarded cards from the discard pile
   * if the drawPile is empty
   */
  private refillDrawPile = (): void => {
    const drawPile = this.state.drawPile;
    let discardPile = this.state.discardPile;

    if (discardPile.length >= 2 && drawPile.length === 0) {
      const newDiscardPile: ICard[] = [];

      // get top card
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const topCard: ICard = discardPile.shift()!;

      // put topcard back on top
      newDiscardPile.push(topCard);

      drawPile.push(...discardPile);
      discardPile = newDiscardPile;

      shuffle(drawPile);

      // will be put back in the draw pile
      this.state.lastTopCard = null;
    }
  };

  /**
   * Checks if only one player in the game has cards in his hand
   * @returns Returns true if only one player has cards in his hand
   */
  isWon = (): boolean => {
    const notEmptyHands = this.state.players.filter((p) => p.hand.length !== 0);

    // if one player has not an empty hand than he has won the game

    if (notEmptyHands.length === 1) {
      this.state.winner = notEmptyHands[0]!;
      return true;
    }

    return false;
  };

  // Todo update for action cards later
  /**
   * Check if the player has enough cards on his hand for what the top card requests
   * @returns Returns true if the player has enough cards to place
   */
  private canPlaceCard = (): boolean => {
    const topCard = this.state.topCard;
    if (topCard) {
      const topCardValue = topCard.value!;
      const topCardColor = topCard.color!;

      const currPlayer = this.state.players.find(
        (p) => p.id === this.state.currentPlayer?.id
      )!;
      const placableCards = currPlayer.hand.filter((card) =>
        card.color!.includes(topCardColor)
      );
      return placableCards.length >= topCardValue;
    }
    return false;
  };

  private isConformCard = (card: ICard): boolean => {
    return (
      this.isConformJokerCard(card) ||
      this.isConformNumberCard(card) ||
      this.isConformRebootCard(card) ||
      this.isConformSeeThroughCard(card) ||
      this.isConformSelectionCard(card)
    );
  };

  private isConformNumberCard = (card: ICard): boolean => {
    if (card.type !== 'number') return false;

    // card value is null or undefined and not in range of 1 to 3
    if (!card.value || card.value < 1 || card?.value > 3) return false;

    // check color
    if (!card.color || card.color === 'multi') return false;

    // check if other values are not set to null
    if (card.select || card.selectValue || card.selectedColor) return false;
    return true;
  };

  private isConformJokerCard = (_card: ICard): boolean => {
    return true;
  };

  private isConformSeeThroughCard = (_card: ICard): boolean => {
    return true;
  };

  private isConformRebootCard = (_card: ICard): boolean => {
    return true;
  };

  private isConformSelectionCard = (_card: ICard): boolean => {
    return true;
  };

  private updateHistory = (move: Move, compliant: boolean): void => {
    const temp = {
      state: this.state,
      move: {
        id: v4(),
        moveNumber: this.moveNumber,
        createdAt: new Date().toISOString(),
        playerId: this.state.currentPlayer!.id,
        move,
        reason: move.reason,
        compliant
      }
    };

    this.history.push(temp);

    this.moveNumber++;
  };

  getHistory = (): Array<{
    move: MoveHistoryObject | null;
    state: State;
  }> => {
    return this.history;
  };

  getState = (): State => {
    return this.state;
  };

  setWinner = (winner: GamePlayer) => {
    this.state.winner = winner;
  };
}
