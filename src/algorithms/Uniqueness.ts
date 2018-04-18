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

      const sourceNgramStaticCorpusFrequency = cIndex.static.sourceNgramFrequency.read(
        p.alignment.source);
      const targetNgramStaticCorpusFrequency = cIndex.static.targetNgramFrequency.read(
        p.alignment.target);

      if (sourceNgramStaticCorpusFrequency !== 0 &&
        targetNgramStaticCorpusFrequency !==
        0) {
        const x = sourceNgramStaticCorpusFrequency /
          cIndex.static.sourceTokenLength;
        const y = targetNgramStaticCorpusFrequency /
          cIndex.static.targetTokenLength;
        weight = Math.min(x, y) / Math.max(x, y);
      }

      weight *= p.getScore("phrasePlausibility");
      p.setScore("uniqueness", weight);
    }
    return predictions;
  }

}
