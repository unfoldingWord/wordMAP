import Ngram from "../structures/Ngram";
import Token from "../structures/Token";
import NgramIndex from "./NgramIndex";
import TokenTable from "./TokenTable";

/**
 * A collection of indexes on the static content.
 */
export default class StaticIndex {
  private srcNgramFreqIndex: NgramIndex;
  private srcTokenLength: number;
  private srcCharLength: number;

  private tgtNgramFreqIndex: NgramIndex;
  private tgtTokenLength: number;
  private tgtCharLength: number;

  /**
   * A lookup table to find target tokens that appear in conjunction with
   * src tokens.
   */
  private tgtTokenLookup: TokenTable;

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
    this.tgtTokenLookup = {};
    this.srcTokenLength = 0;
    this.tgtTokenLength = 0;
    this.srcCharLength = 0;
    this.tgtCharLength = 0;
  }

  /**
   *
   * @return {any}
   * @param sourceTokens
   */
  public getTargetTokenIntersection(sourceTokens: Token[]): Token[] {
    let intersection = new Set();
    for (const t of sourceTokens) {
      if (t.toString() in this.tgtTokenLookup) {
        intersection = new Set([
          ...intersection,
          ...this.tgtTokenLookup[t.toString()]
        ]);
      }
    }
    return Array.from(intersection);
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
    for (const token of sourceTokens) {
      this.srcCharLength += token.toString().length;

      // build lookup table
      if (!this.tgtTokenLookup[token.toString()]) {
        this.tgtTokenLookup[token.toString()] = new Set(targetTokens);
      } else {
        for (const targetT of targetTokens) {
          this.tgtTokenLookup[token.toString()].add(targetT);
        }
      }
    }
    for (const token of targetTokens) {
      this.tgtCharLength += token.toString().length;
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
