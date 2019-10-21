import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * This algorithm checks the relative similarity of occurrence within the aligned sentences.
 *
 * Some algorithms that evaluate n-gram position can produce false positives
 * since, due to differences in sentence length, the wrong n-gram occurrence
 * may be positionally closer.
 *
 * This algorithm can be used to correct those false positives.
 * Results range from 0 to 1.
 */
export default class AlignmentRelativeOccurrence extends Algorithm {

  public static calculate(prediction: Prediction): number {
    const yToken = prediction.alignment.source.getTokens()[0];
    const xToken = prediction.alignment.target.getTokens()[0];

    // ranges
    const yRange = yToken.occurrences;
    const xRange = xToken.occurrences;

    // positions along range
    const y = yToken.occurrence;
    const x = xToken.occurrence;

    // plot ranges between two points (range of possible occurrences)
    const [x1, y1] = [1, 1];
    const [x2, y2] = [xRange, yRange];

    // map x onto the yRange using "Two Point Slope Form" equation
    const xPrime = (x * y2 - y1 * x - x1 * y2 + x1 * y1) / (x2 - x1) + y1;
    // NOTE: y and xPrime are now both on the yRange.

    // normalize to range between 0 and 1.
    // TRICKY: the ranges start at 1 so we must shift to 0.
    const ny = (y - 1) / (yRange - 1);
    const nxPrime = (xPrime - 1) / (yRange - 1);

    // calculate disparity
    const disparity = Math.abs(ny - nxPrime);

    // a disparity close to 0 means the n-grams have a very similar order of occurrence.
    // a disparity close to 1 means the n-grams have a very different order of occurrence.

    return 1 - disparity;
  }

  public name = "alignment relative occurrence";

  public execute(prediction: Prediction): Prediction {
    // TRICKY: do not score null alignments
    if (prediction.target.isNull()) {
      return prediction;
    }

    // TRICKY: for now this algorithm only works on uni-grams
    if (!(prediction.source.isUnigram() && prediction.target.isUnigram())) {
      return prediction;
    }

    const weight = AlignmentRelativeOccurrence.calculate(prediction);

    // TRICKY: this will only apply to alignments of tokens with multiple occurrences.
    //  for all others the result will be NaN.
    if (isNaN(weight)) {
      return prediction;
    }

    prediction.setScore("alignmentRelativeOccurrence", weight);
    return prediction;
  }
}
