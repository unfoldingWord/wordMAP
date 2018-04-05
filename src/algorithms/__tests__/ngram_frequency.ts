import {
  alignMockSentence,
  makeMockAlignment,
  reverseSentenceWords,
  tokenizeMockSentence
} from "../../__tests__/testUtils";
import Engine from "../../Engine";
import EngineIndex from "../../index/EngineIndex";
import NumberObject from "../../structures/NumberObject";
import Prediction from "../../structures/Prediction";
import NgramFrequency from "../NgramFrequency";

describe("calculate frequency", () => {
  it("produces no results", () => {
    const predictions: Prediction[] = [];
    const engine = new NgramFrequency();
    const result = engine.execute(
      predictions,
      new EngineIndex(),
      new EngineIndex()
    );
    expect(result).toHaveLength(0);
  });

  it("produces un-scored results", () => {
    const alignments = alignMockSentence("In the beginning God created");
    const predictions: Prediction[] = [];
    for (const a of alignments) {
      predictions.push(new Prediction(a));
    }

    const engine = new NgramFrequency();
    const result = engine.execute(
      predictions,
      new EngineIndex(),
      new EngineIndex()
    );
    for (const r of result) {
      expectEmptyScores(r.getScores());
    }
  });

  it("produces results from saved alignments", () => {
    const source = "the";
    const target = reverseSentenceWords(source);
    const sourceTokens = tokenizeMockSentence(source);
    const targetTokens = tokenizeMockSentence(target);
    const sourceNgrams = Engine.generateSentenceNgrams(sourceTokens);
    const targetNgrams = Engine.generateSentenceNgrams(targetTokens);
    const predictions = Engine.generatePredictions(sourceNgrams, targetNgrams);

    const savedAlignmentStore = new EngineIndex();
    savedAlignmentStore.addAlignments([
      ...alignMockSentence("the the red fox trots at midnight"),
      makeMockAlignment("the", "fox")
    ]);

    const engine = new NgramFrequency();
    const result = engine.execute(
      predictions,
      new EngineIndex(),
      savedAlignmentStore
    );
    // aligned to something
    expect(result[0].getScores()).toEqual({
      "alignmentFrequencyCorpus": 0,
      "alignmentFrequencySavedAlignments": 2,
      "ngramFrequencyCorpusSource": 0,
      "ngramFrequencyCorpusTarget": 0,
      "ngramFrequencySavedAlignmentsSource": 3,
      "ngramFrequencySavedAlignmentsTarget": 2,
      "frequencyRatioCorpusSource": 0,
      "frequencyRatioCorpusTarget": 0,
      "frequencyRatioSavedAlignmentsSource": 0.6666666666666666,
      "frequencyRatioSavedAlignmentsTarget": 1,
      "alignmentFrequencyCorpusFiltered": 0,
      "alignmentFrequencySavedAlignmentsFiltered": 2,
      "frequencyRatioCorpusSourceFiltered": 0,
      "frequencyRatioSavedAlignmentsFiltered": 1
    });
    // aligned to nothing
    expect(result[1].getScores()).toEqual({
      "alignmentFrequencyCorpus": 0,
      "alignmentFrequencySavedAlignments": 0,
      "ngramFrequencyCorpusSource": 0,
      "ngramFrequencyCorpusTarget": 0,
      "ngramFrequencySavedAlignmentsSource": 3,
      "ngramFrequencySavedAlignmentsTarget": 0,
      "frequencyRatioCorpusSource": 0,
      "frequencyRatioCorpusTarget": 0,
      "frequencyRatioSavedAlignmentsSource": 0,
      "frequencyRatioSavedAlignmentsTarget": 0,
      "alignmentFrequencyCorpusFiltered": 0,
      "alignmentFrequencySavedAlignmentsFiltered": 0,
      "frequencyRatioCorpusSourceFiltered": 0,
      "frequencyRatioSavedAlignmentsFiltered": 0
    });
  });
});

/**
 * asserts the scores values are all 0
 * @param {NumberObject} scores
 */
function expectEmptyScores(scores: NumberObject) {
  for (const key in scores) {
    if (scores.hasOwnProperty(key)) {
      expect(scores[key]).toEqual(0);
    }
  }
}
