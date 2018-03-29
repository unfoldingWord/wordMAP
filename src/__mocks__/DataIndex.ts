export const mockAddAlignments = jest.fn();

export default jest.fn().mockImplementation(() => {
  return {
    addAlignments: mockAddAlignments,
  };
});
