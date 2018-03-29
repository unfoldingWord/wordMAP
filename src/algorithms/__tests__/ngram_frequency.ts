import {
  reverseSentenceWords,
  tokenizeMockSentence
} from "../../__tests__/testUtils";
import DataIndex from "../../index/DataIndex";
import Ngram from "../../structures/Ngram";
import NgramFrequency from "../NgramFrequency";

describe("process sentence n-grams", () => {
  const sentence = tokenizeMockSentence("In the beginning God created");
  it("reads sized n-grams", () => {
    const zerograms = NgramFrequency.readSizedNgrams(sentence, 0);
    expect(zerograms).toEqual([
      {"tokens": []},
      {"tokens": []},
      {"tokens": []},
      {"tokens": []},
      {"tokens": []}
    ]);

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
          {"text": "beginning"}]
      },
      {
        "tokens": [
          {"text": "beginning"},
          {"text": "God"}]
      }]);

    const trigrams = NgramFrequency.readSizedNgrams(sentence, 3);
    expect(trigrams).toEqual([
      {
        "tokens": [
          {"text": "In"},
          {"text": "the"},
          {"text": "beginning"}]
      },
      {
        "tokens": [
          {"text": "the"},
          {"text": "beginning"},
          {"text": "God"}]
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
          {"text": "beginning"}]
      },
      {
        "tokens": [
          {"text": "beginning"},
          {"text": "God"}]
      }]);
  });

  it("throws out of range error", () => {
    const error = () => {
      return NgramFrequency.generateSentenceNgrams(sentence, -1);
    };
    expect(error).toThrow(RangeError);
  });
});

describe("alignment permutations", () => {
  it("generates permutations", () => {
    const primaryNgrams = [
      new Ngram(tokenizeMockSentence("In")),
      new Ngram(tokenizeMockSentence("the")),
      new Ngram(tokenizeMockSentence("In the"))
    ];
    const secondaryNgrams = [
      new Ngram(tokenizeMockSentence("nI")),
      new Ngram(tokenizeMockSentence("eht")),
      new Ngram(tokenizeMockSentence("nI eht"))
    ];
    const permutations = NgramFrequency.generateAlignmentPermutations(
      primaryNgrams,
      secondaryNgrams
    );

    expect(permutations).toEqual([
      {
        "sourceNgram": {"tokens": [{"text": "In"}]},
        "targetNgram": {"tokens": [{"text": "nI"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}]},
        "targetNgram": {"tokens": [{"text": "eht"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}]},
        "targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}]},
        "targetNgram": {"tokens": []}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}]},
        "targetNgram": {"tokens": [{"text": "nI"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}]},
        "targetNgram": {"tokens": [{"text": "eht"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}]},
        "targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}]},
        "targetNgram": {"tokens": []}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]},
        "targetNgram": {"tokens": [{"text": "nI"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]},
        "targetNgram": {"tokens": [{"text": "eht"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]},
        "targetNgram": {"tokens": [{"text": "nI"}, {"text": "eht"}]}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}, {"text": "the"}]},
        "targetNgram": {"tokens": []}
      }]);
  });
});

describe("calculate frequency", () => {
  // n-grams for the un-aligned sentence pair
  const str = "Once upon a time";
  const primarySentence = tokenizeMockSentence(str);
  const secondarySentence = tokenizeMockSentence(reverseSentenceWords(str));
  const primaryNgrams = NgramFrequency.generateSentenceNgrams(primarySentence);
  const secondaryNgrams = NgramFrequency.generateSentenceNgrams(
    secondarySentence);
  const index = new DataIndex();
  const frequencies = NgramFrequency.calculateFrequency(
    primaryNgrams,
    secondaryNgrams,
    index
  );
  // TODO: make assertions
});

it("executes", () => {
  // TODO: perform assertions on execute
});
