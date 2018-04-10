import Ngram from "../structures/Ngram";
import Token from "../structures/Token";
import NgramIndex from "./NgramIndex";

/**
 * A collection of indexes on the static content.
 */
export default class StaticIndex {
  private srcNgramFreqIndex: NgramIndex;
  private srcSentenceTokenLength: number;
  private srcSentenceCharLength: number;

  private tgtNgramFreqIndex: NgramIndex;
  private tgtSentenceTokenLength: number;
  private tgtSentenceCharLength: number;

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

  /**
   * Returns the {@link Token} length of the entire source
   * @return {number}
   */
  get sourceTokenLength() {
    return this.srcSentenceTokenLength;
  }

  /**
   * Returns the {@link Token} length of the entire target
   * @return {number}
   */
  get targetTokenLength() {
    return this.tgtSentenceTokenLength;
  }

  /**
   * Returns the character length of the entire source
   * @return {number}
   */
  get sourceCharacterLength() {
    return this.srcSentenceCharLength;
  }

  /**
   * Returns the character length of the entire target
   * @return {number}
   */
  get targetCharLength() {
    return this.tgtSentenceCharLength;
  }

  constructor() {
    this.srcNgramFreqIndex = new NgramIndex();
    this.tgtNgramFreqIndex = new NgramIndex();
    this.srcSentenceTokenLength = 0;
    this.tgtSentenceTokenLength = 0;
    this.srcSentenceCharLength = 0;
    this.tgtSentenceCharLength = 0;
  }

  /**
   * Adds a sentence to the index.
   * The tokens in these n-grams must be measured for accurate positional metrics.
   * The n-grams are passed as arguments instead of being generated internally to reduce
   * duplicating work.
   *
   * @param sourceTokens - the source sentence tokens
   * @param targetTokens - the target sentence tokens
   * @param sourceNgrams - the source sentence n-grams
   * @param targetNgrams - the target sentence n-grams
   */
  public addSentence(sourceTokens: Token[], targetTokens: Token[], sourceNgrams: Ngram[], targetNgrams: Ngram[]) {
    // token length
    this.srcSentenceTokenLength += sourceTokens.length;
    this.tgtSentenceTokenLength += targetTokens.length;

    // character length
    for (const token of sourceTokens) {
      this.srcSentenceCharLength += token.toString().length;
    }
    for (const token of targetTokens) {
      this.tgtSentenceCharLength += token.toString().length;
    }

    // n-gram frequency
    for (const ngram of sourceNgrams) {
      this.srcNgramFreqIndex.increment(ngram);
    }
    for (const ngram of targetNgrams) {
      this.tgtNgramFreqIndex.increment(ngram);
    }
  }
}
