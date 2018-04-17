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
