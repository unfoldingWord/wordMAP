jest.mock("../index/PermutationIndex");
import Engine from "../Engine";
import CorpusIndex from "../index/CorpusIndex";
// @ts-ignore
import {mockAddAlignments, mockAddSentencePair} from "../index/PermutationIndex";
import SavedAlignmentsIndex from "../index/SavedAlignmentsIndex";
import Ngram from "../structures/Ngram";
import Prediction from "../structures/Prediction";
import Token from "../structures/Token";
import {
  alignMockSentence,
  makeMockAlignment,
  makeMockPrediction,
  MockAlgorithm,
  reverseSentenceWords,
  tokenizeMockSentence
} from "../util/testUtils";

beforeAll(() => {
  jest.clearAllMocks();
});

it("registers an algorithm", () => {
  const engine = new Engine();
  const algorithm = new MockAlgorithm();
  engine.registerAlgorithm(algorithm);
  expect(engine.algorithms).toEqual([algorithm]);
});

it("adds the alignment to the index", () => {
  const sentence = alignMockSentence("Once upon a time");
  const engine = new Engine();
  engine.addSavedAlignments(sentence);
  expect(mockAddAlignments).toBeCalledWith(sentence);
});

describe("add corpus", () => {
  it("adds the corpus to the index", () => {
    const sentences = [
      "Once upon a time",
      "in a galaxy far far away"
    ];
    const source = [];
    const target = [];
    for (const s of sentences) {
      source.push(tokenizeMockSentence(s));
      target.push(tokenizeMockSentence(reverseSentenceWords(s)));
    }
    const engine = new Engine();
    engine.addCorpus(source, target);
    expect(mockAddAlignments).toBeCalled();
  });

  it("rejects mismatched source and target lengths", () => {
    const sentences = [
      "Once upon a time",
      "in a galaxy far far away"
    ];
    const source: Token[][] = [];
    const target: Token[][] = [];
    for (const s of sentences) {
      source.push(tokenizeMockSentence(s));
      target.push(tokenizeMockSentence(reverseSentenceWords(s)));
    }
    source.push(tokenizeMockSentence("too long!"));
    const engine = new Engine();
    expect(() => engine.addCorpus(source, target)).toThrow(Error);
  });
});

