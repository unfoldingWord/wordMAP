import Algorithm from "./Algorithm";
import NotImplemented from "./errors/NotImplemented";
import Index from "./index/Index";
import Store from "./index/Store";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Prediction from "./structures/Prediction";
import Token from "./structures/Token";

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

  /**
   * @deprecated use {@link generatePredictions} instead.
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
   * Generates an array of all possible alignment predictions
   * @param {Ngram[]} sourceNgrams - every possible n-gram in the source text
   * @param {Ngram[]} targetNgrams - every possible n-gram in the target text
   * @return {Prediction[]}
   */
  public static generatePredictions(sourceNgrams: Ngram[], targetNgrams: Ngram[]): Prediction[] {
    const predictions: Prediction[] = [];
    for (const source of sourceNgrams) {
      for (const target of targetNgrams) {
        predictions.push(new Prediction(new Alignment(source, target)));
      }

      // TRICKY: include empty match alignment
      predictions.push(new Prediction(new Alignment(source, new Ngram())));
    }
    return predictions;
  }

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
        Engine.readSizedNgrams(sentence, ngramLength));
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
      const ngram = new Ngram(sentence.slice(pos, end), ngrams.length);
      ngrams.push(ngram);
    }
    return ngrams;
  }

  /**
   * This is a temporary location for the ngram algorithm
   */
  public static ngramFrequencyAlgorithm(predictions: Prediction[], corpusStore: Store, savedAlignmentsStore: Store, unalignedSentencePair: [Token[], Token[]]) {
    for (const p  of predictions) {

      const readAlignmentFrequency = (index: Index, sourceNgram: Ngram, targetNgram: Ngram): number => {
        const alignmentFrequency = index.read(
          sourceNgram.toString(),
          targetNgram.toString()
        );
        if (alignmentFrequency === undefined) {
          return 0;
        } else {
          return alignmentFrequency;
        }
      };

      const countNgramFrequency = (index: Index, ngram: Ngram): number => {
        return index.readSum(ngram.toString());
      };

      // Alignment Frequency
      const alignmentFrequencyCorpus = readAlignmentFrequency(
        corpusStore.primaryAlignmentFrequencyIndex,
        p.alignment.source,
        p.alignment.target
      );
      const alignmentFrequencySavedAlignments = readAlignmentFrequency(
        savedAlignmentsStore.primaryAlignmentFrequencyIndex,
        p.alignment.source,
        p.alignment.target
      );

      // n-gram Frequency
      const primaryNgramFrequencyCorpus = countNgramFrequency(
        corpusStore.primaryAlignmentFrequencyIndex,
        p.alignment.source
      );
      const primaryNgramFrequencySavedAlignments = countNgramFrequency(
        savedAlignmentsStore.primaryAlignmentFrequencyIndex,
        p.alignment.source
      );
      const secondaryNgramFrequencyCorpus = countNgramFrequency(
        corpusStore.secondaryNgramFrequencyIndex,
        p.alignment.target
      );
      const secondaryNgramFrequencySavedAlignments = countNgramFrequency(
        savedAlignmentsStore.secondaryNgramFrequencyIndex,
        p.alignment.target
      );

      // Frequency Ratio
      const primaryFrequencyRatioCorpus = alignmentFrequencyCorpus /
        primaryNgramFrequencyCorpus;
      const secondaryFrequencyRatioCorpus = alignmentFrequencyCorpus /
        secondaryNgramFrequencyCorpus;
      const primaryFrequencyRatioSavedAlignments = alignmentFrequencySavedAlignments /
        primaryNgramFrequencySavedAlignments;
      const secondaryFrequencyRatioSavedAlignments = alignmentFrequencySavedAlignments /
        secondaryNgramFrequencySavedAlignments;
    }
  }

  private registeredAlgorithms: Algorithm[] = [];
  private corpusStore: Store;
  private savedAlignmentsStore: Store;

  /**
   * Returns a list of algorithms that are registered in the engine
   * @return {Array<Algorithm>}
   */
  get algorithms() {
    return this.registeredAlgorithms;
  }

  constructor() {
    // TODO: read in custom configuration
    this.corpusStore = new Store();
    this.savedAlignmentsStore = new Store();
  }

  /**
   * Adds a new algorithm to the engine.
   * @param {Algorithm} algorithm - the algorithm to run with the engine.
   */
  public registerAlgorithm(algorithm: Algorithm): void {
    this.registeredAlgorithms.push(algorithm);
  }

  public addCorpus() {
    throw new NotImplemented();
  }

  /**
   * Appends new saved alignments to the engine.
   * Adding saved alignments improves the quality of predictions.
   * @param {Array<Alignment>} savedAlignments - a list of alignments
   */
  public addAlignments(savedAlignments: Alignment[]) {
    this.savedAlignmentsStore.addAlignments(savedAlignments);
  }

  /**
   * Runs th engine
   *
   * @param {[Array<Token>]} unalignedSentencePair - The unaligned sentence pair for which alignments will be predicted.
   */
  public run(unalignedSentencePair: [Token[], Token[]]): Alignment[] {
    const sourceNgrams = Engine.generateSentenceNgrams(
      unalignedSentencePair[0]
    );
    const targetNgrams = Engine.generateSentenceNgrams(
      unalignedSentencePair[1]
    );

    // generate alignment permutations
    const predictions = Engine.generatePredictions(
      sourceNgrams,
      targetNgrams
    );

    Engine.ngramFrequencyAlgorithm(
      predictions,
      this.corpusStore,
      this.savedAlignmentsStore,
      unalignedSentencePair
    );

    let state = new Index();
    for (const algorithm of this.registeredAlgorithms) {
      state = algorithm.execute(state, this.corpusStore,
        this.savedAlignmentsStore, unalignedSentencePair
      );
    }
    return [];
  }
}
