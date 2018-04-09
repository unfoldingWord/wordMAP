import PermutationIndex from "../../index/PermutationIndex";
import Alignment from "../../structures/Alignment";
import Ngram from "../../structures/Ngram";
import Prediction from "../../structures/Prediction";
import Token from "../../structures/Token";
import AlignmentPosition from "../AlignmentPosition";

describe("AlignmentPosition", () => {
  it("has a perfect score", () => {
    const engine = new AlignmentPosition();
    const predictions: Prediction[] = [
      new Prediction(new Alignment(
        new Ngram([new Token("hello", 2, 5)]),
        new Ngram([new Token("hallo", 2, 5)])
      ))
    ];
    const result = engine.execute(
      predictions,
      new PermutationIndex(),
      new PermutationIndex()
    );
    expect(result[0].getScores()).toEqual({
      "alignmentPosition": 1
    });
  });

  it("is offset by one space", () => {
    const engine = new AlignmentPosition();
    const predictions: Prediction[] = [
      new Prediction(new Alignment(
        new Ngram([new Token("hello", 2)]),
        new Ngram([new Token("hallo", 3)])
      ))
    ];
    const result = engine.execute(
      predictions,
      new PermutationIndex(),
      new PermutationIndex()
    );
    expect(result[0].getScores()).toEqual({
      "alignmentPosition": 0
    });
  });

  it("is offset by two spaces", () => {
    const engine = new AlignmentPosition();
    const predictions: Prediction[] = [
      new Prediction(new Alignment(
        new Ngram([new Token("hello", 2)]),
        new Ngram([new Token("hallo", 4)])
      ))
    ];
    const result = engine.execute(
      predictions,
      new PermutationIndex(),
      new PermutationIndex()
    );
    expect(result[0].getScores()).toEqual({
      "alignmentPosition": -1
    });
  });
});
