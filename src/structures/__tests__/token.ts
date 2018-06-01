import Token from "../Token";

describe("creates a token", () => {
  it("is empty", () => {
    const token = new Token({});
    expect(token.toString()).toEqual("");
  });

  it("is fully", () => {
    const token = new Token({text: "hello"});
    expect(token.toString()).toEqual("hello");
  });

  it("passes through metadata", () => {
    const args = {text: "hello", extra: "value"};
    const token = new Token(args);
    expect(token.meta.extra).toEqual("value");

    // ensure we cannot modify the args
    args.extra = "hello";
    expect(token.meta.extra).toEqual("value");
  });
});
