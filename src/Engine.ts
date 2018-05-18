import Algorithm from "./Algorithm";
import CorpusIndex from "./index/CorpusIndex";
import NumberObject from "./index/NumberObject";
import SavedAlignmentsIndex from "./index/SavedAlignmentsIndex";
import UnalignedSentenceIndex from "./index/UnalignedSentenceIndex";
import Parser from "./Parser";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Prediction from "./structures/Prediction";
import Suggestion from "./structures/Suggestion";
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
   * Executes prediction algorithms on the unaligned sentence pair.
   * The sentence tokens should contain positional metrics for better accuracy.
   *
   * @param {Token[]} sourceSentence - the source sentence tokens.
   * @param {Token[]} targetSentence - the target sentence tokens.
   * @param {CorpusIndex} cIndex
   * @param {SavedAlignmentsIndex} saIndex
   * @param {Algorithm[]} algorithms
   * @return {Prediction[]}
   */
  public static performPrediction(sourceSentence: Token[], targetSentence: Token[], cIndex: CorpusIndex, saIndex: SavedAlignmentsIndex, algorithms: Algorithm[]) {
    const sourceNgrams = Parser.ngrams(sourceSentence);
    const targetNgrams = Parser.ngrams(targetSentence);

    // generate alignment permutations
    let predictions = Engine.generatePredictions(
      sourceNgrams,
      targetNgrams
    );

    const sentenceIndex: UnalignedSentenceIndex = new UnalignedSentenceIndex();
    sentenceIndex.append([sourceSentence], [targetSentence]);

    for (const algorithm of algorithms) {
      predictions = algorithm.execute(
        predictions,
        cIndex,
        saIndex,
        sentenceIndex
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
   * @param predictions
   * @param saIndex
   */
  public static calculateConfidence(predictions: Prediction[], saIndex: SavedAlignmentsIndex): Prediction[] {
    const finalPredictions: Prediction[] = [];
    const weights: NumberObject = {
      "alignmentPosition": 0.7,
      "ngramLength": 0.2,
      "characterLength": 0.3,
      "alignmentOccurrences": 0.4,
      "uniqueness": 0.5,

      "sourceCorpusPermutationsFrequencyRatio": 0.7,
      "targetCorpusPermutationsFrequencyRatio": 0.7,

      "sourceSavedAlignmentsFrequencyRatio": 0.7,
      "targetSavedAlignmentsFrequencyRatio": 0.7
    };

    for (const p of predictions) {
      const isSavedAlignment = saIndex.alignmentFrequency.read(p.alignment);

      // confidence based on corpus
      const corpusWeightedKeys = [
        "sourceCorpusPermutationsFrequencyRatio",
        "targetCorpusPermutationsFrequencyRatio",
        "alignmentPosition",
        "ngramLength",
        "characterLength",
        "alignmentOccurrences",
        "uniqueness"
      ];
      const corpusConfidence = Engine.calculateWeightedConfidence(
        p,
        corpusWeightedKeys,
        weights
      );

      // confidence based on saved alignments
      const savedAlignmentsWeightedKeys = [
        "sourceSavedAlignmentsFrequencyRatio",
        "targetSavedAlignmentsFrequencyRatio",
        "alignmentPosition",
        "ngramLength",
        "characterLength",
        "alignmentOccurrences",
        "uniqueness"
      ];
      let confidence = Engine.calculateWeightedConfidence(
        p,
        savedAlignmentsWeightedKeys,
        weights
      );

      // prefer to use the saved alignment confidence
      if (!isSavedAlignment) {
        confidence = corpusConfidence;
        confidence *= p.getScore("phrasePlausibility");
      }

      // boost confidence for saved alignments
      if (isSavedAlignment) {
        confidence++;
      }

      p.setScore("confidence", confidence);
      finalPredictions.push(p);
    }

    return finalPredictions;
  }

  /**
   * Returns an array of alignment suggestions
   * @param predictions - the predictions from which to base the suggestion
   * @param maxSuggestions - the maximum number of suggestions to return
   * @return {Suggestion}
   */
  public static suggest(predictions: Prediction[], maxSuggestions: number = 1): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // build suggestions
    for (let i = 0; i < maxSuggestions; i++) {
      if (i >= predictions.length) {
        break;
      }
      const suggestion = new Suggestion();
      let filtered = [...predictions];

      // TRICKY: sequentially pick the best starting point in descending order
      const best = filtered.splice(i, 1)[0];
      suggestion.addPrediction(best);
      filtered = filtered.filter((p) => {
        return !best.intersects(p);
      });

      // fill suggestion
      while (filtered.length) {
        const nextBest = filtered.shift();
        if (nextBest === undefined) {
          break;
        }
        suggestion.addPrediction(nextBest);
        filtered = filtered.filter((p) => {
          return !nextBest.intersects(p);
        });
      }
      suggestions.push(suggestion);
    }

    return Engine.sortSuggestions(suggestions);
  }

  /**
   * Sorts an array of suggestions by compound confidence
   * @param {Suggestion[]} suggestions - the suggestions to sort
   * @return {Suggestion[]}
   */
  public static sortSuggestions(suggestions: Suggestion[]): Suggestion[] {
    return suggestions.sort((a, b) => {
      const aConfidence = a.compoundConfidence();
      const bConfidence = b.compoundConfidence();
      if (aConfidence < bConfidence) {
        return 1;
      }
      if (aConfidence > bConfidence) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * Sorts an array of predictions by confidence
   * @param {Prediction[]} predictions - the predictions to sort
   * @return {Prediction[]}
   */
  public static sortPredictions(predictions: Prediction[]): Prediction[] {
    return predictions.sort((a, b) => {
      const aConfidence = a.getScore("confidence");
      const bConfidence = b.getScore("confidence");
      if (aConfidence < bConfidence) {
        return 1;
      }
      if (aConfidence > bConfidence) {
        return -1;
      }
      return 0;
    });
  }

  private registeredAlgorithms: Algorithm[] = [];
  private corpusIndex: CorpusIndex;
  private savedAlignmentsIndex: SavedAlignmentsIndex;

  /**
   * Returns a list of algorithms that are registered in the engine
   * @return {Array<Algorithm>}
   */
  get algorithms() {
    return this.registeredAlgorithms;
  }

  constructor() {
    this.corpusIndex = new CorpusIndex();
    this.savedAlignmentsIndex = new SavedAlignmentsIndex();
  }

  /**
   * Generates the final confidence scores and sorts the predictions.
   * @param {Prediction[]} predictions
   * @return {Prediction[]}
   */
  public score(predictions: Prediction[]): Prediction[] {
    const results = Engine.calculateConfidence(
      predictions,
      this.savedAlignmentsIndex
    );
    return Engine.sortPredictions(results);
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
    this.corpusIndex.append(source, target);
  }

  /**
   * Appends new saved alignments to the engine.
   * Adding saved alignments improves the quality of predictions.
   * @param {Array<Alignment>} savedAlignments - a list of alignments
   */
  public addSavedAlignments(savedAlignments: Alignment[]) {
    this.savedAlignmentsIndex.append(savedAlignments);
  }

  /**
   * Returns an array of target tokens from the corpus that intersect with the
   * source tokens
   * @param {Token[]} sourceTokens
   * @return {Token[]}
   */
  public intersectTargetCorpus(sourceTokens: Token[]): Token[] {
    return this.corpusIndex.static.getTargetTokenIntersection(sourceTokens);
  }

  /**
   * Performs the prediction calculations
   * @param {Token[]} sourceSentence
   * @param {Token[]} targetSentence
   * @return {Prediction[]}
   */
  public run(sourceSentence: Token[], targetSentence: Token[]): Prediction[] {
    return Engine.performPrediction(
      sourceSentence,
      targetSentence,
      this.corpusIndex,
      this.savedAlignmentsIndex,
      this.registeredAlgorithms
    );
  }
}
