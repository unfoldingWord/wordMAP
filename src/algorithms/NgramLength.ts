import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import SavedAlignmentsIndex from "../index/SavedAlignmentsIndex";
import Prediction from "../structures/Prediction";
import Token from "../structures/Token";

export default class NgramLength implements Algorithm {
  public name = "n-gram length";

  public execute(predictions: Prediction[], cIndex: CorpusIndex, saIndex: SavedAlignmentsIndex, sourceSentence: Token[], targetSentence: Token[]): Prediction[] {
    for (const p of predictions) {
      let weight = 0;
      // TRICKY: do not score null alignments
      if (!p.alignment.target.isNull()) {
        // sentence lengths
        const sourceSentenceLength = p.alignment.source.sentenceTokenLength;
        const targetSentenceLength = p.alignment.target.sentenceTokenLength;

        // n-gram lengths
        const sourceLength = p.alignment.source.tokenLength;
        const targetLength = p.alignment.target.tokenLength;

        const primaryLengthRatio = sourceLength / sourceSentenceLength;
        const secondaryLengthRatio = targetLength / targetSentenceLength;

        // length affinity
        const delta = Math.abs(primaryLengthRatio - secondaryLengthRatio);
        // TRICKY: the power of 5 improves the curve
        weight = Math.pow(1 - delta, 5);
      }
      p.setScore("ngramLength", weight);
    }
    return predictions;
  }

}
