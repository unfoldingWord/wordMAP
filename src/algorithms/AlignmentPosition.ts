import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * This algorithm calculates the relative position of n-grams in a sentence.
 * Only literal translations are supported.
 *
 * A very high score indicates the aligned n-grams are in the same relative position.
 * A very low score indicates the aligned n-grams occur on opposite sides of the sentence.
 *
 * Results range from near 0 to 1
 */
export default class AlignmentPosition implements Algorithm {
  public name = "alignment position";

  public execute(predictions: Prediction[]): Prediction[] {
    for (const p of predictions) {
      let weight = 0;
      // TRICKY: do not score null alignments
      if (!p.target.isNull()) {
        // TRICKY: token positions are zero indexed
        const sourcePosition = 1 + p.source.tokenPosition;
        const targetPosition = 1 + p.target.tokenPosition;

        const sourceSentenceLength = p.source.sentenceTokenLength;
        const targetSentenceLength = p.target.sentenceTokenLength;

        const sourceRelativePosition = sourcePosition / sourceSentenceLength;
        const targetRelativePosition = targetPosition / targetSentenceLength;
        const delta = Math.abs(sourceRelativePosition - targetRelativePosition);
        weight = 1 - delta;
      }

      // throttle the alignment position weight by the relative occurrence
      if (p.hasScore("alignmentRelativeOccurrence")) {
        weight *= p.getScore("alignmentRelativeOccurrence");
      }
      p.setScore("alignmentPosition", weight);
    }
    return predictions;
  }

}
