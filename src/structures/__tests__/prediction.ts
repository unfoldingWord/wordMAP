import {makeMockAlignment} from "../../__tests__/testUtils";
import Prediction from "../Prediction";

describe("prediction", () => {

  it("has default values", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);
    expect(prediction.alignment).toEqual(alignment);
    expect(prediction.scoreKeys).toEqual([]);
    expect(prediction.toString()).toEqual(alignment.toString());
    expect(() => prediction.getScore("key")).toThrow(Error);
  });

  it("writes a single score", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);
    prediction.setScore("score", 4);
    expect(prediction.getScores()).toEqual({
      "score": 4
    });
    expect(prediction.scoreKeys).toEqual(["score"]);
  });

  it("cannot write over an existing score", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);
    prediction.setScore("score", 4);
    expect(() => prediction.setScore("score", 0)).toThrow(Error);
    expect(prediction.getScores()).toEqual({
      "score": 4
    });
  });

  it("writes multiple scores", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);
    prediction.setScores({
      "score": 4,
      "win": 2
    });
    expect(prediction.getScores()).toEqual({
      "score": 4,
      "win": 2
    });
    expect(prediction.scoreKeys).toEqual(["score", "win"]);
  });

  it("reads scores", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);
    prediction.setScores({
      "score": 4,
      "win": 2
    });
    expect(prediction.getScore("score")).toEqual(4);
    expect(() => prediction.getScore("missing")).toThrow(Error);
  });
});
