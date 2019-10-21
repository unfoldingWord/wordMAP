import Lexer, {Token} from "wordmap-lexer";
import AlignmentOccurrences from "./algorithms/AlignmentOccurrences";
import AlignmentPosition from "./algorithms/AlignmentPosition";
import AlignmentRelativeOccurrence from "./algorithms/AlignmentRelativeOccurrence";
import CharacterLength from "./algorithms/CharacterLength";
import LemmaNgramFrequency from "./algorithms/LemmaNgramFrequency";
import NgramFrequency from "./algorithms/NgramFrequency";
import NgramLength from "./algorithms/NgramLength";
import PhrasePlausibility from "./algorithms/PhrasePlausibility";
import Uniqueness from "./algorithms/Uniqueness";
import Engine from "./Engine";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Prediction from "./structures/Prediction";
import Suggestion from "./structures/Suggestion";

/**
 * Multi-Lingual Word Alignment Prediction
 */
export default class WordMap {
  private engine: Engine;

  constructor(opts = {}) {

    this.engine = new Engine(opts);
    this.engine.registerAlgorithm(new NgramFrequency());
    this.engine.registerAlgorithm(new LemmaNgramFrequency()); // TODO: combine this with NgramFrequency for better performance

    this.engine.registerAlgorithm(new AlignmentRelativeOccurrence());
    this.engine.registerAlgorithm(new AlignmentPosition());
    this.engine.registerAlgorithm(new PhrasePlausibility());
    this.engine.registerAlgorithm(new NgramLength());
    this.engine.registerAlgorithm(new CharacterLength());
    this.engine.registerAlgorithm(new AlignmentOccurrences());
    this.engine.registerAlgorithm(new Uniqueness());
  }

  /**
   * Adds an array of corpus
   * @param {string[][]} corpus
   */
  public appendCorpus(corpus: string[][]) {
    for (const pair of corpus) {
      this.appendCorpusString(pair[0], pair[1]);
    }
  }

  /**
   * Add corpus to the MAP.
   * These may be single sentences or multiple sentence delimited by new lines.
   * @param {string} source
   * @param {string} target
   */
  public appendCorpusString(source: string, target: string) {
    const sourceSentences = source.split("\n");
    const targetSentences = target.split("\n");

    const sourceTokens: Token[][] = [];
    const targetTokens: Token[][] = [];

    const sourceLength = sourceSentences.length;
    const targetLength = targetSentences.length;

    if (sourceLength !== targetLength) {
      throw Error("source and target corpus must be the same length");
    }

    for (let i = 0; i < sourceLength; i++) {
      sourceTokens.push(Lexer.tokenize(sourceSentences[i]));
      targetTokens.push(Lexer.tokenize(targetSentences[i]));
    }

    this.appendCorpusTokens(sourceTokens, targetTokens);
  }

  /**
   * Adds tokenized corpus to map
   * @param sourceTokens
   * @param targetTokens
   */
  public appendCorpusTokens(sourceTokens: Token[][], targetTokens: Token[][]) {
    if (sourceTokens.length !== targetTokens.length) {
      throw Error("source and target corpus must be the same length");
    }

    this.engine.addCorpus(sourceTokens, targetTokens);
  }

  /**
   * Appends alignment memory engine.
   * @param alignments - an alignment or array of alignments
   */
  public appendAlignmentMemory(alignments: Alignment | Alignment[]) {
    if (alignments instanceof Array) {
      this.engine.addAlignmentMemory(alignments);
    } else {
      this.engine.addAlignmentMemory([alignments]);
    }
  }

  /**
   * Appends some alignment memory.
   * This may be multiple lines of text or a single line.
   *
   * @param {string} source - a string of source phrases separated by new lines
   * @param {string} target - a string of target phrases separated by new lines
   * @return {Alignment[]} an array of alignment objects (as a convenience)
   */
  public appendAlignmentMemoryString(source: string, target: string): Alignment[] {
    const alignments: Alignment[] = [];
    const sourceLines = source.split("\n");
    const targetLines = target.split("\n");
    const sourceLinesLength = sourceLines.length;
    if (sourceLinesLength !== targetLines.length) {
      throw new Error("source and target lines must be the same length");
    }
    for (let i = 0; i < sourceLinesLength; i++) {
      const sourceTokens = Lexer.tokenize(sourceLines[i]);
      const targetTokens = Lexer.tokenize(targetLines[i]);
      alignments.push(new Alignment(
        new Ngram(sourceTokens),
        new Ngram(targetTokens)
      ));
    }
    this.appendAlignmentMemory(alignments);
    return alignments;
  }

  /**
   * Predicts the word alignments between the sentences.
   * @param {string} sourceSentence - a sentence from the source text
   * @param {string} targetSentence - a sentence from the target text
   * @param {number} maxSuggestions - the maximum number of suggestions to return
   * @return {Suggestion[]}
   */
  public predict(sourceSentence: string | Token[], targetSentence: string | Token[], maxSuggestions: number = 1): Suggestion[] {
    let sourceTokens = [];
    let targetTokens = [];

    if (typeof sourceSentence === "string") {
      sourceTokens = Lexer.tokenize(sourceSentence);
    } else {
      sourceTokens = sourceSentence;
    }

    if (typeof targetSentence === "string") {
      targetTokens = Lexer.tokenize(targetSentence);
    } else {
      targetTokens = targetSentence;
    }

    let predictions = this.engine.run(sourceTokens, targetTokens);
    predictions = this.engine.score(predictions);
    return Engine.suggest(predictions, maxSuggestions);
  }

  /**
   * Predicts word alignments between the sentences.
   * Returns an array of suggestions that match the benchmark.
   *
   * @param {string} sourceSentence
   * @param {string} targetSentence
   * @param {Suggestion} benchmark
   * @param {number} maxSuggestions
   * @return {Suggestion[]}
   */
  public predictWithBenchmark(sourceSentence: string, targetSentence: string, benchmark: Alignment[], maxSuggestions: number = 1): Suggestion[] {
    const sourceTokens = Lexer.tokenize(sourceSentence);
    const targetTokens = Lexer.tokenize(targetSentence);

    let predictions = this.engine.run(sourceTokens, targetTokens);
    predictions = this.engine.score(predictions);

    const validPredictions: Prediction[] = [];
    for (const p of predictions) {
      for (const a of benchmark) {
        if (a.key === p.alignment.key) {
          validPredictions.push(p);
        }
      }
    }
    return Engine.suggest(validPredictions, maxSuggestions);
  }
}
