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
export default class AlignmentPosition extends Algorithm {
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

      const sourceRelativePosition = sourcePosition / sourceSentenceLength;
      const targetRelativePosition = targetPosition / targetSentenceLength;
      const delta = Math.abs(sourceRelativePosition - targetRelativePosition);
      weight = 1 - delta;
    }

    // throttle the alignment position weight by the relative occurrence
    if (prediction.hasScore("alignmentRelativeOccurrence")) {
      weight *= prediction.getScore("alignmentRelativeOccurrence");
    }
    prediction.setScore("alignmentPosition", weight);
    return prediction;
  }

}
