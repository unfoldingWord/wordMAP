import {alignMockSentence} from "../../__tests__/testUtils";
import NotImplemented from "../../errors/NotImplemented";
import EngineIndex from "../EngineIndex";

describe("append saved alignments", () => {
  it("begins empty", () => {
    const index = new EngineIndex();
    expect(index.primaryAlignmentFrequencyIndex.index).toEqual({});
    expect(index.secondaryAlignmentFrequencyIndex.index).toEqual({});
  });

  it("counts occurrences", () => {
    const index = new EngineIndex();
    const firstSentence = alignMockSentence(
      "Once upon a time, in a galaxy far far away...");
    index.addAlignments(firstSentence);
    expect(index.primaryAlignmentFrequencyIndex.read("n:far", "n:raf")).toEqual(2);
    expect(index.primaryAlignmentFrequencyIndex.read("n:a", "n:a")).toEqual(2);
    expect(index.primaryAlignmentFrequencyIndex.read("n:in", "n:ni")).toEqual(1);

    const secondSentence = alignMockSentence("Once upon a time");
    index.addAlignments(secondSentence);
    expect(index.primaryAlignmentFrequencyIndex.read("n:far", "n:raf")).toEqual(2);
    expect(index.primaryAlignmentFrequencyIndex.read("n:a", "n:a")).toEqual(3);
    expect(index.primaryAlignmentFrequencyIndex.read("n:in", "n:ni")).toEqual(1);
  });
});
