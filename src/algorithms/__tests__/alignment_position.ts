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
        new Ngram([new Token({
          text: "hello",
          tokenPosition: 2,
          characterPosition: 5,
          sentenceTokenLen: 1,
          sentenceCharLen: 5})]),
        new Ngram([new Token({
          text: "hallo",
          tokenPosition: 2,
          characterPosition: 5,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })])
      ))
    ];
    const result = engine.execute(predictions);
    expect(result[0].getScores()).toEqual({
      "alignmentPosition": 1
    });
  });

  it("is offset by one space", () => {
    const engine = new AlignmentPosition();
    const predictions: Prediction[] = [
      new Prediction(new Alignment(
        new Ngram([new Token({
          text: "hello",
          tokenPosition: 2,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })]),
        new Ngram([new Token({
          text: "hallo",
          tokenPosition: 3,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })])
      ))
    ];
    const result = engine.execute(predictions);
    expect(result[0].getScores()).toEqual({
      "alignmentPosition": 0
    });
  });

  it("is offset by two spaces", () => {
    const engine = new AlignmentPosition();
    const predictions: Prediction[] = [
      new Prediction(new Alignment(
        new Ngram([new Token({
          text: "hello",
          tokenPosition: 2,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })]),
        new Ngram([new Token({
          text: "hallo",
          tokenPosition: 4,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })])
      ))
    ];
    const result = engine.execute(predictions);
    expect(result[0].getScores()).toEqual({
      "alignmentPosition": -1
    });
  });
});
