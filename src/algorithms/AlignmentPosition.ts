import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * This algorithm calculates the relative position of n-grams in a sentence.
 * Only literal translations are supported.
 */
export default class AlignmentPosition implements Algorithm {
  public name = "alignment position";

  public execute(predictions: Prediction[]): Prediction[] {
    for (const p of predictions) {
      const sourcePosition = 1 + p.alignment.source.tokenPosition;
      const targetPosition = 1 + p.alignment.target.tokenPosition;

      const sourceRelativePosition = sourcePosition /
        p.alignment.source.sentenceTokenLength;
      const targetRelativePosition = targetPosition /
        p.alignment.target.sentenceTokenLength;
      const delta = Math.abs(sourceRelativePosition - targetRelativePosition);
      const weight = 1 - delta;

      p.setScore("alignmentPosition", weight);
    }
    return predictions;
  }

}
