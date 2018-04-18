import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class PhrasePlausibility implements Algorithm {

  public name = "phrase plausibility";

  public execute(predictions: Prediction[], cIndex: CorpusIndex): Prediction[] {
    for (const p of predictions) {
      const sourceNgramStaticCorpusFrequency: number = cIndex.static.sourceNgramFrequency.read(
        p.source);
      const targetNgramStaticCorpusFrequency: number = cIndex.static.targetNgramFrequency.read(
        p.target);

      const isTargetNull = p.target.isNull();
      let weight = 0;
      if (sourceNgramStaticCorpusFrequency === 0 ||
        targetNgramStaticCorpusFrequency === 0 ||
        isTargetNull) {
        // TRICKY: let null n-grams be common
        if (isTargetNull) {
          weight = 1;
        }
        weight = 0;
      } else {
        let x = 1 - 1 / sourceNgramStaticCorpusFrequency;
        let y = 1 - 1 / targetNgramStaticCorpusFrequency;

        // TRICKY: uni-grams are always phrases
        if (p.source.isUnigram()) {
          x = 1;
        }
        if (p.target.isUnigram()) {
          y = 1;
        }

        weight = Math.min(x, y);
      }

      p.setScore("phrasePlausibility", weight);
    }
    return predictions;
  }

}
