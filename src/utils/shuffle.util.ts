/**
 * Shuffles the elements in an array randomly.
 * @param arr The array to shuffle.
 * @returns A new array with the same elements as `arr`, but in a random order.
 */
const shuffle = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line security/detect-object-injection, @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    // eslint-disable-next-line security/detect-object-injection
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray.filter((element) => element !== undefined);
};

export default shuffle;
