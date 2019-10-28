import {Prediction} from "../core/Prediction";
import {Algorithm} from "./Algorithm";

/**
 * In other algorithms n-grams are scored equally regardless of length.
 * However, shorter n-grams are more prevalent than longer n-grams.
 * This typically results in shorter n-grams overwhelming the output.
 *
 * The weight of an alignment increases proportionally to it's length,
 * and relative sentence coverage in primary and secondary text.
 */
export class NgramLength extends Algorithm {
  public name = "n-gram length";

  public execute(prediction: Prediction): Prediction {
    let weight = 0;
    // TRICKY: do not score null alignments
    if (!prediction.target.isNull()) {
      // sentence lengths
      const sourceSentenceLength = prediction.source.sentenceTokenLength;
      const targetSentenceLength = prediction.target.sentenceTokenLength;

      // n-gram lengths
      const sourceLength = prediction.source.tokenLength;
      const targetLength = prediction.target.tokenLength;

      const primaryLengthRatio = sourceLength / sourceSentenceLength;
      const secondaryLengthRatio = targetLength / targetSentenceLength;

      // length affinity
      const delta = Math.abs(primaryLengthRatio - secondaryLengthRatio);
      // TRICKY: the power of 5 improves the curve
      weight = Math.pow(1 - delta, 5);
    }
    prediction.setScore("ngramLength", weight);
    return prediction;
  }

}
