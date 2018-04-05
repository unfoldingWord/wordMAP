import Algorithm from "./Algorithm";
import NotImplemented from "./errors/NotImplemented";
import EngineIndex from "./index/EngineIndex";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Prediction from "./structures/Prediction";
import Token from "./structures/Token";

/**
 * Represents a multi-lingual word alignment prediction engine.
 */
export default class Engine {

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
    for (let ngramLength = 1; ngramLength <= maxLength; ngramLength++) {
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
      if (end > sentence.length) {
        break;
      }
      const ngram = new Ngram(sentence.slice(pos, end));
      ngrams.push(ngram);
    }
    return ngrams;
  }

  /**
   * Generates an array of tokens with their relative positions measured.
   *
   * @param {Token[]} tokens - the tokens to measure
   * @return {Token[]} - a new list of measured tokens
   */
  public static generateMeasuredTokens(tokens: Token[]): Token[] {
    const measuredTokens: Token[] = [];
    let charPos = 0;
    for (const t of tokens) {
      measuredTokens.push(new Token(
        t.toString(),
        measuredTokens.length,
        charPos
      ));
      charPos += t.toString().length;
    }
    return measuredTokens;
  }

  private registeredAlgorithms: Algorithm[] = [];
  private corpusStore: EngineIndex;
  private savedAlignmentsStore: EngineIndex;

  /**
   * Returns a list of algorithms that are registered in the engine
   * @return {Array<Algorithm>}
   */
  get algorithms() {
    return this.registeredAlgorithms;
  }

  constructor() {
    // TODO: read in custom configuration
    this.corpusStore = new EngineIndex();
    this.savedAlignmentsStore = new EngineIndex();
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

    const measuredUnalignedSentencePair: [Token[], Token[]] = [
      Engine.generateMeasuredTokens(unalignedSentencePair[0]),
      Engine.generateMeasuredTokens(unalignedSentencePair[1])
    ];

    const sourceNgrams = Engine.generateSentenceNgrams(
      measuredUnalignedSentencePair[0]
    );
    const targetNgrams = Engine.generateSentenceNgrams(
      measuredUnalignedSentencePair[1]
    );

    // generate alignment permutations
    let predictions = Engine.generatePredictions(
      sourceNgrams,
      targetNgrams
    );

    for (const algorithm of this.registeredAlgorithms) {
      predictions = algorithm.execute(
        predictions,
        this.corpusStore,
        this.savedAlignmentsStore,
        measuredUnalignedSentencePair
      );
    }
    return [];
  }
}
