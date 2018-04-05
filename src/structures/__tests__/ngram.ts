import Ngram from "../Ngram";
import Token from "../Token";

describe("creates an n-gram", () => {

  it("has no tokens", () => {
    const ngram = new Ngram();
    expect(ngram.toString()).toEqual("");
    expect(ngram.tokenPosition).toEqual(0);
    expect(ngram.charPosition).toEqual(0);
  });

  it("has a single token", () => {
    const ngram = new Ngram([new Token("hello", 1, 2)]);
    expect(ngram.toString()).toEqual("hello");
    expect(ngram.tokenPosition).toEqual(1);
    expect(ngram.charPosition).toEqual(2);
  });

  it("has multiple tokens", () => {
    const ngram = new Ngram([new Token("hello"), new Token("world")]);
    expect(ngram.toString()).toEqual("hello:world");
  });

  it("has some empty tokens", () => {
    const ngram = new Ngram([
      new Token(),
      new Token("hello"),
      new Token(),
      new Token("world")]);
    expect(ngram.toString()).toEqual(":hello::world");
  });
});
