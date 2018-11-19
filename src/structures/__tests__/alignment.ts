import Lexer, {Token} from "wordmap-lexer";
import Alignment from "../Alignment";
import Ngram from "../Ngram";

describe("create alignment", () => {
  it("works", () => {
    const source = new Ngram(Lexer.tokenize("hello world"));
    const target = new Ngram(Lexer.tokenize("hi"));
    const alignment = new Alignment(source, target);

    expect(alignment.key).toEqual("n:hello:world->n:hi");
    expect(alignment.source.key).toEqual("n:hello:world");
    expect(alignment.target.key).toEqual("n:hi");

    expect(alignment.lemmaKey).toBeUndefined();
  });

  it("has lemma", () => {
    const source = new Ngram([
      new Token({text: "hello", lemma: "hi"}),
      new Token({text: "world", lemma: "earth"})
    ]);
    const target = new Ngram([
      new Token({text: "greetings", lemma: "greet"}),
      new Token({text: "you", lemma: "you"})
    ]);
    const alignment = new Alignment(source, target);

    expect(alignment.lemmaKey).toEqual("n:hi:earth->n:greet:you");
  });

  it("has partial lemma", () => {
    const source = new Ngram([
      new Token({text: "hello", lemma: "hi"}),
      new Token({text: "world", lemma: "earth"})
    ]);
    const target = new Ngram([
      new Token({text: "greetings"}),
      new Token({text: "you"})
    ]);
    const alignment = new Alignment(source, target);

    expect(alignment.lemmaKey).toBeUndefined();
  });
});
