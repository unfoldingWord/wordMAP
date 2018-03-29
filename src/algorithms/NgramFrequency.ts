import DataIndex from "../DataIndex";
import Algorithm from "../interfaces/Algorithm";
import KeyStore from "../interfaces/KeyStore";
import Alignment from "../structures/Alignment";
import Ngram from "../structures/Ngram";
import Token from "../structures/Token";

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export default class NgramFrequency implements Algorithm {
  /**
   * Generates an array of all possible contiguous n-grams within the sentence.
   * @param {Array<Token>} sentence
   * @param {number} maxNgramLength
   * @returns {any[]}
   */
  public static generateSentenceNgrams(
    sentence: Token[], maxNgramLength: number = 3) {
    if (maxNgramLength < 0) {
      throw new RangeError(
        `Maximum n-gram size cannot be less than 0. Received ${maxNgramLength}`);
    }
    let ngrams: Ngram[] = [];
    const maxLength = Math.min(maxNgramLength, sentence.length);
    for (let ngramLength = 1; ngramLength < maxLength; ngramLength++) {
      ngrams = ngrams.concat(
        NgramFrequency.readSizedNgrams(sentence, ngramLength));
    }
    return ngrams;
  }

  /**
   * Returns an array of n-grams of a particular size from a sentence
   * @param {Array<Token>} sentence - the sentence from which n-grams will be read
   * @param {number} ngramLength - the length of each n-gram.
   * @returns {Array<Ngram>}
   */
  public static readSizedNgrams(
    sentence: Token[], ngramLength: number): Ngram[] {
    const ngrams: Ngram[] = [];
    for (let index = 0; index < sentence.length; index++) {
      const end = index + ngramLength;
      if (end >= sentence.length) {
        break;
      }
      const ngram = new Ngram(sentence.slice(index, end));
      ngrams.push(ngram);
    }
    return ngrams;
  }

  /**
   * Generates an array of all possible alignments between two texts.
   * @param {Array<Ngram>} primaryNgrams - n-grams from the primary text
   * @param {Array<Ngram>} secondaryNgrams - n-grams from the secondary text
   * @returns {Array<Alignment>}
   */
  public static generateAlignmentPermutations(
    primaryNgrams: Ngram[],
    secondaryNgrams: Ngram[]): Alignment[] {
    const alignments: Alignment[] = [];
    for (const pgram of primaryNgrams) {
      for (const sgram of secondaryNgrams) {
        alignments.push(new Alignment(pgram, sgram));
      }

      // TRICKY: include empty match alignment
      alignments.push(new Alignment(pgram, new Ngram()));
    }
    return alignments;
  }

  /**
   * Filters an index to just the data relative to the control set
   * @param {DataIndex} index - the index to be filtered.
   * @param {Array<Alignment>} controlSet - an array of alignments that will control what is filtered.
   * @return {DataIndex} a new filtered index
   */
  private static filterIndex(index: DataIndex, controlSet: Alignment[]) {
    // TODO: filter the index
    return index;
  }

  /**
   * Calculates the n-gram frequency
   * @param {Array<Ngram>} primaryNgrams - an array of n-grams for the primary sentence
   * @param {Array<Ngram>} secondaryNgrams - an array of n-grams from the secondary sentence
   * @param {DataIndex} index - the index over which the calculations will be performed
   * @return {KeyStore[]}
   */
  private static calculateFrequency(
    primaryNgrams: Ngram[], secondaryNgrams: Ngram[],
    index: DataIndex) {
    const primaryIndex: KeyStore = {};
    const secondaryIndex: KeyStore = {};

    for (const pNgram of primaryNgrams) {
      for (const sNgram of secondaryNgrams) {
        const alignmentFrequency = index.getPrimaryAlignmentFrequency(
          pNgram,
          sNgram,
        );
        primaryIndex[pNgram.toString()][sNgram.toString()] = {
          alignmentFrequency,
          primaryCorpusFrequency: 0, // TODO: calculate
          primaryCorpusFrequencyRatio: 0, // TODO: calculate
        };
      }
    }

    return [primaryIndex, secondaryIndex];
  }

  public name: string = "n-gram frequency";

  public execute(state: KeyStore, corpusIndex: DataIndex, savedAlignmentsIndex: DataIndex, unalignedSentencePair: [Token[], Token[]]): KeyStore {
    const primarySentenceNgrams = NgramFrequency.generateSentenceNgrams(
      unalignedSentencePair[0],
    );
    const secondarySentenceNgrams = NgramFrequency.generateSentenceNgrams(
      unalignedSentencePair[1],
    );
    const alignments = NgramFrequency.generateAlignmentPermutations(
      primarySentenceNgrams,
      secondarySentenceNgrams,
    );

    const filteredCorpusIndex = NgramFrequency.filterIndex(
      corpusIndex,
      alignments,
    );
    const filteredSavedAlignmentsIndex = NgramFrequency.filterIndex(
      savedAlignmentsIndex,
      alignments,
    );

    const alignmentStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      savedAlignmentsIndex,
    );
    const filteredAlignmenStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      filteredSavedAlignmentsIndex,
    );
    const corpusStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      corpusIndex,
    );
    const filteredCorpusStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      filteredCorpusIndex,
    );

    // TODO: return the formatted state
    return {};
  }

}
