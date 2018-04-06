import Algorithm from "../Algorithm";
import EngineIndex from "../index/EngineIndex";
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
    const ngramFrequencyCorpusSource = prediction.getScore("ngramFrequencyCorpusSource");
    const ngramFrequencyCorpusTarget = prediction.getScore("ngramFrequencyCorpusTarget");

    const x = 1 - 1 / ngramFrequencyCorpusSource;
    const y = 1 - 1 / ngramFrequencyCorpusTarget;
    return Math.min(x, y);
  }

  public name = "phrase plausibility";

  public execute(predictions: Prediction[], corpusIndex: EngineIndex, savedAlignmentsIndex: EngineIndex): Prediction[] {
    for (const p of predictions) {
      const commonality = PhrasePlausibility.commonality(p);
      p.setScore("phrasePlausibility", commonality);
    }
    return predictions;
  }

}