describe("process sentence n-grams", () => {
  const sentence = tokenizeMockSentence("In the beginning God created");
  it("reads 0 sized n-grams", () => {
    const zerograms = Engine.readSizedNgrams(sentence, 0);
    expect(zerograms).toEqual([
      {"tokens": []},
      {"tokens": []},
      {"tokens": []},
      {"tokens": []},
      {"tokens": []}]);
  });
  it("reads uni-grams", () => {
    const unigrams = Engine.readSizedNgrams(sentence, 1);
    expect(unigrams).toEqual([
      {
        "tokens": [
          {
            "charPos": 0,
            "pos": 0,
            "text": "In"
          }]
      },
      {"tokens": [{"charPos": 2, "pos": 1, "text": "the"}]},
      {"tokens": [{"charPos": 5, "pos": 2, "text": "beginning"}]},
      {"tokens": [{"charPos": 14, "pos": 3, "text": "God"}]},
      {"tokens": [{"charPos": 17, "pos": 4, "text": "created"}]}]);
  });
  it("reads bi-grams", () => {
    const bigrams = Engine.readSizedNgrams(sentence, 2);
    expect(bigrams).toEqual([
      {
        "tokens": [
          {"charPos": 0, "pos": 0, "text": "In"},
          {"charPos": 2, "pos": 1, "text": "the"}]
      },
      {
        "tokens": [
          {"charPos": 2, "pos": 1, "text": "the"},
          {"charPos": 5, "pos": 2, "text": "beginning"}]
      },
      {
        "tokens": [
          {"charPos": 5, "pos": 2, "text": "beginning"},
          {"charPos": 14, "pos": 3, "text": "God"}]
      },
      {
        "tokens": [
          {"charPos": 14, "pos": 3, "text": "God"},
          {"charPos": 17, "pos": 4, "text": "created"}]
      }]);
  });
  it("reads tri-grams", () => {
    const trigrams = Engine.readSizedNgrams(sentence, 3);
    expect(trigrams).toEqual([
      {
        "tokens": [
          {
            "charPos": 0,
            "pos": 0,
            "text": "In"
          },
          {"charPos": 2, "pos": 1, "text": "the"},
          {"charPos": 5, "pos": 2, "text": "beginning"}]
      },
      {
        "tokens": [
          {"charPos": 2, "pos": 1, "text": "the"},
          {"charPos": 5, "pos": 2, "text": "beginning"},
          {"charPos": 14, "pos": 3, "text": "God"}]
      },
      {
        "tokens": [
          {"charPos": 5, "pos": 2, "text": "beginning"},
          {"charPos": 14, "pos": 3, "text": "God"},
          {"charPos": 17, "pos": 4, "text": "created"}]
      }]);
  });
  it("generates all n-grams", () => {
    const ngrams = Engine.generateSentenceNgrams(sentence);
    expect(ngrams).toEqual([
      {
        "tokens": [
          {
            "charPos": 0,
            "pos": 0,
            "text": "In"
          }]
      },
      {"tokens": [{"charPos": 2, "pos": 1, "text": "the"}]},
      {"tokens": [{"charPos": 5, "pos": 2, "text": "beginning"}]},
      {"tokens": [{"charPos": 14, "pos": 3, "text": "God"}]},
      {"tokens": [{"charPos": 17, "pos": 4, "text": "created"}]},
      {
        "tokens": [
          {"charPos": 0, "pos": 0, "text": "In"},
          {"charPos": 2, "pos": 1, "text": "the"}]
      },
      {
        "tokens": [
          {"charPos": 2, "pos": 1, "text": "the"},
          {"charPos": 5, "pos": 2, "text": "beginning"}]
      },
      {
        "tokens": [
          {"charPos": 5, "pos": 2, "text": "beginning"},
          {"charPos": 14, "pos": 3, "text": "God"}]
      },
      {
        "tokens": [
          {"charPos": 14, "pos": 3, "text": "God"},
          {"charPos": 17, "pos": 4, "text": "created"}]
      },
      {
        "tokens": [
          {"charPos": 0, "pos": 0, "text": "In"},
          {"charPos": 2, "pos": 1, "text": "the"},
          {"charPos": 5, "pos": 2, "text": "beginning"}]
      },
      {
        "tokens": [
          {"charPos": 2, "pos": 1, "text": "the"},
          {"charPos": 5, "pos": 2, "text": "beginning"},
          {"charPos": 14, "pos": 3, "text": "God"}]
      },
      {
        "tokens": [
          {"charPos": 5, "pos": 2, "text": "beginning"},
          {"charPos": 14, "pos": 3, "text": "God"},
          {"charPos": 17, "pos": 4, "text": "created"}]
      }]);
  });

  it("throws out of range error", () => {
    const error = () => {
      return Engine.generateSentenceNgrams(sentence, -1);
    };
    expect(error).toThrow(RangeError);
  });
});

describe("alignment permutations", () => {
  it("generates predictions", () => {
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
    const predictions = Engine.generatePredictions(
      primaryNgrams,
      secondaryNgrams
    );

    expect(predictions)
      .toEqual([
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }]
            },
            "targetNgram": {"tokens": [{"charPos": 0, "pos": 0, "text": "nI"}]}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }]
            },
            "targetNgram": {"tokens": [{"charPos": 0, "pos": 0, "text": "eht"}]}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }]
            },
            "targetNgram": {
              "tokens": [
                {"charPos": 0, "pos": 0, "text": "nI"},
                {"charPos": 2, "pos": 1, "text": "eht"}]
            }
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }]
            }, "targetNgram": {"tokens": []}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "the"
                }]
            },
            "targetNgram": {"tokens": [{"charPos": 0, "pos": 0, "text": "nI"}]}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "the"
                }]
            },
            "targetNgram": {"tokens": [{"charPos": 0, "pos": 0, "text": "eht"}]}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "the"
                }]
            },
            "targetNgram": {
              "tokens": [
                {"charPos": 0, "pos": 0, "text": "nI"},
                {"charPos": 2, "pos": 1, "text": "eht"}]
            }
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "the"
                }]
            }, "targetNgram": {"tokens": []}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }, {"charPos": 2, "pos": 1, "text": "the"}]
            },
            "targetNgram": {"tokens": [{"charPos": 0, "pos": 0, "text": "nI"}]}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }, {"charPos": 2, "pos": 1, "text": "the"}]
            },
            "targetNgram": {"tokens": [{"charPos": 0, "pos": 0, "text": "eht"}]}
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }, {"charPos": 2, "pos": 1, "text": "the"}]
            },
            "targetNgram": {
              "tokens": [
                {"charPos": 0, "pos": 0, "text": "nI"},
                {"charPos": 2, "pos": 1, "text": "eht"}]
            }
          }, "scores": {}
        },
        {
          "predictedAlignment": {
            "sourceNgram": {
              "tokens": [
                {
                  "charPos": 0,
                  "pos": 0,
                  "text": "In"
                }, {"charPos": 2, "pos": 1, "text": "the"}]
            }, "targetNgram": {"tokens": []}
          }, "scores": {}
        }]);
  });
});

