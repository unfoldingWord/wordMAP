import Lexer from "wordmap-lexer";
import {Ngram} from "../../core/Ngram";
import {NgramIndex} from "../NgramIndex";

describe("NgramIndex", () => {
  const ngram = new Ngram(Lexer.tokenize("hello"));

  it("writes to the index", () => {
    const index = new NgramIndex();

    index.write(ngram, 7);
    const value = index.read(ngram);
    expect(value).toEqual(7);

    index.write(ngram, 3);
    const updatedValue = index.read(ngram);
    expect(updatedValue).toEqual(3);
  });

  it("increments the index", () => {
    const index = new NgramIndex();

    index.increment(ngram);
    const value = index.read(ngram);
    expect(value).toEqual(1);

    index.increment(ngram);
    const updatedValue = index.read(ngram);
    expect(updatedValue).toEqual(2);
  });

  it("reads the default value", () => {
    const index = new NgramIndex();

    const value = index.read(ngram);
    expect(value).toEqual(0);
  });

  it("reads a specific key", () => {
    const index = new NgramIndex();
    index.increment(ngram);

    const value = index.read(ngram.key);
    expect(value).toEqual(1);
  });
});
