import {Prediction} from "../core/Prediction";
import {fitToRange, measureRelativeProximity} from "../util/math";
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

            weight = measureRelativeProximity(sourcePosition, targetPosition, sourceSentenceLength, targetSentenceLength);
        }

        // throttle the alignment position weight by the relative occurrence
        if (prediction.hasScore("alignmentRelativeOccurrence")) {
            weight *= prediction.getScore("alignmentRelativeOccurrence");
        }
        // throttle the alignment position weight by the relative position of the tokens within the target n-gram
        if (prediction.hasScore("ngramRelativeTokenDistance")) {
            weight *= prediction.getScore("ngramRelativeTokenDistance");
        }

        // TRICKY: prefer the first occurrences.
        const targetOccurrences = prediction.target.occurrences;
        const occurrenceDistance = measureRelativeProximity(1, prediction.target.occurrence, targetOccurrences, targetOccurrences);
        const reductionFactor = 0.9; // reduce down to 90%
        const occurrencePreference = fitToRange(occurrenceDistance, 0, 1, reductionFactor, 1);
        weight *= occurrencePreference;

        prediction.setScore("alignmentPosition", weight);
        return prediction;
    }
}
