import {Lexer, Ngram, Token} from "../";

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

  it("has no lemma when empty", () => {
    expect(new Ngram([new Token({})]).lemmaKey).toBeUndefined();
  });

  it("has no lemma", () => {
    const tokens = Lexer.tokenize("hello world");
    const ngram = new Ngram(tokens);

    expect(ngram.lemmaKey).toBeUndefined();
  });

  it("has lemma", () => {
    const ngram = new Ngram([
      new Token({text: "hello", lemma: "hi"}),
      new Token({text: "world", lemma: "earth"})
    ]);

    expect(ngram.lemmaKey).toEqual("n:hi:earth");
  });

  it("has partial lemma", () => {
    const ngram = new Ngram([
      new Token({text: "hello", lemma: "hi"}),
      new Token({text: "world"})
    ]);

    expect(ngram.lemmaKey).toBeUndefined();
  });
});

describe("equals", () => {
  it("identical", () => {
    const ngram1 = new Ngram(Lexer.tokenize("hello"));
    const ngram2 = new Ngram(Lexer.tokenize("hello"));
    expect(ngram1.equals(ngram2)).toEqual(true);
  });

  it("different", () => {
    const ngram1 = new Ngram(Lexer.tokenize("hello"));
    const ngram2 = new Ngram(Lexer.tokenize("hi"));
    expect(ngram1.equals(ngram2)).toEqual(false);
  });

  it("looks similar", () => {
    const ngram1 = new Ngram(Lexer.tokenize("world"));
    // TRICKY: the position is different
    const ngram2 = new Ngram([Lexer.tokenize("hello world")[0]]);
    expect(ngram1.equals(ngram2)).toEqual(false);
  });
});

describe("looksLike", () => {
  it("identical", () => {
    const ngram1 = new Ngram(Lexer.tokenize("hello"));
    const ngram2 = new Ngram(Lexer.tokenize("hello"));
    expect(ngram1.looksLike(ngram2)).toEqual(true);
  });

  it("different", () => {
    const ngram1 = new Ngram(Lexer.tokenize("hello"));
    const ngram2 = new Ngram(Lexer.tokenize("hi"));
    expect(ngram1.looksLike(ngram2)).toEqual(false);
  });

  it("looks similar", () => {
    const ngram1 = new Ngram(Lexer.tokenize("world"));
    // TRICKY: the position is different
    const ngram2 = new Ngram([Lexer.tokenize("hello world")[1]]);
    expect(ngram1.looksLike(ngram2)).toEqual(true);
  });
});
