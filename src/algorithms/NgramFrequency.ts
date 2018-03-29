import Algorithm from "../Algorithm";
import DataIndex from "../index/DataIndex";
import SafeStore from "../index/SafeStore";
import Alignment from "../structures/Alignment";
import Ngram from "../structures/Ngram";
import Token from "../structures/Token";

/**
 * This algorithm calculates the frequency of n-gram occurrences.
 */
export default class NgramFrequency implements Algorithm {
  /**
   * Generates an array of all possible contiguous n-grams within the sentence.
   * @param {Array<Token>} sentence - the tokens in a sentence
   * @param {number} [maxNgramLength=3] - the maximum n-gram size to generate
   * @returns {any[]}
   */
  public static generateSentenceNgrams(sentence: Token[], maxNgramLength: number = 3) {
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
  public static readSizedNgrams(sentence: Token[], ngramLength: number): Ngram[] {
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
  public static generateAlignmentPermutations(primaryNgrams: Ngram[], secondaryNgrams: Ngram[]): Alignment[] {
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
   * Calculates the n-gram frequency
   * @param {Array<Ngram>} primaryNgrams - an array of n-grams for the primary sentence
   * @param {Array<Ngram>} secondaryNgrams - an array of n-grams from the secondary sentence
   * @param {DataIndex} index - the index over which the calculations will be performed
   * @return {SafeStore[]}
   */
  public static calculateFrequency(primaryNgrams: Ngram[], secondaryNgrams: Ngram[], index: DataIndex) {
    const primaryIndex = new SafeStore();
    const secondaryIndex = new SafeStore();

    for (const pNgram of primaryNgrams) {
      for (const sNgram of secondaryNgrams) {
        const primaryFrequencies = NgramFrequency.calculateNgramFrequencies(
          index.primaryAlignmentFrequencyIndex,
          pNgram,
          sNgram
        );
        primaryIndex.write(
          primaryFrequencies,
          pNgram.toString(),
          sNgram.toString()
        );

        const secondaryFrequencies = NgramFrequency.calculateNgramFrequencies(
          index.secondaryAlignmentFrequencyIndex,
          sNgram,
          pNgram
        );
        secondaryIndex.write(
          secondaryFrequencies,
          sNgram.toString(),
          pNgram.toString()
        );
      }
    }

    return [primaryIndex, secondaryIndex];
  }

  /**
   * Calculates the frequency of occurrences within a store.
   * @param {SafeStore} store - the store from which to calculate frequency
   * @param {Ngram} primaryNgram - the primary n-gram
   * @param {Ngram} secondaryNgram - the secondary n-gram
   * @return {object}
   */
  private static calculateNgramFrequencies(store: SafeStore, primaryNgram: Ngram, secondaryNgram: Ngram): object {
    // read alignment frequency
    // NOTE: the alignment frequency will have the same value in both the primary and secondary store.
    let alignmentFrequency = store.read(
      primaryNgram.toString(),
      secondaryNgram.toString()
    );
    if (alignmentFrequency === undefined) {
      alignmentFrequency = 0;
    }

    // count n-gram frequency
    const ngramFrequency = store.readSum(primaryNgram.toString());

    // calculate ratio
    const frequencyRatio = alignmentFrequency / ngramFrequency;

    return {
      alignmentFrequency,
      ngramFrequency,
      frequencyRatio
    };
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

  public name: string = "n-gram frequency";

  public execute(state: SafeStore, corpusIndex: DataIndex, savedAlignmentsIndex: DataIndex, unalignedSentencePair: [Token[], Token[]]): SafeStore {
    // generate sentence n-grams
    const primarySentenceNgrams = NgramFrequency.generateSentenceNgrams(
      unalignedSentencePair[0]
    );
    const secondarySentenceNgrams = NgramFrequency.generateSentenceNgrams(
      unalignedSentencePair[1]
    );

    // generate alignment permutations
    const alignments = NgramFrequency.generateAlignmentPermutations(
      primarySentenceNgrams,
      secondarySentenceNgrams
    );

    // generate filtered indexes
    const filteredCorpusIndex = NgramFrequency.filterIndex(
      corpusIndex,
      alignments
    );
    const filteredSavedAlignmentsIndex = NgramFrequency.filterIndex(
      savedAlignmentsIndex,
      alignments
    );

    // perform calculations
    const alignmentStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      savedAlignmentsIndex
    );
    const filteredAlignmentStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      filteredSavedAlignmentsIndex
    );
    const corpusStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      corpusIndex
    );
    const filteredCorpusStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      filteredCorpusIndex
    );

    // TODO: return the formatted state
    return state;
  }

}
