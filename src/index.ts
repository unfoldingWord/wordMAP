import NgramFrequency from "./algorithms/NgramFrequency";
import Engine from "./Engine";
import Token from "./structures/Token";

export class MAP {
  private engine: Engine;

  constructor() {
    this.engine = new Engine();
    this.engine.registerAlgorithm(new NgramFrequency());
  }

  public predict(unalignedSentencePair: [Token[], Token[]]): void {
    this.engine.run(unalignedSentencePair);
  }
}
