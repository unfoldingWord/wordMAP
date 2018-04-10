import AlignmentPosition from "./algorithms/AlignmentPosition";
import NgramFrequency from "./algorithms/NgramFrequency";
import Engine from "./Engine";
import Lexer from "./Lexer";
import Prediction from "./structures/Prediction";

/**
 * Word Alignment Prediction
 */
export class MAP {
  private engine: Engine;

  constructor() {
    this.engine = new Engine();
    this.engine.registerAlgorithm(new NgramFrequency());
    this.engine.registerAlgorithm(new AlignmentPosition());
  }

  public predict(sourceSentence: string, targetSentence: string): Prediction[] {
    const sourceTokens = Lexer.tokenize(sourceSentence);
    const targetTokens = Lexer.tokenize(targetSentence);

    return this.engine.predict(sourceTokens, targetTokens);
  }
}
