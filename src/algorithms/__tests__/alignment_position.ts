import {Token} from "wordmap-lexer";
import Alignment from "../../structures/Alignment";
import Ngram from "../../structures/Ngram";
import Prediction from "../../structures/Prediction";
import AlignmentPosition from "../AlignmentPosition";

describe("AlignmentPosition", () => {
  it("has a perfect score", () => {
    const engine = new AlignmentPosition();
    const prediction: Prediction = new Prediction(new Alignment(
      new Ngram([
        new Token({
          text: "hello",
          position: 2,
          characterPosition: 5,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })]),
      new Ngram([
        new Token({
          text: "hallo",
          position: 2,
          characterPosition: 5,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })])
    ));
    const result = engine.execute(prediction);
    expect(result.getScores()).toEqual({
      "alignmentPosition": 1
    });
  });

  it("is offset by one space", () => {
    const engine = new AlignmentPosition();
    const prediction: Prediction = new Prediction(new Alignment(
      new Ngram([
        new Token({
          text: "hello",
          position: 2,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })]),
      new Ngram([
        new Token({
          text: "hallo",
          position: 3,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })])
    ));
    const result = engine.execute(prediction);
    expect(result.getScores()).toEqual({
      "alignmentPosition": 0
    });
  });

  it("is offset by two spaces", () => {
    const engine = new AlignmentPosition();
    const prediction: Prediction = new Prediction(new Alignment(
      new Ngram([
        new Token({
          text: "hello",
          position: 2,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })]),
      new Ngram([
        new Token({
          text: "hallo",
          position: 4,
          characterPosition: 1,
          sentenceTokenLen: 1,
          sentenceCharLen: 5
        })])
    ));
    const result = engine.execute(prediction);
    expect(result.getScores()).toEqual({
      "alignmentPosition": -1
    });
  });
});
