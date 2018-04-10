import AlignmentIndex from "../AlignmentIndex";

export const mockAddAlignments = jest.fn(() => {
  console.log("added alignment");
});
export const mockAddSentencePair = jest.fn(() => {
  console.log("added corpus");
});

export default jest.fn().mockImplementation(() => {
  return {
    addAlignments: mockAddAlignments,
    addSentencePair: mockAddSentencePair,
    alignmentFrequency: new AlignmentIndex()
  };
});
