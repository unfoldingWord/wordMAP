import {tokenizeSentence} from "../../__tests__/testUtils";
import Ngram from "../../structures/Ngram";
import NgramFrequency from "../NgramFrequency";

describe("sentence n-grams", () => {
  const sentence = tokenizeSentence("In the beginning God created");
  it("reads sized n-grams", () => {
    const unigrams = NgramFrequency.readSizedNgrams(sentence, 1);
    expect(unigrams).toEqual([
      {"tokens": [{"text": "In"}]},
      {"tokens": [{"text": "the"}]},
      {"tokens": [{"text": "beginning"}]},
      {"tokens": [{"text": "God"}]}]);

    const bigrams = NgramFrequency.readSizedNgrams(sentence, 2);
    expect(bigrams).toEqual([
      {"tokens": [{"text": "In"}, {"text": "the"}]},
      {
        "tokens": [
          {"text": "the"},
          {"text": "beginning"}],
      },
      {
        "tokens": [
          {"text": "beginning"},
          {"text": "God"}],
      }]);

    const trigrams = NgramFrequency.readSizedNgrams(sentence, 3);
    expect(trigrams).toEqual([
      {
        "tokens": [
          {"text": "In"},
          {"text": "the"},
          {"text": "beginning"}],
      },
      {
        "tokens": [
          {"text": "the"},
          {"text": "beginning"},
          {"text": "God"}],
      }]);
  });
  it("generates all n-grams", () => {
    const ngrams = NgramFrequency.generateSentenceNgrams(sentence);
    expect(ngrams).toEqual([
      {"tokens": [{"text": "In"}]},
      {"tokens": [{"text": "the"}]},
      {"tokens": [{"text": "beginning"}]},
      {"tokens": [{"text": "God"}]},
      {"tokens": [{"text": "In"}, {"text": "the"}]},
      {
        "tokens": [
          {"text": "the"},
          {"text": "beginning"}],
      },
      {
        "tokens": [
          {"text": "beginning"},
          {"text": "God"}],
      }]);
  });
});

describe("alignment permutations", () => {
  it("generates permutations", () => {
    const primaryNgrams = [
      new Ngram(tokenizeSentence("In")),
      new Ngram(tokenizeSentence("the")),
      new Ngram(tokenizeSentence("In the")),
    ];
    const secondaryNgrams = [
      new Ngram(tokenizeSentence("nI")),
      new Ngram(tokenizeSentence("eht")),
      new Ngram(tokenizeSentence("nI eht")),
    ];
    const permutations = NgramFrequency.generateAlignmentPermutations(
      primaryNgrams,
      secondaryNgrams,
    );

    expect(permutations).toEqual([
      {
        "_sourceNgram": {"tokens": [{"text": "In"}]},
        "_targetNgram": {"tokens": [{"text": "nI"}]},
      },
      {
        "_sourceNgram": {"tokens": [{"text": "In"}]},
        "_targetNgram": {"tokens": [{"text": "eht"}]},
      },
      {
        "_sourceNgram": {"tokens": [{"text": "In"}]},
        "_targetNgram": {
          "tokens": [
            {"text": "nI"},
            {"text": "eht"}],
        },
      },
      {
        "_sourceNgram": {"tokens": [{"text": "In"}]},
        "_targetNgram": {"tokens": []},
      },
      {
        "_sourceNgram": {"tokens": [{"text": "the"}]},
        "_targetNgram": {"tokens": [{"text": "nI"}]},
      },
      {
        "_sourceNgram": {"tokens": [{"text": "the"}]},
        "_targetNgram": {"tokens": [{"text": "eht"}]},
      },
      {
        "_sourceNgram": {"tokens": [{"text": "the"}]},
        "_targetNgram": {
          "tokens": [
            {"text": "nI"},
            {"text": "eht"}],
        },
      },
      {
        "_sourceNgram": {"tokens": [{"text": "the"}]},
        "_targetNgram": {"tokens": []},
      },
      {
        "_sourceNgram": {
          "tokens": [
            {"text": "In"},
            {"text": "the"}],
        },
        "_targetNgram": {"tokens": [{"text": "nI"}]},
      },
      {
        "_sourceNgram": {
          "tokens": [
            {"text": "In"},
            {"text": "the"}],
        },
        "_targetNgram": {"tokens": [{"text": "eht"}]},
      },
      {
        "_sourceNgram": {
          "tokens": [
            {"text": "In"},
            {"text": "the"}],
        },
        "_targetNgram": {
          "tokens": [
            {"text": "nI"},
            {"text": "eht"}],
        },
      },
      {
        "_sourceNgram": {
          "tokens": [
            {"text": "In"},
            {"text": "the"}],
        },
        "_targetNgram": {"tokens": []},
      }]);
  });
});
