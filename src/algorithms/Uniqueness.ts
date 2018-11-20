import Algorithm from "../Algorithm";
import CorpusIndex from "../index/CorpusIndex";
import Prediction from "../structures/Prediction";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export default class Uniqueness implements Algorithm {

  /**
   * Performs the uniqueness calculation.
   * This is the pure algorithm code.
   * @param sourceFrequency - source n-gram frequency in the static corpus
   * @param targetFrequency - target n-gram frequency in the static corpus
   * @param sourceTokenLength - length of the source text in units of {@link Token}
   * @param targetTokenLength - length of the target text in units of {@link Token}
   * @param phrasePlausibility - the likely hood that the n-gram is a phrase. Produced by {@link PhrasePlausibility}
   */
  public static calc(sourceFrequency: number, targetFrequency: number, sourceTokenLength: number, targetTokenLength: number, phrasePlausibility: number) {
    let weight = 0;

    if (sourceTokenLength !== 0 && targetTokenLength !== 0) {
      const sourceUniqueness = sourceFrequency / sourceTokenLength;
      const targetUniqueness = targetFrequency / targetTokenLength;
      const similarity = Math.min(sourceUniqueness, targetUniqueness) / Math.max(sourceUniqueness, targetUniqueness);
      weight = 1 - 1 / (similarity * (1 / Math.min(sourceUniqueness, targetUniqueness))); // maybe 1 - uniqueness?
    }
    // I want similarity and uniqueness to be small and the same.

    return weight * phrasePlausibility;
  }

  /**
   * Just a light wrapper around the calc function to reduce redundancy.
   * @param sourceFrequency
   * @param targetFrequency
   * @param p
   * @param cIndex
   */
  private static calcUniqueness(sourceFrequency: number, targetFrequency: number, p: Prediction, cIndex: CorpusIndex) {
    return Uniqueness.calc(
      sourceFrequency,
      targetFrequency,
      cIndex.static.sourceTokenLength,
      cIndex.static.targetTokenLength,
      p.getScore("phrasePlausibility")
    );
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
