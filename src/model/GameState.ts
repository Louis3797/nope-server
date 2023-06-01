/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/prefer-readonly */
import type {
  GamePlayer,
  ICard,
  IGameState,
  Move,
  MoveHistoryObject,
  State
} from '../interfaces';
import {
  indexOfCardInHand,
  isCardInHand,
  sameCardColor,
  shuffle
} from '../utils';
import { v4 } from 'uuid';

export default class GameState implements IGameState {
  // State of the game
  private readonly state: State;

  // Counter for the move history
  private moveNumber = 1;

  // Stores each move of the players
  private readonly history: MoveHistoryObject[] = [];

  /**
   * Constructor of the class
   * @param state Beginn State of the game
   */
  constructor(state: State) {
    this.state = state;

    this.generateDeck();
    this.state.drawPile = shuffle(this.state.drawPile);

    // Give cards to player
    this.dispenseCards();

    // set top card
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.state.topCard = this.state.drawPile.shift()!;

    // also put top card on discardPile
    this.state.discardPile.unshift(this.state.topCard);

    this.state.currentPlayerIdx = 0;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const next = this.state.players[this.state.currentPlayerIdx]!;
    this.state.currentPlayer = { id: next?.id, username: next?.username };
  }

  /**
   * Checks if the given move is conform or not
   * @param move Move object
   * @returns Returns true by conform move, otherwise false
   */
  checkMove = (move: Move): boolean => {
    console.log('move', move);
    switch (move?.type) {
      case 'take':
        return this.checkTake(move);
      case 'put':
        console.log('put');
        return this.checkPut(move);
      case 'nope':
        return this.checkNope(move);
      default:
        return false;
    }
  };

  private checkTake = (move: Move): boolean => {
    const { topCard, lastMove } = this.state;

    if (!topCard) return false;

    if (lastMove && lastMove.type === 'take') return false;
    // true if player defined no cards in his move and also has no cards in his hand he can place

    console.log(this.canPlaceCard());
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return !(move.card1 || move.card2 || move.card3) && !this.canPlaceCard();
  };

  private checkPut = (move: Move): boolean => {
    console.log(this.state.currentPlayer);
    const { currentPlayerIdx, players, topCard } = this.state;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentPlayerHand = players[currentPlayerIdx!]!.hand;

    if (!topCard) return false;

    if (!move.card1 || currentPlayerHand.length < 1) {
      return false; // first card is not defined or hand is empty;
    }

    const { value: topCardValue, color: topCardColor } = topCard;

    if (!topCardColor) return false; // top card not defined

    const { card1, card2, card3 } = move;

    if (card1 && !card2 && !card3) {
      if (!this.isConformCard(card1)) return false; // not a conform card

      if (topCardValue !== 1 || !sameCardColor(topCard, card1)) {
        return false; // not enough cards or not the right color
      }

      const card1InHand = isCardInHand(card1, currentPlayerHand);
      return card1InHand; // true if player has the card in his hand
    }
    if (card1 && card2 && !card3) {
      if (!this.isConformCard(card1) || !this.isConformCard(card2)) {
        return false; // not a conform card
      }
      if (
        topCardValue !== 2 ||
        !sameCardColor(topCard, card1) ||
        !sameCardColor(topCard, card2)
      ) {
        return false; // false amount of placed cards or false color
      }
      const card1InHand = isCardInHand(card1, currentPlayerHand);
      const card2InHand = isCardInHand(card2, currentPlayerHand);
      return card1InHand && card2InHand; // true if player has specified cards in hand
    }
    if (card1 && card2 && card3) {
      console.log('this.isConformCard(card1)', this.isConformCard(card1));
      console.log('this.isConformCard(card2)', this.isConformCard(card2));
      console.log('this.isConformCard(card3)', this.isConformCard(card2));
      if (
        !this.isConformCard(card1) ||
        !this.isConformCard(card2) ||
        !this.isConformCard(card3)
      ) {
        return false; // not a conform card
      }

      console.log('topcard value', topCardValue);
      console.log(
        'sameCardColor(topCard, card1)',
        sameCardColor(topCard, card1)
      );
      console.log(
        'sameCardColor(topCard, card2)',
        sameCardColor(topCard, card2)
      );
      console.log(
        'sameCardColor(topCard, card3)',
        sameCardColor(topCard, card3)
      );
      if (
        topCardValue !== 3 ||
        !sameCardColor(topCard, card1) ||
        !sameCardColor(topCard, card2) ||
        !sameCardColor(topCard, card3)
      ) {
        return false; // false amount of placed cards or false color
      }

      console.log(
        'isCardInHand(card1, currentPlayerHand)',
        isCardInHand(card1, currentPlayerHand)
      );
      console.log(
        'isCardInHand(card2 currentPlayerHand)',
        isCardInHand(card2, currentPlayerHand)
      );
      console.log(
        'isCardInHand(card3, currentPlayerHand)',
        isCardInHand(card3, currentPlayerHand)
      );
      const card1InHand = isCardInHand(card1, currentPlayerHand);
      const card2InHand = isCardInHand(card2, currentPlayerHand);
      const card3InHand = isCardInHand(card3, currentPlayerHand);

      return card1InHand && card2InHand && card3InHand; // true if player has specified cards in hand
    }
    return false; // fallback
  };

