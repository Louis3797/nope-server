/* eslint-disable eqeqeq */
import type { ICard } from '../interfaces';

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
