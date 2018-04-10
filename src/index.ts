import AlignmentPosition from "./algorithms/AlignmentPosition";
import NgramFrequency from "./algorithms/NgramFrequency";
import Engine from "./Engine";
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

  public predict(unalignedSentencePair: [Token[], Token[]]): Prediction[] {
    return this.engine.predict(unalignedSentencePair);
  }
}
