import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class Uniqueness implements Algorithm {

  /**
   * Calculates uniqueness from the source n-gram and target n-gram static frequency
   * @param sourceFrequency
   * @param targetFrequency
   * @param p
   * @param cIndex
   */
  private static calcUniqueness(sourceFrequency: number, targetFrequency: number, p: Prediction, cIndex: CorpusIndex) {
    let weight = 0;

    if (sourceFrequency !== 0 &&
      targetFrequency !==
      0) {
      const x = sourceFrequency /
        cIndex.static.sourceTokenLength;
      const y = targetFrequency /
        cIndex.static.targetTokenLength;
      weight = Math.min(x, y) / Math.max(x, y);
    }

    weight *= p.getScore("phrasePlausibility");
    return weight;
  }

  /**
   * Calculates the uniqueness of the n-gram
   * @param p
   * @param cIndex
   */
  private static executeDefault(p: Prediction, cIndex: CorpusIndex) {
    const sourceNgramStaticCorpusFrequency = cIndex.static.sourceNgramFrequency.read(
      p.source);
    const targetNgramStaticCorpusFrequency = cIndex.static.targetNgramFrequency.read(
      p.target);
    const weight = Uniqueness.calcUniqueness(
      sourceNgramStaticCorpusFrequency,
      targetNgramStaticCorpusFrequency,
      p,
      cIndex
    );
    p.setScore("uniqueness", weight);
  }

  /**
   * Calculates the uniqueness of the n-gram based on the lemma
   * @param p
   * @param cIndex
   */
  private static executeLemma(p: Prediction, cIndex: CorpusIndex) {
    if (p.source.lemmaKey !== undefined && p.target.lemmaKey !== undefined) {
      const sourceNgramStaticCorpusLemmaFrequency = cIndex.static.sourceNgramFrequency.read(
        p.source.lemmaKey);
      const targetNgramStaticCorpusLemmaFrequency = cIndex.static.targetNgramFrequency.read(
        p.target.lemmaKey);
      const lemmaWeight = Uniqueness.calcUniqueness(
        sourceNgramStaticCorpusLemmaFrequency,
        targetNgramStaticCorpusLemmaFrequency,
        p,
        cIndex
      );
      p.setScore("lemmaUniqueness", lemmaWeight);
    }
  }

  public name = "uniqueness";

  public execute(predictions: Prediction[], cIndex: CorpusIndex): Prediction[] {

    for (const p of predictions) {
      Uniqueness.executeDefault(p, cIndex);
      Uniqueness.executeLemma(p, cIndex);
    }
    return predictions;
  }
}
