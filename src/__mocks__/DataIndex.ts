export const addAlignments = jest.fn();

export default jest.fn().mockImplementation(() => {
    return {
        addAlignments: addAlignments
    }
});
