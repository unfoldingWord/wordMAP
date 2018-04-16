import AlignmentPosition from "./algorithms/AlignmentPosition";
import NgramFrequency from "./algorithms/NgramFrequency";
import Engine from "./Engine";
import Lexer from "./Lexer";
import Alignment from "./structures/Alignment";
import Ngram from "./structures/Ngram";
import Suggestion from "./structures/Suggestion";
import Token from "./structures/Token";

/**
 * Word Alignment Prediction
 */
export default class MAP {
  private engine: Engine;

  constructor() {
    this.engine = new Engine();
    this.engine.registerAlgorithm(new NgramFrequency());
    this.engine.registerAlgorithm(new AlignmentPosition());
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

    for (const s of sourceSentences) {
      sourceTokens.push(Lexer.tokenize(s));
    }
    for (const s of targetSentences) {
      targetTokens.push(Lexer.tokenize(s));
    }

    this.engine.addCorpus(sourceTokens, targetTokens);
  }

  public appendSavedAlignments(alignments: Alignment[]) {
    this.engine.addSavedAlignments(alignments);
  }

  /**
   * Appends some saved alignments.
   *
   * @param {string} source - a string of source phrases separated by new lines
   * @param {string} target - a string of target phrases separated by new lines
   */
  public appendSavedAlignmentsString(source: string, target: string) {
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
    this.appendSavedAlignments(alignments);
  }

  /**
   * Predicts the word alignments between the sentences
   * @param {string} sourceSentence
   * @param {string} targetSentence
   * @param {number} maxSuggestions
   * @return {Suggestion[]}
   */
  public predict(sourceSentence: string, targetSentence: string, maxSuggestions: number = 1): Suggestion[] {
    const sourceTokens = Lexer.tokenize(sourceSentence);
    const targetTokens = Lexer.tokenize(targetSentence);

    let predictions = this.engine.run(sourceTokens, targetTokens);
    predictions = this.engine.score(predictions);
    return Engine.suggest(predictions, maxSuggestions);
  }
}
