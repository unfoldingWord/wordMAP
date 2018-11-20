import Engine from "../../Engine";
import AlignmentMemoryIndex from "../../index/AlignmentMemoryIndex";
import CorpusIndex from "../../index/CorpusIndex";
import NumberObject from "../../index/NumberObject";
import Prediction from "../../structures/Prediction";
import {
  alignComplexMockSentence,
  makeComplexMockAlignment,
  makeCorpus,
  makeMockAlignment,
  makeUnalignedSentence,
  tokenizeComplexMockSentence,
  tokenizeMockSentence
} from "../../util/testUtils";
import LemmaNgramFrequency from "../LemmaNgramFrequency";

describe("calculate frequency", () => {
  it("produces no results", () => {
    const predictions: Prediction[] = [];
    const engine = new LemmaNgramFrequency();
    const result = engine.execute(
      predictions,
      new CorpusIndex(),
      new AlignmentMemoryIndex()
    );
    expect(result).toHaveLength(0);
  });

  it("produces un-scored results", () => {
    const alignments = alignComplexMockSentence("In the beginning God created");
    const predictions: Prediction[] = [];
    for (const a of alignments) {
      predictions.push(new Prediction(a));
    }

    const engine = new LemmaNgramFrequency();
    const result = engine.execute(
      predictions,
      new CorpusIndex(),
      new AlignmentMemoryIndex()
    );
    for (const r of result) {
      expectEmptyScores(r.getScores());
    }
  });

  it("produces results from alignment memory", () => {
    const source = "the:das";
    const target = "eht"; // reverseSentenceWords(source);
    const sourceTokens = tokenizeComplexMockSentence(source);
    const targetTokens = tokenizeComplexMockSentence(target);
    const sourceNgrams = Engine.generateSentenceNgrams(sourceTokens);
    const targetNgrams = Engine.generateSentenceNgrams(targetTokens);
    const predictions = Engine.generatePredictions(sourceNgrams, targetNgrams);

    const saIndex = new AlignmentMemoryIndex();
    saIndex.append([
      ...alignComplexMockSentence(
        "the:das the:das red:red fox:fox trots:trot at:at midnight:midnight"),
      makeComplexMockAlignment("the:das", "fox:fox")
    ]);

    const engine = new LemmaNgramFrequency();
    const result = engine.execute(
      predictions, // the->eht, the->null
      new CorpusIndex(),
      saIndex
    );
    // aligned to something
    expect(result[0].getScores()).toEqual({
      "lemmaFrequencyRatioCorpusFiltered": 0,
      "lemmaFrequencyRatioAlignmentMemoryFiltered": 1,
      "sourceCorpusLemmaPermutationsFrequencyRatio": 0,
      "sourceAlignmentMemoryLemmaFrequencyRatio": 0.6666666666666666,
      "targetCorpusLemmaPermutationsFrequencyRatio": 0,
      "targetAlignmentMemoryLemmaFrequencyRatio": 1
    });

    // aligned to nothing
    expect(result[1].getScores()).toEqual({
      "lemmaFrequencyRatioCorpusFiltered": 0,
      "lemmaFrequencyRatioAlignmentMemoryFiltered": 0,
      "sourceCorpusLemmaPermutationsFrequencyRatio": 0,
      "sourceAlignmentMemoryLemmaFrequencyRatio": 0,
      "targetCorpusLemmaPermutationsFrequencyRatio": 0,
      "targetAlignmentMemoryLemmaFrequencyRatio": 0
    });
  });

  it("should return correct scores based on the corpus", () => {
    const unalignedSentence = makeUnalignedSentence("hello", "olleh");
    const engine = new Engine();
    engine.registerAlgorithm(new LemmaNgramFrequency());

    // training data
    const initialCorpus = makeCorpus(
      "hello taco world",
      "dlalignment ocat olleh"
    );
    engine.addCorpus(initialCorpus[0], initialCorpus[1]);

    // first prediction
    const firstPredictions = engine.run(
      unalignedSentence[0],
      unalignedSentence[1]
    );
    expect(firstPredictions[0].getScores())
      .toEqual({
        "frequencyRatioCorpusFiltered": 1,
        "frequencyRatioAlignmentMemoryFiltered": 0,
        "sourceCorpusPermutationsFrequencyRatio": 0.14285714285714285,
        "sourceAlignmentMemoryFrequencyRatio": 0,
        "targetCorpusPermutationsFrequencyRatio": 0.16666666666666666,
        "targetAlignmentMemoryFrequencyRatio": 0
      });

    // append new corpus
    const secondCorpus = makeCorpus(
      "hello taco world and",
      "dlalignment ocat olleh dna"
    );
    engine.addCorpus(secondCorpus[0], secondCorpus[1]);

    // second prediction
    const secondPredictions = engine.run(
      unalignedSentence[0],
      unalignedSentence[1]
    );
    expect(secondPredictions[0].getScores())
      .toEqual({
          "frequencyRatioCorpusFiltered": 1, // TODO: this is not right. we'll fix this later
          "frequencyRatioAlignmentMemoryFiltered": 0,
          "sourceCorpusPermutationsFrequencyRatio": 0.11764705882352941,
          "sourceAlignmentMemoryFrequencyRatio": 0,
          "targetCorpusPermutationsFrequencyRatio": 0.13333333333333333,
          "targetAlignmentMemoryFrequencyRatio": 0
        }
      );
  });

  it(
    "should return correct scores based on the corpus and alignment memory",
    () => {
      const engine = new Engine();
      engine.registerAlgorithm(new LemmaNgramFrequency());

      // training data
      const sourceCorpusSentence = "hello taco world";
      const targetCorpusSentence = "dlalignment ocat olleh";
      const sourceCorpusTokens = tokenizeMockSentence(sourceCorpusSentence);
      const targetCorpusTokens = tokenizeMockSentence(targetCorpusSentence);
      engine.addCorpus([sourceCorpusTokens], [targetCorpusTokens]);
      engine.addAlignmentMemory([makeMockAlignment("hello", "olleh")]);

      // un-aligned sentence pair
      const sourceSentence = "hello";
      const targetSentence = "olleh";
      const sourceTokens = tokenizeMockSentence(sourceSentence);
      const targetTokens = tokenizeMockSentence(targetSentence);
      const predictions = engine.run(sourceTokens, targetTokens);

      expect(predictions[0].getScores())
        .toEqual({
          "frequencyRatioCorpusFiltered": 1,
          "frequencyRatioAlignmentMemoryFiltered": 1,
          "sourceCorpusPermutationsFrequencyRatio": 0.14285714285714285,
          "sourceAlignmentMemoryFrequencyRatio": 1,
          "targetCorpusPermutationsFrequencyRatio": 0.16666666666666666,
          "targetAlignmentMemoryFrequencyRatio": 1
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
