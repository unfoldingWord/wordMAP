import {Ngram, Prediction} from "../core/";
import {CorpusIndex} from "../index/";
import {Algorithm} from "./";

/**
 * Determines the likely hood that an n-gram is a phrase.
 */
export class PhrasePlausibility extends Algorithm {

  /**
   * Calculates the plausibility
   * @param sourceNgram - The source n-gram
   * @param targetNgram - The target n-gram
   * @param sourceNgramFrequency - The source n-gram frequency in the corpus
   * @param targetNgramFrequency - The target n-gram frequency in the corpus
   * @param sourceTokenLength - length of the source text in units of {@link Token}
   * @param targetTokenLength - length of the target text in units of {@link Token}
   */
  public static calc(sourceNgram: Ngram, targetNgram: Ngram, sourceNgramFrequency: number, targetNgramFrequency: number, sourceTokenLength: number, targetTokenLength: number) {
    // TRICKY: let null n-grams be common
    if (targetNgram.isNull()) {
      return 1;
    }

    let weight = 0;
    // TODO: this is similar to uniqueness. I want a high uniqueness value (meaning it is not unique) and high similarity (meaning they both have similar occurrence)
    if (sourceNgramFrequency > 0 && targetNgramFrequency > 0) {
      const sourcePlausibility = sourceNgramFrequency / sourceTokenLength;
      const targetPlausibility = targetNgramFrequency / targetTokenLength;

      weight = Math.min(sourcePlausibility, targetPlausibility) /
        Math.max(sourcePlausibility, targetPlausibility);
      // TODO: double check the above change with Klappy
      // let x = 1 - 1 / sourceNgramFrequency;
      // let y = 1 - 1 / targetNgramFrequency;
      // // TRICKY: uni-grams are always phrases
      // if (sourceNgram.isUnigram()) {
      //   x = 1;
      // }
      // if (targetNgram.isUnigram()) {
      //   y = 1;
      // }
      //
      // weight = Math.min(x, y);
    }
    return weight;
  }

  /**
   * Calculates phrase plausibility based on the word
   * @param p
   * @param cIndex
   */
  private static calcPlausibility(p: Prediction, cIndex: CorpusIndex) {
    const sourceFrequency: number = cIndex.static.sourceNgramFrequency.read(
      p.source);
    const targetFrequency: number = cIndex.static.targetNgramFrequency.read(
      p.target);

    const weight = PhrasePlausibility.calc(
      p.source,
      p.target,
      sourceFrequency,
      targetFrequency,
      cIndex.static.sourceTokenLength,
      cIndex.static.targetTokenLength
    );
    p.setScore("phrasePlausibility", weight);
  }

  /**
   * Calculates phrase plausibility based on the lemma
   * @param p
   * @param cIndex
   */
  private static calcLemmaPlausibility(p: Prediction, cIndex: CorpusIndex) {
    if (p.source.lemmaKey !== undefined && p.target.lemmaKey !== undefined) {
      const sourceFrequency: number = cIndex.static.sourceNgramFrequency.read(
        p.source.lemmaKey);
      const targetFrequency: number = cIndex.static.targetNgramFrequency.read(
        p.target.lemmaKey);
      const weight = PhrasePlausibility.calc(
        p.source,
        p.target,
        sourceFrequency,
        targetFrequency,
        cIndex.static.sourceTokenLength,
        cIndex.static.targetTokenLength
      );
      p.setScore("lemmaPhrasePlausibility", weight);
    } else {
      p.setScore("lemmaPhrasePlausibility", 0);
    }
  }

  public name = "phrase plausibility";

  public execute(prediction: Prediction, cIndex: CorpusIndex): Prediction {
    PhrasePlausibility.calcPlausibility(prediction, cIndex);
    PhrasePlausibility.calcLemmaPlausibility(prediction, cIndex);
    return prediction;
  }
}
