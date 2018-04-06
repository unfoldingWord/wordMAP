import Algorithm from "./Algorithm";
import EngineIndex from "./index/EngineIndex";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import NumberObject from "./structures/NumberObject";
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
   * Generates an array of all possible alignments
   * @param {Ngram[]} sourceNgrams - every possible n-gram in the source text
   * @param {Ngram[]} targetNgrams - every possible n-gram in the target text
   * @return {Alignment[]}
   */
  public static generateAlignments(sourceNgrams: Ngram[], targetNgrams: Ngram[]): Alignment[] {
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

  /**
   * Executes prediction algorithms on the unaligned sentence pair
   * @param {[Token[]]} unalignedSentencePair
   * @param {EngineIndex} corpusStore
   * @param {EngineIndex} savedAlignmentsStore
   * @param {Algorithm[]} algorithms
   * @return {Prediction[]}
   */
  public static performPrediction(unalignedSentencePair: [Token[], Token[]], corpusStore: EngineIndex, savedAlignmentsStore: EngineIndex, algorithms: Algorithm[]) {
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

    for (const algorithm of algorithms) {
      predictions = algorithm.execute(
        predictions,
        corpusStore,
        savedAlignmentsStore,
        unalignedSentencePair
      );
    }

    return predictions;
  }

  /**
   * Calculates the weighted confidence score of a prediction
   * @param {Prediction} prediction - the prediction to score
   * @param {string[]} scoreKeys - the score keys to include in the calculation
   * @param {NumberObject} weights - the weights to influence the calculation
   * @return {number}
   */
  public static calculateWeightedConfidence(prediction: Prediction, scoreKeys: string[], weights: NumberObject): number {
    let weightSum = 0;
    let scoreSum = 0;
    for (const key of scoreKeys) {
      let weight = 1;
      if (key in weights) {
        weight = weights[key];
      }
      scoreSum += prediction.getScore(key) * weight;
      weightSum += weight;
    }
    return scoreSum / weightSum;
  }

  /**
   * Scores the predictions and returns a filtered set of suggestions
   * @param {Prediction[]} predictions
   * @param {EngineIndex} savedAlignmentsStore
   * @return {Prediction[]}
   */
  public static score(predictions: Prediction[], savedAlignmentsStore: EngineIndex): Prediction[] {
    const suggestions: Prediction[] = [];

    for (const p of predictions) {
      // TODO: what scores do we weight? We have primary + secondary scores and corpus + saved alignment.
      const weightedKeys = [
        "alignmentPosition",
        "alignmentFrequencyCorpus"
      ];
      let confidence = Engine.calculateWeightedConfidence(
        p,
        weightedKeys,
        {}
      );

      // boost confidence for saved alignments
      const isSavedAlignment = savedAlignmentsStore.primaryAlignmentFrequencyIndex.read(
        p.alignment.source.key,
        p.alignment.target.key
      );
      if (isSavedAlignment) {
        confidence ++;
      }

      p.setScore("confidence", confidence);
      suggestions.push(p);
    }

    return suggestions;
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

  /**
   * Appends new corpus to the engine.
   * @param {[Token[]]} source - an array of tokenized source sentences.
   * @param {[Token[]]} target - an array of tokenized target sentences.
   */
  public addCorpus(source: Token[][], target: Token[][]) {
    if (source.length !== target.length) {
      throw Error("source and target corpus must be the same length");
    } else {
      for (let i = 0; i < source.length; i++) {
        const measuredUnalignedSentencePair: [Token[], Token[]] = [
          Engine.generateMeasuredTokens(source[i]),
          Engine.generateMeasuredTokens(target[i])
        ];
        const sourceNgrams = Engine.generateSentenceNgrams(
          measuredUnalignedSentencePair[0]
        );
        const targetNgrams = Engine.generateSentenceNgrams(
          measuredUnalignedSentencePair[1]
        );
        const alignments = Engine.generateAlignments(sourceNgrams, targetNgrams);
        this.corpusStore.addAlignments(alignments);
      }
    }
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
   * Runs the engine
   *
   * @param {[Array<Token>]} unalignedSentencePair - The unaligned sentence pair for which alignments will be predicted.
   */
  public run(unalignedSentencePair: [Token[], Token[]]): Prediction[] {
    const predictions = Engine.performPrediction(
      unalignedSentencePair,
      this.corpusStore,
      this.savedAlignmentsStore,
      this.registeredAlgorithms
    );
    return Engine.score(predictions, this.savedAlignmentsStore);
  }
}
