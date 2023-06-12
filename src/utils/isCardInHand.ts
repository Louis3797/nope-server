/* eslint-disable eqeqeq */
import type { ICard } from '../interfaces';

/**
 * Searches for the given card in the specified hand
 * @param card Card from type ICard
 * @param hand ICard array
 * @returns Returns true if card is in hand, false if not
 */
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
