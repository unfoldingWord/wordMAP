import Algorithm from "../Algorithm";
import EngineIndex from "../index/EngineIndex";
import Prediction from "../structures/Prediction";
import Token from "../structures/Token";

/**
 * This algorithm calculates the relative position of n-grams in a sentence.
 * Only literal translations are supported.
 */
export default class AlignmentPosition implements Algorithm {
  public name = "alignment position";

  public execute(predictions: Prediction[], corpusIndex: EngineIndex, savedAlignmentsIndex: EngineIndex, unalignedSentencePair: [Token[], Token[]]): Prediction[] {
    for (const p of predictions) {
      const delta = Math.abs(p.alignment.source.tokenPosition - p.alignment.target.tokenPosition);
      const weight = 1 - delta;

      p.setScores({
        alignmentPosition: weight
      });
    }
    return predictions;
  }

}
