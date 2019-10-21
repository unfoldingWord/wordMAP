import {Token} from "wordmap-lexer";
import Algorithm from "./Algorithm";
import AlgorithmInterface from "./AlgorithmInterface";
import GlobalAlgorithm from "./GlobalAlgorithm";
import AlignmentMemoryIndex from "./index/AlignmentMemoryIndex";
import CorpusIndex from "./index/CorpusIndex";
import NumberObject from "./index/NumberObject";
import UnalignedSentenceIndex from "./index/UnalignedSentenceIndex";
import Parser from "./Parser";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Prediction from "./structures/Prediction";
import Suggestion from "./structures/Suggestion";

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
    const ngrams: Ngram[] = [];
    const maxLength = Math.min(maxNgramLength, sentence.length);
    for (let ngramLength = 1; ngramLength <= maxLength; ngramLength++) {
      ngrams.push.apply(ngrams, Engine.readSizedNgrams(sentence, ngramLength));
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
      // if (prediction.hasScore(key)) {
      scoreSum += prediction.getScore(key) * weight;
      weightSum += weight;
      // }
    }
    return scoreSum / weightSum;
  }

  /**
   * Scores the predictions and returns a filtered set of suggestions
   * TODO: this should not be done in the engine because we don't know anything about the algorithms here.
   * @param predictions
   * @param saIndex
   */
  public static calculateConfidence(predictions: Prediction[], saIndex: AlignmentMemoryIndex): Prediction[] {
    const finalPredictions: Prediction[] = [];
    const weights: NumberObject = {
      "alignmentPosition": 0.7,
      "sourceNgramLength": 0.2,
      "characterLength": 0.3,
      "alignmentOccurrences": 0.4,
      "lemmaAlignmentOccurrences": 0.4,
      "uniqueness": 0.5,
      "lemmaUniqueness": 0.5,

      "sourceCorpusPermutationsFrequencyRatio": 0.7,
      "sourceCorpusLemmaPermutationsFrequencyRatio": 0.7,
      "targetCorpusPermutationsFrequencyRatio": 0.7,
      "targetCorpusLemmaPermutationsFrequencyRatio": 0.7,

      "sourceAlignmentMemoryFrequencyRatio": 0.7,
      "sourceAlignmentMemoryLemmaFrequencyRatio": 0.7,
      "targetAlignmentMemoryFrequencyRatio": 0.7,
      "targetAlignmentMemoryLemmaFrequencyRatio": 0.7
    };

    for (const p of predictions) {
      let isAlignmentMemory = saIndex.alignmentFrequency.read(p.alignment);
      // TRICKY: fall back to lemma
      if (!isAlignmentMemory && p.alignment.lemmaKey !== undefined) {
        isAlignmentMemory = saIndex.alignmentFrequency.read(p.alignment.lemmaKey);
      }

      // confidence based on corpus
      const corpusWeightedKeys = [
        "sourceCorpusPermutationsFrequencyRatio",
        "sourceCorpusLemmaPermutationsFrequencyRatio",
        "targetCorpusPermutationsFrequencyRatio",
        "targetCorpusLemmaPermutationsFrequencyRatio",
        "alignmentPosition",
        "ngramLength",
        "characterLength",
        "alignmentOccurrences",
        "lemmaAlignmentOccurrences",
        "uniqueness",
        "lemmaUniqueness"
      ];
      const corpusConfidence = Engine.calculateWeightedConfidence(
        p,
        corpusWeightedKeys,
        weights
      );

      // confidence based on alignment memory
      const alignmentMemoryWeightedKeys = [
        "sourceAlignmentMemoryFrequencyRatio",
        "sourceAlignmentMemoryLemmaFrequencyRatio",
        "targetAlignmentMemoryFrequencyRatio",
        "targetAlignmentMemoryLemmaFrequencyRatio",
        "alignmentPosition",
        "ngramLength",
        "characterLength",
        "alignmentOccurrences",
        "lemmaAlignmentOccurrences",
        "uniqueness",
        "lemmaUniqueness"
      ];
      let confidence = Engine.calculateWeightedConfidence(
        p,
        alignmentMemoryWeightedKeys,
        weights
      );

      // prefer to use the saved alignment confidence
      if (!isAlignmentMemory) {
        confidence = corpusConfidence;
        confidence *= p.getScore("phrasePlausibility");
        // TODO: lemmaPhrasePlausibility
      }

      // boost confidence for alignment memory
      if (isAlignmentMemory) {
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

  private maxTargetNgramLength: number;
  private maxSourceNgramLength: number;
  private nGramWarnings: boolean;
  private registeredAlgorithms: Algorithm[] = [];
  private registeredGlobalAlgorithms: GlobalAlgorithm[] = [];
  private corpusIndex: CorpusIndex;
  private alignmentMemoryIndex: AlignmentMemoryIndex;

  /**
   * Returns a list of algorithms that are registered in the engine
   * @return {Array<Algorithm>}
   */
  get algorithms() {
    return this.registeredAlgorithms;
  }

  constructor({sourceNgramLength = 3, targetNgramLength = 3, nGramWarnings = true} = {
    sourceNgramLength: 3,
    targetNgramLength: 3,
    nGramWarnings: true
  }) {
    this.maxSourceNgramLength = sourceNgramLength;
    this.maxTargetNgramLength = targetNgramLength;
    this.nGramWarnings = nGramWarnings;
    this.corpusIndex = new CorpusIndex();
    this.alignmentMemoryIndex = new AlignmentMemoryIndex();
  }

  /**
   * Executes prediction algorithms on the unaligned sentence pair.
   * The sentence tokens should contain positional metrics for better accuracy.
   *
   * @param {Token[]} sourceSentence - the source sentence tokens.
   * @param {Token[]} targetSentence - the target sentence tokens.
   * @param {CorpusIndex} cIndex
   * @param {AlignmentMemoryIndex} saIndex
   * @param {Algorithm[]} algorithms
   * @param {GlobalAlgorithm[]} globalAlgorithms
   * @return {Prediction[]}
   */
  public performPrediction(sourceSentence: Token[], targetSentence: Token[], cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, algorithms: Algorithm[], globalAlgorithms: GlobalAlgorithm[]) {
    const sourceNgrams = Parser.ngrams(
      sourceSentence,
      this.maxSourceNgramLength
    );
    const targetNgrams = Parser.ngrams(
      targetSentence,
      this.maxTargetNgramLength
    );

    // generate alignment permutations
    let predictions = Engine.generatePredictions(
      sourceNgrams,
      targetNgrams
    );
    const numPredictions = predictions.length;

    const sentenceIndex: UnalignedSentenceIndex = new UnalignedSentenceIndex();
    sentenceIndex.append([sourceSentence], [targetSentence]);

    // run global algorithms first
    for (const algorithm of globalAlgorithms) {
      predictions = algorithm.execute(
        predictions,
        cIndex,
        saIndex,
        sentenceIndex
      );
    }

    // run regular algorithms
    const numAlgorithms = algorithms.length;
    for (let i = 0; i < numPredictions; i++) {
      for (let j = 0; j < numAlgorithms; j++) {
        algorithms[j].execute(
          predictions[i],
          cIndex,
          saIndex,
          sentenceIndex
        );
      }
    }

    return predictions;
  }

  /**
   * Generates the final confidence scores and sorts the predictions.
   * @param {Prediction[]} predictions
   * @return {Prediction[]}
   */
  public score(predictions: Prediction[]): Prediction[] {
    const results = Engine.calculateConfidence(
      predictions,
      this.alignmentMemoryIndex
    );
    return Engine.sortPredictions(results);
  }

  /**
   * Adds a new algorithm to the engine.
   * @param {Algorithm} algorithm - the algorithm to run with the engine.
   */
  public registerAlgorithm(algorithm: AlgorithmInterface): void {
    if (algorithm instanceof GlobalAlgorithm) {
      this.registeredGlobalAlgorithms.push(algorithm);
    } else if (algorithm instanceof Algorithm) {
      this.registeredAlgorithms.push(algorithm);
    } else {
      throw new Error("Unsupported algorithm type");
    }
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
   * Appends new alignment memory to the engine.
   * Adding alignment memory improves the quality of predictions.
   * @param {Array<Alignment>} alignmentMemory - a list of alignments
   */
  public addAlignmentMemory(alignmentMemory: Alignment[]) {
    // TODO: we need a better way for calling program to query the number of nGrams that exceed the limit
    if (this.nGramWarnings) {
      for (let i = alignmentMemory.length - 1; i >= 0; i--) {
        const target = alignmentMemory[i].targetNgram;
        if (target.tokenLength > this.maxTargetNgramLength) {
          console.warn(`Target Alignment Memory "${target.key}" exceeds maximum n-gram length of ${this.maxTargetNgramLength} and may be ignored.`);
        }
        const source = alignmentMemory[i].sourceNgram;
        if (source.tokenLength > this.maxSourceNgramLength) {
          console.warn(`Source Alignment Memory "${source.key}" exceeds maximum n-gram length of ${this.maxSourceNgramLength} and may be ignored.`);
        }
      }
    }

    this.alignmentMemoryIndex.append(alignmentMemory);
  }

  /**
   * Performs the prediction calculations
   * @param {Token[]} sourceSentence
   * @param {Token[]} targetSentence
   * @return {Prediction[]}
   */
  public run(sourceSentence: Token[], targetSentence: Token[]): Prediction[] {
    return this.performPrediction(
      sourceSentence,
      targetSentence,
      this.corpusIndex,
      this.alignmentMemoryIndex,
      this.registeredAlgorithms,
      this.registeredGlobalAlgorithms
    );
  }
}
