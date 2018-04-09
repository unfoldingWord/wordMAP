import {alignMockSentence} from "../../__tests__/testUtils";
import NotImplemented from "../../errors/NotImplemented";
import PermutationIndex from "../PermutationIndex";

describe("append saved alignments", () => {

  it("counts occurrences", () => {
    // TODO: just test that things were called
    // const index = new PermutationIndex();
    // const firstSentence = alignMockSentence(
    //   "Once upon a time, in a galaxy far far away...");
    // index.addAlignments(firstSentence);
    // expect(index.alignmentFrequencyIndex.read("n:far->n:raf")).toEqual(2);
    // expect(index.alignmentFrequencyIndex.read("n:a->n:a")).toEqual(2);
    // expect(index.alignmentFrequencyIndex.read("n:in", "n:ni")).toEqual(1);
    //
    // const secondSentence = alignMockSentence("Once upon a time");
    // index.addAlignments(secondSentence);
    // expect(index.alignmentFrequencyIndex.read("n:far", "n:raf")).toEqual(2);
    // expect(index.alignmentFrequencyIndex.read("n:a", "n:a")).toEqual(3);
    // expect(index.alignmentFrequencyIndex.read("n:in", "n:ni")).toEqual(1);
  });
});
