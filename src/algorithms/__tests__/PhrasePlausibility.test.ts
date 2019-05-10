import {Token} from "wordmap-lexer";
import Ngram from "../../structures/Ngram";
import AlignmentOccurrences from "../AlignmentOccurrences";
import PhrasePlausibility from "../PhrasePlausibility";

describe("AlignmentOccurrences", () => {

  it("has no frequency", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram([token, token]);
    const sourceNgramFreq = 105;
    const targetNgramFreq = 0;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(0);
  });

  it("has similar frequency with large numbers", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram([token, token]);
    const sourceNgramFreq = 105;
    const targetNgramFreq = 104;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(0.9904761904761905);
  });

  it("has dis-similar frequency", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram([token, token]);
    const sourceNgramFreq = 105;
    const targetNgramFreq = 4;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(0.0380952380952381);
  });

  it("has similar frequency", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram([token, token]);
    const sourceNgramFreq = 15;
    const targetNgramFreq = 14;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(0.9333333333333333);
  });

  it("has same frequency", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram([token, token]);
    const sourceNgramFreq = 10;
    const targetNgramFreq = 10;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(1);
  });

  it("has a uni-gram", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram([token]);
    const sourceNgramFreq = 10;
    const targetNgramFreq = 5;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(0.5); // TODO: should the be higher?
  });

  it("has a null n-gram", () => {
    const token = new Token({text: "hi"});
    const source = new Ngram([token, token]);
    const target = new Ngram();
    const sourceNgramFreq = 5;
    const targetNgramFreq = 10;
    const sourceLength = 1000;
    const targetLength = 1000;
    const weight = PhrasePlausibility.calc(
      source,
      target,
      sourceNgramFreq,
      targetNgramFreq,
      sourceLength,
      targetLength
    );
    expect(weight).toEqual(1);
  });
});
