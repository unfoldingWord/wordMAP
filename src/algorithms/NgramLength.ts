import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * In other algorithms n-grams are scored equally regardless of length.
 * However, shorter n-grams are more prevalent than longer n-grams.
 * This typically results in shorter n-grams overwhelming the output.
 *
 * The weight of an alignment increases proportionally to it's length,
 * and relative sentence coverage in primary and secondary text.
 */
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
