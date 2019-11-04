import {Prediction} from "../core/Prediction";
import {Algorithm} from "./Algorithm";

/**
 * This algorithm calculates the relative position of source and target n-grams in an alignment.
 * Only literal translations are supported.
 *
 * A very high score indicates the aligned n-grams are in the same relative position.
 * A very low score indicates the aligned n-grams occur on opposite sides of the sentence.
 *
 * Results range from near 0 to 1
 */
export class AlignmentPosition extends Algorithm {

    /**
     * Calculates the relative distance between two points on two different ranges.
     * It should be noted that the relative distance will be less severe with larger ranges,
     * requiring a relatively larger distance to measure the same degree of distance that may be found in a shorter sentence.
     * Indices begin at 1 (not 0)
     * @param x a point along the x-range
     * @param y a point along the y-range
     * @param xRange the maximum value in the x-range
     * @param yRange the maximum value in the y-range
     * @return a value close to 1 indicates they are very close. A value close to 0 indicates they are very far.
     */
    public static calculateRelativeDistance(x: number, y: number, xRange: number, yRange: number): number {
        // points are identical
        if (x === y && xRange === yRange) {
            return 1;
        }

        if (x > xRange || y > yRange) {
            throw new Error("Points are out of range. Make sure you are providing the correct range size.");
        }

        // plot ranges between two points (range of possible occurrences)
        const [x1, y1] = [1, 1];
        const [x2, y2] = [xRange, yRange];

        // map x onto the yRange using "Two Point Slope Form" equation
        const xPrime = (x * y2 - y1 * x - x1 * y2 + x1 * y1) / (x2 - x1) + y1;
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

    public name = "alignment position";

    public execute(prediction: Prediction): Prediction {
        let weight = 0;
        // TRICKY: do not score null alignments
        if (!prediction.target.isNull()) {
            // TRICKY: token positions are zero indexed
            const sourcePosition = 1 + prediction.source.tokenPosition;
            const targetPosition = 1 + prediction.target.tokenPosition;

            const sourceSentenceLength = prediction.source.sentenceTokenLength;
            const targetSentenceLength = prediction.target.sentenceTokenLength;

            weight = AlignmentPosition.calculateRelativeDistance(sourcePosition, targetPosition, sourceSentenceLength, targetSentenceLength);
        }

        // throttle the alignment position weight by the relative occurrence
        if (prediction.hasScore("alignmentRelativeOccurrence")) {
            weight *= prediction.getScore("alignmentRelativeOccurrence");
        }
        // throttle the alignment position weight by the relative position of the tokens within the target n-gram
        if (prediction.hasScore("ngramRelativeTokenDistance")) {
            if (prediction.getScore("ngramRelativeTokenDistance") < 1) {
                weight *= prediction.getScore("ngramRelativeTokenDistance");
            }
        }

        prediction.setScore("alignmentPosition", weight);
        return prediction;
    }
}
