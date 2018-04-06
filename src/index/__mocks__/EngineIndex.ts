import Index from "../Index";

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
    primaryAlignmentFrequencyIndex: new Index(),
    secondaryAlignmentFrequencyIndex: new Index()
  };
});
