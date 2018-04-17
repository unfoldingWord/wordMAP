import {
  alignMockSentence,
  makeCorpus,
  makeMockAlignment,
  makeUnalignedSentence,
  reverseSentenceWords,
  tokenizeMockSentence
} from "../../util/testUtils";
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
      predictions, // the->eht, the->null
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
      "sourceCorpusPermutationsFrequencyRatio": 0,
      "targetCorpusPermutationsFrequencyRatio": 0,
      "sourceSavedAlignmentsFrequencyRatio": 0.6666666666666666,
      "targetSavedAlignmentsFrequencyRatio": 1,
      "alignmentFrequencyCorpusFiltered": 0,
      "alignmentFrequencySavedAlignmentsFiltered": 2,
      "frequencyRatioCorpusFiltered": 0,
      "frequencyRatioSavedAlignmentsFiltered": 1,
      "ngramStaticFrequencyCorpusSource": 0,
      "ngramStaticFrequencyCorpusTarget": 0
    });

    // aligned to nothing
    expect(result[1].getScores()).toEqual({
      "alignmentFrequencyCorpus": 0,
      "alignmentFrequencySavedAlignments": 0,
      "ngramFrequencyCorpusSource": 0,
      "ngramFrequencyCorpusTarget": 0,
      "ngramFrequencySavedAlignmentsSource": 3,
      "ngramFrequencySavedAlignmentsTarget": 0,
      "sourceCorpusPermutationsFrequencyRatio": 0,
      "targetCorpusPermutationsFrequencyRatio": 0,
      "sourceSavedAlignmentsFrequencyRatio": 0,
      "targetSavedAlignmentsFrequencyRatio": 0,
      "alignmentFrequencyCorpusFiltered": 0,
      "alignmentFrequencySavedAlignmentsFiltered": 0,
      "frequencyRatioCorpusFiltered": 0,
      "frequencyRatioSavedAlignmentsFiltered": 0,
      "ngramStaticFrequencyCorpusSource": 0,
      "ngramStaticFrequencyCorpusTarget": 0
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
    const firstPredictions = engine.run(unalignedSentence[0], unalignedSentence[1]);
    expect(firstPredictions[0].getScores()).toEqual({
      "alignmentFrequencyCorpus": 1,
      "alignmentFrequencySavedAlignments": 0,
      "ngramFrequencyCorpusSource": 7,
      "ngramFrequencyCorpusTarget": 6,
      "ngramFrequencySavedAlignmentsSource": 0,
      "ngramFrequencySavedAlignmentsTarget": 0,
      "sourceCorpusPermutationsFrequencyRatio": 0.14285714285714285,
      "targetCorpusPermutationsFrequencyRatio": 0.16666666666666666,
      "sourceSavedAlignmentsFrequencyRatio": 0,
      "targetSavedAlignmentsFrequencyRatio": 0,
      "alignmentFrequencyCorpusFiltered": 1,
      "alignmentFrequencySavedAlignmentsFiltered": 0,
      "frequencyRatioCorpusFiltered": 1,
      "frequencyRatioSavedAlignmentsFiltered": 0,
      "ngramStaticFrequencyCorpusSource": 1,
      "ngramStaticFrequencyCorpusTarget": 1
    });

    // append new corpus
    const secondCorpus = makeCorpus(
      "hello taco world and",
      "dlalignment ocat olleh dna"
    );
    engine.addCorpus(secondCorpus[0], secondCorpus[1]);

    // second prediction
    const secondPredictions = engine.run(unalignedSentence[0], unalignedSentence[1]);
    expect(secondPredictions[0].getScores()).toEqual({
      "alignmentFrequencyCorpus": 2,
      "alignmentFrequencySavedAlignments": 0,

      // from permutations in the entire corpus
      "ngramFrequencyCorpusSource": 17,
      "ngramFrequencyCorpusTarget": 15,

      "ngramFrequencySavedAlignmentsSource": 0,
      "ngramFrequencySavedAlignmentsTarget": 0,
      "sourceCorpusPermutationsFrequencyRatio": 0.11764705882352941,
      "targetCorpusPermutationsFrequencyRatio": 0.13333333333333333,
      "sourceSavedAlignmentsFrequencyRatio": 0,
      "targetSavedAlignmentsFrequencyRatio": 0,

      // we want permutations in the filtered corpus.
      // A filtered corpus is the lines of corpus where the source n-gram and target n-gram both occur.
      "alignmentFrequencyCorpusFiltered": 2, // TODO: this is not right. we'll fix this later. This should be some number between 2 and 15 or 17. we might need a source and target for this.

      "alignmentFrequencySavedAlignmentsFiltered": 0,
      "frequencyRatioCorpusFiltered": 1, // TODO: this is not right. we'll fix this later
      "frequencyRatioSavedAlignmentsFiltered": 0,
      "ngramStaticFrequencyCorpusSource": 2,
      "ngramStaticFrequencyCorpusTarget": 2
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
      const predictions = engine.run(sourceTokens, targetTokens);

      expect(predictions[0].getScores()).toEqual({
        "alignmentFrequencyCorpus": 1,
        "alignmentFrequencySavedAlignments": 1,
        "ngramFrequencyCorpusSource": 7,
        "ngramFrequencyCorpusTarget": 6,
        "ngramFrequencySavedAlignmentsSource": 1,
        "ngramFrequencySavedAlignmentsTarget": 1,
        "sourceCorpusPermutationsFrequencyRatio": 0.14285714285714285,
        "targetCorpusPermutationsFrequencyRatio": 0.16666666666666666,
        "sourceSavedAlignmentsFrequencyRatio": 1,
        "targetSavedAlignmentsFrequencyRatio": 1,
        "alignmentFrequencyCorpusFiltered": 1,
        "alignmentFrequencySavedAlignmentsFiltered": 1,
        "frequencyRatioCorpusFiltered": 1,
        "frequencyRatioSavedAlignmentsFiltered": 1,
        "ngramStaticFrequencyCorpusSource": 1,
        "ngramStaticFrequencyCorpusTarget": 1
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
