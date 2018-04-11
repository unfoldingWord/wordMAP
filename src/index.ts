import AlignmentPosition from "./algorithms/AlignmentPosition";
import NgramFrequency from "./algorithms/NgramFrequency";
import Engine from "./Engine";
import Lexer from "./Lexer";
import Alignment from "./structures/Alignment";
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
   * Add corpus to the MAP.
   * These may be single sentences or multiple sentence delimited by new lines.
   * @param {string} source
   * @param {string} target
   */
  public appendCorpus(source: string, target: string) {
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

  public predict(sourceSentence: string, targetSentence: string): Suggestion[] {
    const sourceTokens = Lexer.tokenize(sourceSentence);
    const targetTokens = Lexer.tokenize(targetSentence);

    let predictions = this.engine.run(sourceTokens, targetTokens);
    predictions = this.engine.score(predictions);
    return Engine.suggest(predictions);
  }
}
