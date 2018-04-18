import Algorithm from "../Algorithm";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class PhrasePlausibility implements Algorithm {

  /**
   * Calculates the n-gram commonality
   * @param {Prediction} prediction
   * @return {number}
   */
  private static commonality(prediction: Prediction): number {
    const ngramFrequencyCorpusSource = prediction.getScore(
      "ngramStaticFrequencyCorpusSource");
    const ngramFrequencyCorpusTarget = prediction.getScore(
      "ngramStaticFrequencyCorpusTarget");

    const isTargetNull = prediction.alignment.target.isNull();
    if (ngramFrequencyCorpusSource === 0 || ngramFrequencyCorpusTarget === 0 ||
      isTargetNull) {
      // TRICKY: let null n-grams be common
      if (isTargetNull) {
        return 1;
      }
      return 0;
    } else {
      let x = 1 - 1 / ngramFrequencyCorpusSource;
      let y = 1 - 1 / ngramFrequencyCorpusTarget;

      // TRICKY: uni-grams are always phrases
      if (prediction.alignment.source.isUnigram()) {
        x = 1;
      }
      if (prediction.alignment.target.isUnigram()) {
        y = 1;
      }

      return Math.min(x, y);
    }

  }

  public name = "phrase plausibility";

  public execute(predictions: Prediction[]): Prediction[] {
    for (const p of predictions) {
      const commonality = PhrasePlausibility.commonality(p);
      p.setScore("phrasePlausibility", commonality);
    }
    return predictions;
  }

}
