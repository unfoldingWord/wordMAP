import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class Uniqueness implements Algorithm {

  public name = "uniqueness";

  public execute(predictions: Prediction[], cIndex: CorpusIndex): Prediction[] {

    for (const p of predictions) {

      let weight = 0;

      const ngramFrequencyCorpusSource = p.getScore(
        "ngramStaticFrequencyCorpusSource");
      const ngramFrequencyCorpusTarget = p.getScore(
        "ngramStaticFrequencyCorpusTarget");

      if (ngramFrequencyCorpusSource !== 0 && ngramFrequencyCorpusTarget !==
        0) {
        const x = ngramFrequencyCorpusSource / cIndex.static.sourceTokenLength;
        const y = ngramFrequencyCorpusTarget / cIndex.static.targetTokenLength;
        weight = Math.min(x, y) / Math.max(x, y);
      }

      weight *= p.getScore("phrasePlausibility");
      p.setScore("uniqueness", weight);
    }
    return predictions;
  }

}
