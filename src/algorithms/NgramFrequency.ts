import Algorithm from "../Algorithm";
import Engine from "../Engine";
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
   * Calculates the n-gram frequency
   * @param {Array<Ngram>} primaryNgrams - an array of n-grams for the primary sentence
   * @param {Array<Ngram>} secondaryNgrams - an array of n-grams from the secondary sentence
   * @param {Store} store - the store over which the calculations will be performed
   * @return {Index[]}
   */
  public static calculateFrequency(primaryNgrams: Ngram[], secondaryNgrams: Ngram[], store: Store) {
    /**
     * An index of possible alignments keyed by the primary n-gram
     * @type {Index}
     */
    const primaryIndex = new Index();

    /**
     * An index of possible alignments keyed by the secondary n-gram
     * TRICKY: this is redundant but generated for convenience.
     *
     * @type {Index}
     */
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

        // this is redundant but generated for convenience
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

        // this is redundant but generated for convenience
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
    // TODO: it is possible the index does not contain this alignment
    // we need to handle this case.

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
    const primarySentenceNgrams = Engine.generateSentenceNgrams(
      unalignedSentencePair[0]
    );
    const secondarySentenceNgrams = Engine.generateSentenceNgrams(
      unalignedSentencePair[1]
    );

    // generate alignment permutations
    const alignments = Engine.generateAlignmentPermutations(
      primarySentenceNgrams,
      secondarySentenceNgrams
    );

    // TODO: need to combine the corpus and alignment frequency calc objects
    // into a single output so we do not need to loop more than once when updating.
    // I could pass in both stores to the method.

    // TRICKY: the below calculations actually produce alignments although
    // they do not use the alignment class and are structured as an index.

    // perform calculations
    const alignmentFrequencies = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      savedAlignmentsStore
    );

    const corpusFrequencies = NgramFrequency.calculateFrequency(
      primarySentenceNgrams,
      secondarySentenceNgrams,
      corpusStore
    );

    // I think these two should be combined into a single one.
    state.write(alignmentFrequencies, "alignment-frequencies");
    state.write(corpusFrequencies, "corpus-frequencies");

    // state.write(primarySentenceNgrams, "primary-ngrams");
    // state.write(secondarySentenceNgrams, "secondary-ngrams");
    state.write(alignments, "alignments");
    return state;
  }

}
