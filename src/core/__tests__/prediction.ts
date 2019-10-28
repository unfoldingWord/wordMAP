import {Prediction} from "../";
import {makeMockAlignment} from "../../util/testUtils";

describe("prediction", () => {

  it("has default values", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);
    expect(prediction.alignment).toEqual(alignment);
    expect(prediction.scoreKeys).toEqual([]);
    expect(prediction.key).toEqual(alignment.key);
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

  it("intersects", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);

    const altAlignment = makeMockAlignment("hello", "john");
    const altPrediction = new Prediction(altAlignment);

    expect(prediction.intersects(altPrediction)).toEqual(true);
  });

  it("does not intersect", () => {
    const alignment = makeMockAlignment("hello", "world");
    const prediction = new Prediction(alignment);

    const altAlignment = makeMockAlignment("john", "doe");
    const altPrediction = new Prediction(altAlignment);

    expect(prediction.intersects(altPrediction)).toEqual(false);
  });
});
