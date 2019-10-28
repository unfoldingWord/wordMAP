jest.mock("../core/Prediction");
jest.mock("../core/Suggestion");
import {Engine} from "../core/";
// @ts-ignore
import {genPrediction} from "../structures/Prediction";
// @ts-ignore
import {genSuggestion} from "../structures/Suggestion";

beforeAll(() => {
  jest.clearAllMocks();
});

it("sorts suggestions", () => {
  const suggestions = [
    genSuggestion(1),
    genSuggestion(3),
    genSuggestion(2)
  ];
  const sortedSuggestions = Engine.sortSuggestions(suggestions);
  expect(sortedSuggestions[0].compoundConfidence()).toEqual(3);
  expect(sortedSuggestions[1].compoundConfidence()).toEqual(2);
  expect(sortedSuggestions[2].compoundConfidence()).toEqual(1);
});

it("sorts predictions", () => {
  const predictions = [
    genPrediction(1),
    genPrediction(3),
    genPrediction(2)
  ];
  const sortedPredictions = Engine.sortPredictions(predictions);
  expect(sortedPredictions[0].getScore("confidence")).toEqual(3);
  expect(sortedPredictions[1].getScore("confidence")).toEqual(2);
  expect(sortedPredictions[2].getScore("confidence")).toEqual(1);
});
