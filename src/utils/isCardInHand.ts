/* eslint-disable eqeqeq */
import type { ICard } from '../interfaces';

const isCardInHand = (card: ICard, hand: ICard[]): boolean =>
  hand.some(
    (c) =>
      c.type === card.type &&
      c.color === card.color &&
      c.value === card.value &&
      c.select == card.select &&
      c.selectValue == card.selectValue &&
      c.selectedColor == card.selectedColor
  );

export default isCardInHand;
