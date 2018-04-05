import Store from "../../index/Store";
import Prediction from "../../structures/Prediction";
import NgramFrequency from "../NgramFrequency";

describe("calculate frequency", () => {
  it("has no corpus or saved alignments", () => {
    const predictions: Prediction[] = [];
    const engine = new NgramFrequency();
    const result = engine.execute(
      predictions,
      new Store(),
      new Store(),
      [[], []]
    );
    const primary = result[0];
    expect(primary).toEqual({});
    // TODO: make assertions
  });
});
