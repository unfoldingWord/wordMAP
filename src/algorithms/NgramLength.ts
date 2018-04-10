import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import SavedAlignmentsIndex from "../index/SavedAlignmentsIndex";
import Prediction from "../structures/Prediction";
import Token from "../structures/Token";

export default class NgramLength implements Algorithm {
  public name = "n-gram length";

  public execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: SavedAlignmentsIndex, unalignedSentencePair: [Token[], Token[]]): Prediction[] {
    for (const p of predictions) {
      // length ratios
      const sourceLength = p.alignment.source.tokenLength;
      const targetLength = p.alignment.target.tokenLength;

      const primaryLengthRatio = sourceLength /
        unalignedSentencePair[0].length;
      const secondaryLengthRatio = targetLength /
        unalignedSentencePair[1].length;

      // length affinity
      const delta = Math.abs(primaryLengthRatio - secondaryLengthRatio);
      // TRICKY: the power of 5 improves the curve
      const weight = Math.pow(1 - delta, 5);

      p.setScore("ngramLength", weight);
    }
    return predictions;
  }

}
