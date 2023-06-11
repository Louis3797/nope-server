import { isCardInHand } from '../../../src/utils';
import type { ICard } from '../../../src/interfaces';

describe('isCardInHand', () => {
  it('empty hand', () => {
    const hand: ICard[] = [];

    const card: ICard = {
      type: 'number',
      color: 'red',
      value: 1
    };

    const result = isCardInHand(card, hand);
    expect(result).toBeDefined();
    expect(result).toBeFalsy();
  });
  it('card is in hand', () => {
    const hand: ICard[] = [
      {
        type: 'number',
        color: 'red',
        value: 1
      },
      {
        type: 'number',
        color: 'blue',
        value: 1
      },
      {
        type: 'joker',
        color: 'multi',
        value: 1
      }
    ];

    const card: ICard = {
      type: 'number',
      color: 'red',
      value: 1
    };

    const result = isCardInHand(card, hand);
    expect(result).toBeDefined();
    expect(result).toBeTruthy();
  });
  it('card is not in hand', () => {
    const hand: ICard[] = [
      {
        type: 'number',
        color: 'red',
        value: 1
      },
      {
        type: 'number',
        color: 'blue',
        value: 1
      },
      {
        type: 'joker',
        color: 'multi',
        value: 1
      }
    ];

    const card: ICard = {
      type: 'number',
      color: 'green',
      value: 1
    };

    const result = isCardInHand(card, hand);
    expect(result).toBeDefined();
    expect(result).toBeFalsy();
  });
});
