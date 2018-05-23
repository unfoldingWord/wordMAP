import Suggestion from "../Suggestion";

describe("Suggestion", () => {
  it("renders toString with an empty object", () => {
    const s = new Suggestion();
    const result = s.toString();
    expect(result).toEqual("0 []");
  });
});
