import Ngram from "../Ngram";
import Token from "../Token";

describe("creates an n-gram", () => {

  it("has no tokens", () => {
    const ngram = new Ngram();
    expect(ngram.key).toEqual("n:");
    expect(ngram.tokenPosition).toEqual(0);
    expect(ngram.characterPosition).toEqual(0);
    expect(ngram.tokenLength).toEqual(0);
    expect(ngram.characterLength).toEqual(0);
  });

  it("has a single token", () => {
    const ngram = new Ngram([new Token("hello", 1, 2)]);
    expect(ngram.key).toEqual("n:hello");
    expect(ngram.tokenPosition).toEqual(1);
    expect(ngram.characterPosition).toEqual(2);
    expect(ngram.tokenLength).toEqual(1);
    expect(ngram.characterLength).toEqual(5);
  });

  it("has multiple tokens", () => {
    const ngram = new Ngram([new Token("hello"), new Token("world")]);
    expect(ngram.key).toEqual("n:hello:world");
    expect(ngram.tokenLength).toEqual(2);
    expect(ngram.characterLength).toEqual(10);
  });

  it("has some empty tokens", () => {
    const ngram = new Ngram([
      new Token(),
      new Token("hello"),
      new Token(),
      new Token("world")]);
    expect(ngram.key).toEqual("n::hello::world");
    expect(ngram.tokenLength).toEqual(4);
    expect(ngram.characterLength).toEqual(10);
  });
});