  private checkNope = (move: Move): boolean => {
    const { topCard, lastMove } = this.state;

    if (!topCard) return false;

    // if null or last move was not a take return false
    if (!lastMove || lastMove.type !== 'take') return false;
    // check if cards are all null
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (move.card1 || move.card2 || move.card3) return false;

    if (this.canPlaceCard()) {
      return false; // player can place card
    }

    return true;
  };

  /**
   * Updates the state of the game with the given Move
   * @param move Action from the player
   * @returns Returns the new state of the game
   */
  updateState = (move: Move): State | null => {
    const compliant = this.checkMove(move);

    console.log('compliant move', compliant);

    this.updateHistory(move, compliant);
    if (!compliant) return null;

    const { players, currentPlayerIdx, drawPile, discardPile, prevTurnCards } =
      this.state;

    // get currentPlayer
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const currentPlayer = players[currentPlayerIdx! % players.length];

    if (!currentPlayer) return null; // currentPlayer is null

    switch (move?.type) {
      case 'take':
        // check if drawPile is empty
        if (!drawPile.length) {
          this.refillDrawPile();
        }

        // Give currentPlayer a card
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        currentPlayer.hand.push(drawPile.shift()!); // drawPile must be full, bc we refilled at the beginning of put when not
        prevTurnCards.splice(0, prevTurnCards.length); // empty prevTurnCards

        // make the currentPlayer the prevPlayer but let him currentPlayer
        this.state.prevPlayer = {
          id: currentPlayer.id,
          username: currentPlayer.username
        };
        this.state.prevPlayerIdx = currentPlayerIdx;

        // update last move
        this.state.lastMove = move;
        return this.state;

      case 'put': {
        const { card1, card2, card3 } = move;

        // remove cards from player hand
        if (card1 && !card2 && !card3) {
          const index = indexOfCardInHand(card1, currentPlayer.hand);
          if (index !== -1) {
            currentPlayer.hand.splice(index, 1);
          } else {
            // update last move
            this.state.lastMove = move;
            return null;
          }
        } else if (card1 && card2 && !card3) {
          const index1 = indexOfCardInHand(card1, currentPlayer.hand);

          if (index1 !== -1) {
            currentPlayer.hand.splice(index1, 1);
          } else {
            // update last move
            this.state.lastMove = move;
            return null;
          }
          const index2 = indexOfCardInHand(card2, currentPlayer.hand);
          if (index2 !== -1) {
            currentPlayer.hand.splice(index2, 1);
          } else {
            // update last move
            this.state.lastMove = move;
            return null;
          }
        } else if (card1 && card2 && card3) {
          const index1 = indexOfCardInHand(card1, currentPlayer.hand);

          if (index1 !== -1) {
            currentPlayer.hand.splice(index1, 1);
          } else {
            // update last move
            this.state.lastMove = move;
            return null;
          }
          const index2 = indexOfCardInHand(card2, currentPlayer.hand);
          if (index2 !== -1) {
            currentPlayer.hand.splice(index2, 1);
          } else {
            // update last move
            this.state.lastMove = move;
            return null;
          }
          const index3 = indexOfCardInHand(card3, currentPlayer.hand);
          if (index3 !== -1) {
            currentPlayer.hand.splice(index3, 1);
          } else {
            // update last move
            this.state.lastMove = move;
            return null;
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

        this.state.topCard = discardPile.shift() ?? null;
        this.state.lastTopCard = discardPile.at(1) ?? null;

        // Next players turn

        console.log('call next player');
        this.nextPlayer();

        console.log('next one', this.state.currentPlayer);
        // update last move
        this.state.lastMove = move;
        return this.state;
      }
      case 'nope':
        prevTurnCards.splice(0, prevTurnCards.length); // empty prevTurnCards

        // Next players turn
        this.nextPlayer();
        // update last move
        this.state.lastMove = move;
        return this.state;
      default:
        // update last move
        this.state.lastMove = move;
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
    const amountOfCards = this.state.players.length === 2 ? 8 : 7;
    for (let i = 0; i < this.state.players.length * amountOfCards; i++) {
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
      // make last current player to prev player
      this.state.prevPlayerIdx = this.state.currentPlayerIdx;
      this.state.prevPlayer = this.state.currentPlayer;

      // get new idx of current player
      this.state.currentPlayerIdx =
        (this.state.currentPlayerIdx! + this.state.direction) % players.length;

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
    let drawPile = this.state.drawPile;
    let discardPile = this.state.discardPile;

    if (discardPile.length >= 2 && drawPile.length === 0) {
      const newDiscardPile: ICard[] = [];

      // get top card

      const topCard: ICard = discardPile.shift()!;
      const lastTopCard = discardPile.shift();

      // put topcard back on top
      newDiscardPile.push(topCard);

      if (lastTopCard) {
        newDiscardPile.push(lastTopCard);
      }

      drawPile.push(...discardPile);
      discardPile = newDiscardPile;

      drawPile = shuffle(drawPile);

      this.state.topCard = topCard;
      this.state.lastTopCard = lastTopCard ?? null;
    }
  };

  /**
   * Checks if only one player in the game has cards in his hand
   * @returns Returns true if only one player has cards in his hand
   */
  isWon = (): boolean => {
    const notEmptyHands = this.state.players.filter(
      (p: { hand: ICard[] }) => p.hand.length !== 0
    );

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
      const topCardColor = topCard.color;

      const currPlayer = this.state.players[this.state.currentPlayerIdx!]!;

      if (topCardColor) {
        const colors = topCardColor.split('-');

        for (const color of colors) {
          const cardsWithSameColor = currPlayer.hand.filter((c: ICard) =>
            c.color?.includes(color)
          );

          if (cardsWithSameColor.length >= topCardValue) {
            return true;
          }
        }

        return false;
      }
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
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (card.select || card.selectValue || card.selectedColor) return false;
    return true;
  };

  private isConformJokerCard = (card: ICard): boolean => {
    if (card.type !== 'joker') return false;

    // card value is null, undefined or not 1
    if (!card.value || card.value !== 1) return false;

    // check color
    // false if null, undefined, or not multi
    if (!card.color || card.color !== 'multi') return false;

    // check if other values are not set to null
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    if (card.select || card.selectValue || card.selectedColor) return false;
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
    this.history.push({
      id: v4(),
      moveNumber: this.moveNumber,
      createdAt: new Date().toISOString(),
      playerId: this.state.currentPlayer!.id,
      move,
      reason: move.reason,
      compliant
    });

    this.moveNumber++;
  };

  getHistory = (): MoveHistoryObject[] => {
    return this.history;
  };

  getState = (): State => {
    return this.state;
  };

  setWinner = (winner: GamePlayer) => {
    this.state.winner = winner;
  };
}
