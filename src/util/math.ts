/**
 * If the denominator is 0 the output will be 0 otherwise normal division occurs.
 * @param {number} numerator
 * @param {number} denominator
 * @return {number}
 */
export function divide(numerator: number, denominator: number): number {
  if (denominator === 0) {
    return 0;
  } else {
    return numerator / denominator;
  }
}

/**
 * The "median" is the "middle" value in the list of numbers.
 *
 * @param {number[]} numbers - an array of numbers
 * @return {number} - the calculated median value from the specified numbers
 */
export function median(numbers: number[]): number {
  let medianVal = 0;
  const numsLen = numbers.length;
  numbers.sort();

  if (numsLen === 0) {
    medianVal = 0;
  } else if (numsLen % 2 === 0) {
    // average of two middle numbers
    medianVal = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
  } else {
    // middle number only
    medianVal = numbers[(numsLen - 1) / 2];
  }

  return medianVal;
}

/**
 * calculates the average value of an array of numbers
 * @param numbers
 */
export function average(numbers: number[]): number {
  let total = 0;
  const len = numbers.length;
  for (let i = 0; i < len; i++) {
    total += numbers[i];
  }
  return divide(total, len);
}
