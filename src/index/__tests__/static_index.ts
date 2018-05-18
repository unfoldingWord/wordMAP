import Lexer from "../../Lexer";
import Parser from "../../Parser";
import StaticIndex from "../StaticIndex";

describe("StaticIndex", () => {
  it("generates a lookup table of tokens", () => {
    const srcTokens = Lexer.tokenize("hello world");
    const srcNgrams = Parser.ngrams(srcTokens);
    const tgtTokens = Lexer.tokenize("olleh dlrow");
    const tgtNgrams = Parser.ngrams(tgtTokens);

    const index = new StaticIndex();
    index.addSentence(srcTokens, tgtTokens, srcNgrams, tgtNgrams);
    expect(index.getTargetTokenIntersection(srcTokens)).toEqual(tgtTokens);

    const srcTokens2 = Lexer.tokenize("hello");
    const srcNgrams2 = Parser.ngrams(srcTokens2);
    const tgtTokens2 = Lexer.tokenize("more things to see!");
    const tgtNgrams2 = Parser.ngrams(tgtTokens2);

    index.addSentence(srcTokens2, tgtTokens2, srcNgrams2, tgtNgrams2);
    expect(index.getTargetTokenIntersection([srcTokens[0]])).toEqual(Array.from(
      new Set([
        ...tgtTokens,
        ...tgtTokens2
      ])));

    expect(index.getTargetTokenIntersection([srcTokens[1]])).toEqual(tgtTokens);
  });
});
