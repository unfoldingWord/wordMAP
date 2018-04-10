import AlignmentPosition from "./algorithms/AlignmentPosition";
import NgramFrequency from "./algorithms/NgramFrequency";
import Engine from "./Engine";
import Lexer from "./Lexer";
import Alignment from "./structures/Alignment";
import Prediction from "./structures/Prediction";
import Token from "./structures/Token";

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

  public appendCorpus(source: Token[][], target: Token[][]) {
    this.engine.addCorpus(source, target);
  }

  public appendSavedAlignments(alignments: Alignment[]) {
    this.engine.addSavedAlignments(alignments);
  }

  public predict(sourceSentence: string, targetSentence: string): Prediction[] {
    const sourceTokens = Lexer.tokenize(sourceSentence);
    const targetTokens = Lexer.tokenize(targetSentence);

    const predictions = this.engine.run(sourceTokens, targetTokens);
    return this.engine.score(predictions);
  }
}
