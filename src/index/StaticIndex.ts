import {Ngram, Token} from "../core/";
import {NgramIndex} from "./";

/**
 * A collection of indexes on the static content.
 * TODO: maybe I should split this into sentences as well.
 * e.g. a source SentenceIndex and a target SentenceIndex
 * Then we could reuse it in other places such as word-mt.
 */
export class StaticIndex {
  private srcNgramFreqIndex: NgramIndex;
  private srcTokenLength: number;
  private srcCharLength: number;

  private tgtNgramFreqIndex: NgramIndex;
  private tgtTokenLength: number;
  private tgtCharLength: number;

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
    return this.srcTokenLength;
  }

  /**
   * Returns the {@link Token} length of the entire target
   * @return {number}
   */
  get targetTokenLength() {
    return this.tgtTokenLength;
  }

  /**
   * Returns the character length of the entire source
   * @return {number}
   */
  get sourceCharacterLength() {
    return this.srcCharLength;
  }

  /**
   * Returns the character length of the entire target
   * @return {number}
   */
  get targetCharLength() {
    return this.tgtCharLength;
  }

  constructor() {
    this.srcNgramFreqIndex = new NgramIndex();
    this.tgtNgramFreqIndex = new NgramIndex();
    this.srcTokenLength = 0;
    this.tgtTokenLength = 0;
    this.srcCharLength = 0;
    this.tgtCharLength = 0;
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
    this.srcTokenLength += sourceTokens.length;
    this.tgtTokenLength += targetTokens.length;

    // character length
    for (let i = 0, len = sourceTokens.length; i < len; i++) {
      this.srcCharLength += sourceTokens[i].toString().length;
    }
    for (let i = 0, len = targetTokens.length; i < len; i++) {
      this.tgtCharLength += targetTokens[i].toString().length;
    }

    // n-gram frequency
    for (let i = 0, len = sourceNgrams.length; i < len; i++) {
      this.srcNgramFreqIndex.increment(sourceNgrams[i]);
    }
    for (let i = 0, len = targetNgrams.length; i < len; i++) {
      this.tgtNgramFreqIndex.increment(targetNgrams[i]);
    }
  }
}
