import Lexer from "../../Lexer";
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
    const ngram = new Ngram(Lexer.tokenize("hello"));
    expect(ngram.key).toEqual("n:hello");
    expect(ngram.tokenPosition).toEqual(0);
    expect(ngram.characterPosition).toEqual(0);
    expect(ngram.tokenLength).toEqual(1);
    expect(ngram.characterLength).toEqual(5);
  });

  it("has multiple tokens", () => {
    const ngram = new Ngram(Lexer.tokenize("hello world"));
    expect(ngram.key).toEqual("n:hello:world");
    expect(ngram.tokenLength).toEqual(2);
    expect(ngram.characterLength).toEqual(10);
    expect(ngram.tokenPosition).toEqual(0);
    expect(ngram.characterPosition).toEqual(0);
    expect(ngram.sentenceTokenLength).toEqual(2);
    expect(ngram.sentenceCharacterLength).toEqual(11);
  });

  it("has some empty tokens", () => {
    const tokens = Lexer.tokenize("hello world");
    const ngram = new Ngram([
      new Token({}),
      tokens[0],
      new Token({}),
      tokens[1]]);
    expect(ngram.key).toEqual("n::hello::world");
    expect(ngram.tokenLength).toEqual(4);
    expect(ngram.characterLength).toEqual(10);
  });
});
