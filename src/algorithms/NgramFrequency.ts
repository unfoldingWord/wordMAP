import Algorithm from "../Algorithm";
import Index from "../index/Index";
import Store from "../index/Store";
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
    for (let pos = 0; pos < sentence.length; pos++) {
      const end = pos + ngramLength;
      if (end >= sentence.length) {
        break;
      }
      const ngram = new Ngram(sentence.slice(pos, end));
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
   * @param {Store} store - the store over which the calculations will be performed
   * @return {Index[]}
   */
  public static calculateFrequency(primaryNgrams: Ngram[], secondaryNgrams: Ngram[], store: Store) {
    const primaryIndex = new Index();
    const secondaryIndex = new Index();

    // calculate unfiltered frequencies

    for (const pNgram of primaryNgrams) {
      for (const sNgram of secondaryNgrams) {
        const primaryFrequencies = NgramFrequency.calculateNgramFrequencies(
          store.primaryAlignmentFrequencyIndex,
          pNgram,
          sNgram
        );
        primaryIndex.write(
          primaryFrequencies,
          pNgram.toString(),
          sNgram.toString()
        );

        const secondaryFrequencies = NgramFrequency.calculateNgramFrequencies(
          store.secondaryAlignmentFrequencyIndex,
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

    // calculate filtered frequencies

    const primaryKeys = Object.keys(primaryIndex.read());
    for (const pKey of primaryKeys) {
      const secondaryKeys = Object.keys(primaryIndex.read(pKey));
      for (const sKey of secondaryKeys) {
        const primaryFilteredFrequencies = NgramFrequency.calculateFilteredNgramFrequencies(
          primaryIndex,
          pKey,
          sKey
        );
        primaryIndex.append(primaryFilteredFrequencies, pKey, sKey);

        const secondaryFilteredFrequencies = NgramFrequency.calculateFilteredNgramFrequencies(
          secondaryIndex,
          sKey,
          pKey
        );
        secondaryIndex.append(secondaryFilteredFrequencies, sKey, pKey);
      }
    }

    return [primaryIndex, secondaryIndex];
  }

  /**
   * Calculates the frequency of occurrences within an index.
   * @param {Index} index - the index from which to calculate frequency
   * @param {Ngram} primaryNgram - the primary n-gram
   * @param {Ngram} secondaryNgram - the secondary n-gram
   * @return {object}
   */
  private static calculateNgramFrequencies(index: Index, primaryNgram: Ngram, secondaryNgram: Ngram): object {
    // read alignment frequency
    // NOTE: the alignment frequency will have the same value in both the primary and secondary index.
    let alignmentFrequency = index.read(
      primaryNgram.toString(),
      secondaryNgram.toString()
    );
    if (alignmentFrequency === undefined) {
      alignmentFrequency = 0;
    }

    // count n-gram frequency
    const ngramFrequency = index.readSum(primaryNgram.toString());

    // calculate ratio
    const frequencyRatio = alignmentFrequency / ngramFrequency;

    return {
      alignmentFrequency,
      ngramFrequency,
      frequencyRatio
    };
  }

  /**
   * Calculates the filtered frequency of occurrences within an index.
   * The frequency is filtered to just those alignments relative to the unaligned sentence pair.
   * This must be run after {@link calculateNgramFrequencies}.
   *
   * @param {Index} index - the index from which to calculate frequency
   * @param {string} primaryKey - the primary n-gram key
   * @param {string} secondaryKey - the secondary n-gram key
   * @returns {object}
   */
  private static calculateFilteredNgramFrequencies(index: Index, primaryKey: string, secondaryKey: string): object {
    // read alignment frequency
    // NOTE: the alignment frequency will have the same value in both the primary and secondary index.
    const alignmentFrequency = index.read(
      primaryKey,
      secondaryKey,
      "alignmentFrequency"
    );

    // count filtered n-gram frequency
    const filteredSecondaryNgrams = index.read(primaryKey);
    let filteredNgramFrequency = 0;
    for (const ngramKey in filteredSecondaryNgrams) {
      if (filteredSecondaryNgrams.hasOwnProperty(ngramKey)) {
        const calculations = filteredSecondaryNgrams[ngramKey];
        filteredNgramFrequency += calculations.alignmentFrequency;
      }
    }

    // calculate ratio
    const filteredFrequencyRatio = alignmentFrequency / filteredNgramFrequency;

    return {
      filteredNgramFrequency,
      filteredFrequencyRatio
    };
  }

  public name: string = "n-gram frequency";

  public execute(state: Index, corpusStore: Store, savedAlignmentsStore: Store, unalignedSentencePair: [Token[], Token[]]): Index {
    // generate sentence n-grams
    const primarySentenceNgrams = NgramFrequency.generateSentenceNgrams(
      unalignedSentencePair[0]
    );
    const secondarySentenceNgrams = NgramFrequency.generateSentenceNgrams(
      unalignedSentencePair[1]
    );

    // generate alignment permutations
    // const alignments = NgramFrequency.generateAlignmentPermutations(
    //   primarySentenceNgrams,
    //   secondarySentenceNgrams
    // );

    // perform calculations
    const alignmentStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      savedAlignmentsStore
    );

    const corpusStuff = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      corpusStore
    );

    // TODO: return the formatted state
    return state;
  }

}
