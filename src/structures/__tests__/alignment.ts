import Lexer from "wordmap-lexer";
import Alignment from "../Alignment";
import Ngram from "../Ngram";

describe("create alignment", () => {
  it("works", () => {
    const source = new Ngram(Lexer.tokenize("hello world"));
    const target = new Ngram(Lexer.tokenize("hi"));
    const alignment = new Alignment(source, target);

    expect(alignment.source.key).toEqual("n:hello:world");
    expect(alignment.target.key).toEqual("n:hi");
  });
});
