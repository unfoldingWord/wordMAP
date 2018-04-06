import Alignment from "../Alignment";
import Ngram from "../Ngram";
import Token from "../Token";

describe("create alignment", () => {
  it("works", () => {
    const source = new Ngram([new Token("hello"), new Token("world")]);
    const target = new Ngram([new Token("hi")]);
    const alignment = new Alignment(source, target);

    expect(alignment.source.key).toEqual("hello:world");
    expect(alignment.target.key).toEqual("hi");
  });
});
