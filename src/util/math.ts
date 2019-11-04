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

/**
 * Measures how close two points, on two separate ranges, are to each other.
 * It should be noted that the relative proximity will be more pronounced on larger ranges,
 * requiring a relatively larger distance between points to measure a lower proximity.
 *
 * NOTE: This assumes ranges with a min value of 1.
 * @param x a point along the x-range
 * @param y a point along the y-range
 * @param xRange the maximum value in the x-range
 * @param yRange the maximum value in the y-range
 * @return a value close to 1 indicates they are very close. A value close to 0 indicates they are as var away as possible.
 */
export function measureRelativeProximity(x: number, y: number, xRange: number, yRange: number): number {
    // points are identical
    if (x === y && xRange === yRange) {
        return 1;
    }

    if (x > xRange || y > yRange) {
        throw new Error("Points are out of range. Make sure you are providing the correct range size.");
    }

    const xPrime = fitToRange(x, 1, xRange, 1, yRange);
    // NOTE: y and xPrime are now both on the yRange.

    // normalize to range between 0 and 1.
    // TRICKY: the ranges start at 1 so we must shift to 0.
    const ny = (y - 1) / (yRange - 1);
    const nxPrime = (xPrime - 1) / (yRange - 1);

    // calculate disparity
    const disparity = Math.abs(ny - nxPrime);

    // a disparity close to 0 means the n-grams have a very similar order of occurrence.
    // a disparity close to 1 means the n-grams have a very different order of occurrence.

    return 1 - disparity;
}

/**
 * Fits a number into a new range of values.
 * @param x the number to convert
 * @param min the minimum value of the number's current range
 * @param max the maximum value of the number's current range
 * @param targetMin the minimum value of the desired range
 * @param targetMax the maximum value of the desired range.
 */
export function fitToRange(x: number, min: number, max: number, targetMin: number, targetMax: number): number {
    const [x1, y1] = [min, targetMin];
    const [x2, y2] = [max, targetMax];

    // plot ranges between two points
    if (x < min || x > max) {
        throw new Error(`The value ${x} does not exist within the range [${min}..${max}]. Make sure you are providing the correct arguments.`);
    }

    // map x onto the target range using the "Two Point Slope Form" equation
    return (x * y2 - y1 * x - x1 * y2 + x1 * y1) / (x2 - x1) + y1;
}
