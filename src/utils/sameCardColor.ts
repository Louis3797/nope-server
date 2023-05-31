import type { ICard } from '../interfaces';

/**
 * Checks if card2 has the same color then card1
 * @param card1 ICard
 * @param card2 ICard
 * @returns     Returns true if card2 has the same color
 */
const sameCardColor = (card1: ICard, card2: ICard): boolean => {
  if (!card1.color || !card2.color) {
    return false;
  }

  const card1Colors = card1.color.split('-');
  const card2Colors = card2.color.split('-');

  return card1Colors.some((color) => card2Colors.includes(color));
};

export default sameCardColor;
