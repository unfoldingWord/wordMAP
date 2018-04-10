import {
  alignMockSentence,
  makeCorpus,
  makeMockAlignment,
  makeUnalignedSentence,
  reverseSentenceWords,
  tokenizeMockSentence
} from "../../__tests__/testUtils";
import Engine from "../../Engine";
import CorpusIndex from "../../index/CorpusIndex";
import NumberObject from "../../index/NumberObject";
import SavedAlignmentsIndex from "../../index/SavedAlignmentsIndex";
import Prediction from "../../structures/Prediction";
import NgramFrequency from "../NgramFrequency";

describe("calculate frequency", () => {
  it("produces no results", () => {
    const predictions: Prediction[] = [];
    const engine = new NgramFrequency();
    const result = engine.execute(
      predictions,
      new CorpusIndex(),
      new SavedAlignmentsIndex()
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
      new CorpusIndex(),
      new SavedAlignmentsIndex()
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

    const saIndex = new SavedAlignmentsIndex();
    saIndex.append([
      ...alignMockSentence("the the red fox trots at midnight"),
      makeMockAlignment("the", "fox")
    ]);

    const engine = new NgramFrequency();
    const result = engine.execute(
      predictions,
      new CorpusIndex(),
      saIndex
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

  it("should return correct scores based on the corpus", () => {
    const unalignedSentence = makeUnalignedSentence("hello", "olleh");
    const engine = new Engine();
    engine.registerAlgorithm(new NgramFrequency());

    // training data
    const initialCorpus = makeCorpus(
      "hello taco world",
      "dlalignment ocat olleh"
    );
    engine.addCorpus(initialCorpus[0], initialCorpus[1]);

    // first prediction
    const firstPredictions = engine.calculate(unalignedSentence);
    expect(firstPredictions[0].getScores()).toEqual({
      "alignmentFrequencyCorpus": 1,
      "alignmentFrequencySavedAlignments": 0,
      "ngramFrequencyCorpusSource": 7,
      "ngramFrequencyCorpusTarget": 6,
      "ngramFrequencySavedAlignmentsSource": 0,
      "ngramFrequencySavedAlignmentsTarget": 0,
      "frequencyRatioCorpusSource": 0.14285714285714285,
      "frequencyRatioCorpusTarget": 0.16666666666666666,
      "frequencyRatioSavedAlignmentsSource": 0,
      "frequencyRatioSavedAlignmentsTarget": 0,
      "alignmentFrequencyCorpusFiltered": 1,
      "alignmentFrequencySavedAlignmentsFiltered": 0,
      "frequencyRatioCorpusSourceFiltered": 1,
      "frequencyRatioSavedAlignmentsFiltered": 0
    });

    // append new corpus
    const secondCorpus = makeCorpus(
      "hello taco world and",
      "dlalignment ocat olleh dna"
    );
    engine.addCorpus(secondCorpus[0], secondCorpus[1]);

    // second prediction
    const secondPredictions = engine.calculate(unalignedSentence);
    expect(secondPredictions[0].getScores()).toEqual({
      "alignmentFrequencyCorpus": 2,
      "alignmentFrequencySavedAlignments": 0,
      "ngramFrequencyCorpusSource": 17,
      "ngramFrequencyCorpusTarget": 15,
      "ngramFrequencySavedAlignmentsSource": 0,
      "ngramFrequencySavedAlignmentsTarget": 0,
      "frequencyRatioCorpusSource": 0.11764705882352941,
      "frequencyRatioCorpusTarget": 0.13333333333333333,
      "frequencyRatioSavedAlignmentsSource": 0,
      "frequencyRatioSavedAlignmentsTarget": 0,
      "alignmentFrequencyCorpusFiltered": 2,
      "alignmentFrequencySavedAlignmentsFiltered": 0,
      "frequencyRatioCorpusSourceFiltered": 1,
      "frequencyRatioSavedAlignmentsFiltered": 0
    });
  });

  it(
    "should return correct scores based on the corpus and saved alignments",
    () => {
      const engine = new Engine();
      engine.registerAlgorithm(new NgramFrequency());

      // training data
      const sourceCorpusSentence = "hello taco world";
      const targetCorpusSentence = "dlalignment ocat olleh";
      const sourceCorpusTokens = tokenizeMockSentence(sourceCorpusSentence);
      const targetCorpusTokens = tokenizeMockSentence(targetCorpusSentence);
      engine.addCorpus([sourceCorpusTokens], [targetCorpusTokens]);
      engine.addSavedAlignments([makeMockAlignment("hello", "olleh")]);

      // un-aligned sentence pair
      const sourceSentence = "hello";
      const targetSentence = "olleh";
      const sourceTokens = tokenizeMockSentence(sourceSentence);
      const targetTokens = tokenizeMockSentence(targetSentence);
      const predictions = engine.calculate([sourceTokens, targetTokens]);

      expect(predictions[0].getScores()).toEqual({
        "alignmentFrequencyCorpus": 1,
        "alignmentFrequencySavedAlignments": 1,
        "ngramFrequencyCorpusSource": 7,
        "ngramFrequencyCorpusTarget": 6,
        "ngramFrequencySavedAlignmentsSource": 1,
        "ngramFrequencySavedAlignmentsTarget": 1,
        "frequencyRatioCorpusSource": 0.14285714285714285,
        "frequencyRatioCorpusTarget": 0.16666666666666666,
        "frequencyRatioSavedAlignmentsSource": 1,
        "frequencyRatioSavedAlignmentsTarget": 1,
        "alignmentFrequencyCorpusFiltered": 1,
        "alignmentFrequencySavedAlignmentsFiltered": 1,
        "frequencyRatioCorpusSourceFiltered": 1,
        "frequencyRatioSavedAlignmentsFiltered": 1
      });
    }
  );
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
