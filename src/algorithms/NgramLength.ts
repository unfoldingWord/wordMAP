import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

export default class NgramLength implements Algorithm {
  public name = "n-gram length";

  public execute(predictions: Prediction[]): Prediction[] {
    for (const p of predictions) {
      let weight = 0;
      // TRICKY: do not score null alignments
      if (!p.target.isNull()) {
        // sentence lengths
        const sourceSentenceLength = p.source.sentenceTokenLength;
        const targetSentenceLength = p.target.sentenceTokenLength;

        // n-gram lengths
        const sourceLength = p.source.tokenLength;
        const targetLength = p.target.tokenLength;

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
