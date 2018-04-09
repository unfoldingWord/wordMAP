import Algorithm from "../Algorithm";
import PermutationIndex from "../index/PermutationIndex";
import Prediction from "../structures/Prediction";

/**
 * This algorithm calculates the relative position of n-grams in a sentence.
 * Only literal translations are supported.
 */
export default class AlignmentPosition implements Algorithm {
  public name = "alignment position";

  public execute(predictions: Prediction[], corpusIndex: PermutationIndex, savedAlignmentsIndex: PermutationIndex): Prediction[] {
    for (const p of predictions) {
      const sourcePosition = p.alignment.source.tokenPosition;
      const targetPosition = p.alignment.target.tokenPosition;
      const delta = Math.abs(sourcePosition - targetPosition);
      const weight = 1 - delta;

      p.setScore("alignmentPosition", weight);
    }
    return predictions;
  }

}
