/* eslint-disable eqeqeq */
import type { ICard } from '../interfaces';

/**
 * Searches for the given card in the hand and returns its index
 * @param card Card of type ICard
 * @param hand ICard Array
 * @returns Returns the index of the card in the hand if found, else -1
 */
const indexOfCardInHand = (card: ICard, hand: ICard[]): number => {
  for (let i = 0; i < hand.length; i++) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    if (
      hand[i] &&
      hand[i]?.type === card.type &&
      hand[i]?.color === card.color &&
      hand[i]?.value === card.value &&
      hand[i]?.select == card.select &&
      hand[i]?.selectValue == card.selectValue &&
      hand[i]?.selectedColor == card.selectedColor
    ) {
      return i;
    }
  }

  return -1;
};

export default indexOfCardInHand;