it("runs all the algorithms", () => {
  const algorithms = [
    new MockAlgorithm(),
    new MockAlgorithm()
  ];
  const spies = [];
  const engine = new Engine();
  for (const a of algorithms) {
    spies.push(jest.spyOn(a, "execute"));
    engine.registerAlgorithm(a);
  }
  const source = tokenizeMockSentence("Hello World");
  const target = tokenizeMockSentence("olleH dlroW");
  Engine.performPrediction(
    source,
    target,
    new CorpusIndex(),
    new SavedAlignmentsIndex(),
    algorithms
  );

  for (const s of spies) {
    expect(s).toHaveBeenCalled();
    s.mockReset();
    s.mockRestore();
  }
});

describe("scoring", () => {
  it("calculates weighted scores", () => {
    const prediction = new Prediction(makeMockAlignment("hello", "world"));
    prediction.setScores({
      score1: 3,
      score2: 5,
      score3: 6
    });
    const unweightedResult = Engine.calculateWeightedConfidence(
      prediction,
      ["score1", "score3"],
      {}
    );
    expect(unweightedResult).toEqual(4.5);

    const weightedResult = Engine.calculateWeightedConfidence(
      prediction,
      ["score1", "score3"],
      {
        score1: 0.5,
        score2: 100
      }
    );
    expect(weightedResult).toEqual(5);
  });

  it("calculates prediction confidence", () => {
    jest.unmock("../index/PermutationIndex");
    jest.resetModules();
    const prediction = new Prediction(makeMockAlignment("hello", "world"));
    prediction.setScores({
      frequencyRatioSavedAlignmentsSource: 3,
      frequencyRatioCorpusSource: 5,
      frequencyRatioCorpusTarget: 2,
      frequencyRatioSavedAlignmentsTarget: 1
    });
    const result = Engine.calculateConfidence(
      [prediction],
      new SavedAlignmentsIndex()
    );
    expect(result[0].getScore("confidence")).toEqual(2);
  });
});

describe("suggest", () => {
  it("suggests a single prediction", () => {
    const predictions = [
      makeMockPrediction("hello", "olleh", 1),
      makeMockPrediction("world", "dlrow", 0.9),
      makeMockPrediction("hello world", "olleh dlrow", .8),
      makeMockPrediction("world", "huh", 0.4),
      makeMockPrediction("hello world", "huh olleh", .3),
      makeMockPrediction("hello", "huh", 0.2),
      makeMockPrediction("hello", "hmm", 0.1)
    ];
    const suggestions = Engine.suggest(predictions);
    expect(suggestions.length).toEqual(1);
    const s = suggestions[0];
    expect(s.getPredictions().length).toEqual(2);
    const suggestedPredictions = s.getPredictions();
    expect(suggestedPredictions[0].alignment.key).toEqual("n:hello->n:olleh");
    expect(suggestedPredictions[1].alignment.key).toEqual("n:world->n:dlrow");
  });

  it("suggests multiple predictions", () => {
    const predictions = [
      makeMockPrediction("hello", "olleh", 1),
      makeMockPrediction("world", "dlrow", 0.9),
      makeMockPrediction("hello world", "olleh dlrow", .8),
      makeMockPrediction("world", "huh", 0.4),
      makeMockPrediction("hello world", "huh olleh", .3),
      makeMockPrediction("hello", "huh", 0.2),
      makeMockPrediction("hello", "hmm", 0.1)
    ];
    const suggestions = Engine.suggest(predictions, 3);
    expect(suggestions.length).toEqual(3);

    const s1 = suggestions[0];
    expect(s1.getPredictions().length).toEqual(2);
    expect(s1.getPredictions()[0].alignment.key).toEqual(
      "n:hello:world->n:olleh:dlrow");

    const s2 = suggestions[1];
    expect(s2.getPredictions().length).toEqual(2);
    expect(s2.getPredictions()[0].alignment.key).toEqual("n:hello->n:olleh");
    expect(s2.getPredictions()[1].alignment.key).toEqual("n:world->n:dlrow");

    const s3 = suggestions[2];
    expect(s3.getPredictions().length).toEqual(2);
    expect(s3.getPredictions()[0].alignment.key).toEqual("n:world->n:dlrow");
    expect(s3.getPredictions()[1].alignment.key).toEqual("n:hello->n:olleh");
  });
});
