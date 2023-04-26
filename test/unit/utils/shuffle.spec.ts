import shuffle from '../../../src/utils/shuffle.util';

describe('shuffle', () => {
  it('should shuffle the elements in the array randomly', () => {
    const arr = [...Array(100).keys()];
    const shuffledArr = shuffle(arr);
    expect(shuffledArr).toHaveLength(arr.length);
    expect(shuffledArr).not.toEqual(arr);
    for (const elem of arr) {
      expect(shuffledArr).toContain(elem);
    }
  });

  it('should return a new array', () => {
    const arr = [...Array(100).keys()];
    const shuffledArr = shuffle(arr);
    expect(shuffledArr).not.toBe(arr);
  });

  it('should return an empty array for an empty input array', () => {
    const arr: number[] = [];
    const shuffledArr = shuffle(arr);
    expect(shuffledArr).toEqual([]);
  });

  it('should return an array with a single element unchanged', () => {
    const arr = [42];
    const shuffledArr = shuffle(arr);
    expect(shuffledArr).toEqual(arr);
  });

  it('should handle arrays with duplicate elements', () => {
    const arr = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];
    const shuffledArr = shuffle(arr);
    expect(shuffledArr).toHaveLength(arr.length);
    expect(shuffledArr).not.toEqual(arr);
    for (const elem of arr) {
      expect(shuffledArr).toContain(elem);
    }
  });
});
