import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import SavedAlignmentsIndex from "../index/SavedAlignmentsIndex";
import Prediction from "../structures/Prediction";
import Token from "../structures/Token";

export default class NgramLength implements Algorithm {
  public name = "n-gram length";

  public execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: SavedAlignmentsIndex, sourceSentence: Token[], targetSentence: Token[]): Prediction[] {
    const sourceSentenceLength = sourceSentence.length;
    const targetSentenceLength = targetSentence.length;

    for (const p of predictions) {
      // length ratios
      const sourceLength = p.alignment.source.tokenLength;
      const targetLength = p.alignment.target.tokenLength;

      const primaryLengthRatio = sourceLength / sourceSentenceLength;
      const secondaryLengthRatio = targetLength / targetSentenceLength;

      // length affinity
      const delta = Math.abs(primaryLengthRatio - secondaryLengthRatio);
      // TRICKY: the power of 5 improves the curve
      const weight = Math.pow(1 - delta, 5);

      p.setScore("ngramLength", weight);
    }
    return predictions;
  }

}
