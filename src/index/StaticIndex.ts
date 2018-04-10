import Ngram from "../structures/Ngram";
import NgramIndex from "./NgramIndex";

/**
 * A collection of indexes on the static content.
 */
export default class StaticIndex {
  private srcNgramFreqIndex: NgramIndex;
  private tgtNgramFreqIndex: NgramIndex;

  /**
   * Returns an index of source n-gram frequencies in the corpus
   * @return {NgramIndex}
   */
  get sourceNgramFrequency() {
    return this.srcNgramFreqIndex;
  }

  /**
   * Returns an index of target n-gram frequencies in the corpus
   * @return {NgramIndex}
   */
  get targetNgramFrequency() {
    return this.tgtNgramFreqIndex;
  }

  constructor() {
    this.srcNgramFreqIndex = new NgramIndex();
    this.tgtNgramFreqIndex = new NgramIndex();
  }

  /**
   * Adds a sentence to the index.
   * The tokens in these n-grams must be measured for accurate positional metrics.
   *
   * @param source - the source sentence n-grams
   * @param target - the target sentence n-grams
   */
  public addSentence(source: Ngram[], target: Ngram[]) {
    // index corpus n-gram frequencies
    for (const ngram of source) {
      this.srcNgramFreqIndex.increment(ngram);
    }
    for (const ngram of target) {
      this.tgtNgramFreqIndex.increment(ngram);
    }
  }
}
