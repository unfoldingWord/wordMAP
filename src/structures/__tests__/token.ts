import Token from "../Token";

describe("creates a token", () => {
  it("is empty", () => {
    const token = new Token();
    expect(token.toString()).toEqual("");
  });

  it("is fully", () => {
    const token = new Token("hello");
    expect(token.toString()).toEqual("hello");
  });
});
