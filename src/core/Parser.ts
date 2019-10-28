import {Token} from "wordmap-lexer";
import {NumberObject} from "../index/NumberObject";
import {PermutationIndex} from "../index/PermutationIndex";
import {Alignment} from "./Alignment";
import {Ngram} from "./Ngram";

/**
 * A collection of parsing functions
 */
export class Parser {

  /**
   * Returns an array of n-grams of a particular size from a sentence
   * @param {Array<Token>} sentence - the sentence from which n-grams will be read
   * @param {number} ngramLength - the length of each n-gram.
   * @returns {Array<Ngram>}
   */
  public static sizedNgrams(sentence: Token[], ngramLength: number): Ngram[] {
    const ngrams: Ngram[] = [];
    const sentenceLength = sentence.length;
    const occurrences: NumberObject = {};
    for (let pos = 0; pos < sentenceLength; pos++) {
      const end = pos + ngramLength;
      if (end > sentenceLength) {
        break;
      }
      const ngram = new Ngram(sentence.slice(pos, end));
      // measure occurrence
      if (ngram.key in occurrences) {
        occurrences[ngram.key]++;
      } else {
        occurrences[ngram.key] = 1;
      }
      // TRICKY: the total occurrences is measured in the CorpusIndex.
      ngram.occurrence = occurrences[ngram.key];
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
   * @deprecated used {@link indexAlignmentPermutations} instead (it's faster).
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

  /**
   * Indexes all possible alignment permutations between two sets of n-grams
   * @param {Ngram[]} sourceNgrams - every possible n-gram in the source text
   * @param {Ngram[]} targetNgrams - every possible n-gram in the target text
   * @param {PermutationIndex} index - the index that will receive the permutations
   */
  public static indexAlignmentPermutations(sourceNgrams: Ngram[], targetNgrams: Ngram[], index: PermutationIndex) {
    const tlen = targetNgrams.length;
    for (let s = 0, slen = sourceNgrams.length; s < slen; s++) {
      const sourceNgram = sourceNgrams[s];
      for (let t = 0; t < tlen; t++) {
        index.addAlignment(new Alignment(sourceNgram, targetNgrams[t]));
      }

      // TRICKY: include empty match alignment
      index.addAlignment(new Alignment(sourceNgram, new Ngram()));
    }
  }
}
