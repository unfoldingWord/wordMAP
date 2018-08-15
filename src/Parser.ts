import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Token from "./structures/Token";

/**
 * A collection of parsing functions
 */
export default class Parser {

  /**
   * Returns an array of n-grams of a particular size from a sentence
   * @param {Array<Token>} sentence - the sentence from which n-grams will be read
   * @param {number} ngramLength - the length of each n-gram.
   * @returns {Array<Ngram>}
   */
  public static sizedNgrams(sentence: Token[], ngramLength: number): Ngram[] {
    const ngrams: Ngram[] = [];
    const sentenceLength = sentence.length;
    for (let pos = 0; pos < sentenceLength; pos++) {
      const end = pos + ngramLength;
      if (end > sentenceLength) {
        break;
      }
      const ngram = new Ngram(sentence.slice(pos, end));
      ngrams.push(ngram);
    }
    return ngrams;
  }

  /**
   * Generates an array of all possible contiguous n-grams within the sentence.
   * @param {Array<Token>} sentence - the tokens in a sentence
   * @param {number} [maxNgramLength=3] - the maximum n-gram size to generate
   * @returns {any[]}
   */
  public static ngrams(sentence: Token[], maxNgramLength: number = 3) {
    if (maxNgramLength < 0) {
      throw new RangeError(
        `Maximum n-gram size cannot be less than 0. Received ${maxNgramLength}`);
    }
    const ngrams: Ngram[] = [];
    const maxLength = Math.min(maxNgramLength, sentence.length);
    for (let ngramLength = 1; ngramLength <= maxLength; ngramLength++) {
      ngrams.push.apply(ngrams, Parser.sizedNgrams(sentence, ngramLength));
    }
    return ngrams;
  }

  /**
   * Generates an array of all possible alignments between two sets of n-grams
   * @param {Ngram[]} sourceNgrams - every possible n-gram in the source text
   * @param {Ngram[]} targetNgrams - every possible n-gram in the target text
   * @return {Alignment[]}
   */
  public static alignments(sourceNgrams: Ngram[], targetNgrams: Ngram[]): Alignment[] {
    const alignments: Alignment[] = [];
    for (const source of sourceNgrams) {
      for (const target of targetNgrams) {
        alignments.push(new Alignment(source, target));
      }

      // TRICKY: include empty match alignment
      alignments.push(new Alignment(source, new Ngram()));
    }
    return alignments;
  }
}
