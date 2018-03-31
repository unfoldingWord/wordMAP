import {
  reverseSentenceWords,
  tokenizeMockSentence
} from "../../__tests__/testUtils";
import Store from "../../index/Store";
import Ngram from "../../structures/Ngram";
import NgramFrequency from "../NgramFrequency";

describe("process sentence n-grams", () => {
  const sentence = tokenizeMockSentence("In the beginning God created");
  it("reads sized n-grams", () => {
    const zerograms = NgramFrequency.readSizedNgrams(sentence, 0);
    expect(zerograms).toEqual([
      {"tokens": [], "positionInSentence": 0},
      {"tokens": [], "positionInSentence": 1},
      {"tokens": [], "positionInSentence": 2},
      {"tokens": [], "positionInSentence": 3},
      {"tokens": [], "positionInSentence": 4}]);

    const unigrams = NgramFrequency.readSizedNgrams(sentence, 1);
    expect(unigrams).toEqual([
      {"tokens": [{"text": "In"}], "positionInSentence": 0},
      {"tokens": [{"text": "the"}], "positionInSentence": 1},
      {"tokens": [{"text": "beginning"}], "positionInSentence": 2},
      {"tokens": [{"text": "God"}], "positionInSentence": 3}]);

    const bigrams = NgramFrequency.readSizedNgrams(sentence, 2);
    expect(bigrams).toEqual([
      {
        "tokens": [{"text": "In"}, {"text": "the"}],
        "positionInSentence": 0
      },
      {
        "tokens": [{"text": "the"}, {"text": "beginning"}],
        "positionInSentence": 1
      },
      {
        "tokens": [{"text": "beginning"}, {"text": "God"}],
        "positionInSentence": 2
      }]);

    const trigrams = NgramFrequency.readSizedNgrams(sentence, 3);
    expect(trigrams).toEqual([
      {
        "tokens": [
          {"text": "In"},
          {"text": "the"},
          {"text": "beginning"}], "positionInSentence": 0
      },
      {
        "tokens": [{"text": "the"}, {"text": "beginning"}, {"text": "God"}],
        "positionInSentence": 1
      }]);
  });
  it("generates all n-grams", () => {
    const ngrams = NgramFrequency.generateSentenceNgrams(sentence);
    expect(ngrams).toEqual([
      {
        "tokens": [{"text": "In"}],
        "positionInSentence": 0
      },
      {"tokens": [{"text": "the"}], "positionInSentence": 1},
      {"tokens": [{"text": "beginning"}], "positionInSentence": 2},
      {"tokens": [{"text": "God"}], "positionInSentence": 3},
      {"tokens": [{"text": "In"}, {"text": "the"}], "positionInSentence": 0},
      {
        "tokens": [{"text": "the"}, {"text": "beginning"}],
        "positionInSentence": 1
      },
      {
        "tokens": [{"text": "beginning"}, {"text": "God"}],
        "positionInSentence": 2
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
        "sourceNgram": {
          "tokens": [{"text": "In"}],
          "positionInSentence": 0
        }, "targetNgram": {"tokens": [{"text": "nI"}], "positionInSentence": 0}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}], "positionInSentence": 0},
        "targetNgram": {"tokens": [{"text": "eht"}], "positionInSentence": 0}
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}], "positionInSentence": 0},
        "targetNgram": {
          "tokens": [{"text": "nI"}, {"text": "eht"}],
          "positionInSentence": 0
        }
      },
      {
        "sourceNgram": {"tokens": [{"text": "In"}], "positionInSentence": 0},
        "targetNgram": {"tokens": [], "positionInSentence": 0}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}], "positionInSentence": 0},
        "targetNgram": {"tokens": [{"text": "nI"}], "positionInSentence": 0}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}], "positionInSentence": 0},
        "targetNgram": {"tokens": [{"text": "eht"}], "positionInSentence": 0}
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}], "positionInSentence": 0},
        "targetNgram": {
          "tokens": [{"text": "nI"}, {"text": "eht"}],
          "positionInSentence": 0
        }
      },
      {
        "sourceNgram": {"tokens": [{"text": "the"}], "positionInSentence": 0},
        "targetNgram": {"tokens": [], "positionInSentence": 0}
      },
      {
        "sourceNgram": {
          "tokens": [{"text": "In"}, {"text": "the"}],
          "positionInSentence": 0
        }, "targetNgram": {"tokens": [{"text": "nI"}], "positionInSentence": 0}
      },
      {
        "sourceNgram": {
          "tokens": [{"text": "In"}, {"text": "the"}],
          "positionInSentence": 0
        }, "targetNgram": {"tokens": [{"text": "eht"}], "positionInSentence": 0}
      },
      {
        "sourceNgram": {
          "tokens": [{"text": "In"}, {"text": "the"}],
          "positionInSentence": 0
        },
        "targetNgram": {
          "tokens": [{"text": "nI"}, {"text": "eht"}],
          "positionInSentence": 0
        }
      },
      {
        "sourceNgram": {
          "tokens": [{"text": "In"}, {"text": "the"}],
          "positionInSentence": 0
        }, "targetNgram": {"tokens": [], "positionInSentence": 0}
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
  const index = new Store();
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
