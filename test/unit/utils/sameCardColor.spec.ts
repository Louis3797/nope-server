import { type ICard } from '../../../src/interfaces';
import sameCardColor from '../../../src/utils/sameCardColor';

describe('sameCardColor', () => {
  it('returns false if either card has no color', () => {
    const card1: ICard = { type: 'number', color: 'blue', value: 1 };
    const card2 = { type: 'number', color: null, value: 1 };
    expect(sameCardColor(card1, card2 as unknown as ICard)).toBe(false);
  });

  it('returns true if either card has color "multi"', () => {
    const card1: ICard = { type: 'joker', color: 'multi', value: 1 };
    const card2: ICard = { type: 'number', color: 'red', value: 1 };
    expect(sameCardColor(card1, card2)).toBe(true);
  });

  it('returns true if both cards have at least one common color', () => {
    const card1: ICard = { type: 'number', color: 'red-green', value: 1 };
    const card2: ICard = { type: 'number', color: 'red', value: 1 };
    expect(sameCardColor(card1, card2)).toBe(true);
  });

  it('returns false if the cards have no common colors', () => {
    const card1: ICard = { type: 'number', color: 'green', value: 1 };
    const card2: ICard = { type: 'number', color: 'red', value: 1 };
    expect(sameCardColor(card1, card2)).toBe(false);
  });
});
