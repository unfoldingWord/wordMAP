import {alignMockSentence} from "../../__tests__/testUtils";
import NotImplemented from "../../errors/NotImplemented";
import Ngram from "../../structures/Ngram";
import Token from "../../structures/Token";
import DataIndex from "../DataIndex";
import SafeStore from "../SafeStore";

describe("append saved alignments", () => {
  it("begins empty", () => {
    const index = new DataIndex();
    expect(index.primaryAlignmentFrequencyIndex.store).toEqual({});
    expect(index.secondaryAlignmentFrequencyIndex.store).toEqual({});
  });

  it("counts occurrences", () => {
    const index = new DataIndex();
    const firstSentence = alignMockSentence(
      "Once upon a time, in a galaxy far far away...");
    index.addAlignments(firstSentence);
    expect(index.primaryAlignmentFrequencyIndex.read("far", "raf")).toEqual(2);
    expect(index.primaryAlignmentFrequencyIndex.read("a", "a")).toEqual(2);
    expect(index.primaryAlignmentFrequencyIndex.read("in", "ni")).toEqual(1);

    const secondSentence = alignMockSentence("Once upon a time");
    index.addAlignments(secondSentence);
    expect(index.primaryAlignmentFrequencyIndex.read("far", "raf")).toEqual(2);
    expect(index.primaryAlignmentFrequencyIndex.read("a", "a")).toEqual(3);
    expect(index.primaryAlignmentFrequencyIndex.read("in", "ni")).toEqual(1);
  });
});

it("is not implemented", () => {
  const index = new DataIndex();
  expect(index.addSentencePair).toThrow(NotImplemented);
});

describe("get alignment frequency", () => {
  it("returns the frequency", () => {
    const expectedFrequency = 3;
    const index = new SafeStore({
      "hello": {
        "world": expectedFrequency
      }
    });
    const primary = new Ngram([new Token("hello")]);
    const secondary = new Ngram([new Token("world")]);
    const frequency = DataIndex.getAlignmentFrequency(
      index,
      primary,
      secondary
    );
    expect(frequency).toEqual(expectedFrequency);
  });

  it("returns the default value", () => {
    const index = new SafeStore({
      "hello": {
        "oops!": 3
      }
    });
    const primary = new Ngram([new Token("hello")]);
    const secondary = new Ngram([new Token("world")]);
    const frequency = DataIndex.getAlignmentFrequency(
      index,
      primary,
      secondary
    );
    expect(frequency).toEqual(0);
  });
});
