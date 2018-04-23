jest.mock("../index/PermutationIndex");
import Engine from "../Engine";
import CorpusIndex from "../index/CorpusIndex";
// @ts-ignore
import {
  mockAddAlignments,
  mockAddSentencePair
} from "../index/PermutationIndex";
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
    expect(unigrams.toString()).toEqual("n:in,n:the,n:beginning,n:god,n:created");
  });
  it("reads bi-grams", () => {
    const bigrams = Engine.readSizedNgrams(sentence, 2);
    expect(bigrams.toString()).toEqual("n:in:the,n:the:beginning,n:beginning:god,n:god:created");
  });
  it("reads tri-grams", () => {
    const trigrams = Engine.readSizedNgrams(sentence, 3);
    expect(trigrams.toString()).toEqual("n:in:the:beginning,n:the:beginning:god,n:beginning:god:created");
  });
  it("generates all n-grams", () => {
    const ngrams = Engine.generateSentenceNgrams(sentence);
    expect(ngrams.toString()).toEqual("n:in,n:the,n:beginning,n:god,n:created,n:in:the,n:the:beginning,n:beginning:god,n:god:created,n:in:the:beginning,n:the:beginning:god,n:beginning:god:created");
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

    // stub out confidenc score
    for (const p of predictions) {
      p.setScore("confidence", 0);
    }

    expect(predictions.toString())
      .toEqual("0|n:in->n:ni,0|n:in->n:eht,0|n:in->n:ni:eht,0|n:in->n:,0|n:the->n:ni,0|n:the->n:eht,0|n:the->n:ni:eht,0|n:the->n:,0|n:in:the->n:ni,0|n:in:the->n:eht,0|n:in:the->n:ni:eht,0|n:in:the->n:");
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
      alignmentPosition: 1,
      sourceSavedAlignmentsFrequencyRatio: 3,
      sourceCorpusPermutationsFrequencyRatio: 5,
      targetCorpusPermutationsFrequencyRatio: 2,
      targetSavedAlignmentsFrequencyRatio: 1,
      phrasePlausibility: 2,
      ngramLength: 1,
      characterLength: 3,
      alignmentOccurrences: 2,
      uniqueness: 1
    });
    const result = Engine.calculateConfidence(
      [prediction],
      new SavedAlignmentsIndex()
    );
    expect(result[0].getScore("confidence")).toEqual(4.571428571428572);
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
      "n:hello->n:olleh");

    const s2 = suggestions[1];
    expect(s2.getPredictions().length).toEqual(2);
    expect(s2.getPredictions()[0].alignment.key).toEqual("n:world->n:dlrow");
    expect(s2.getPredictions()[1].alignment.key).toEqual("n:hello->n:olleh");

    const s3 = suggestions[2];
    expect(s3.getPredictions().length).toEqual(2);
    expect(s3.getPredictions()[0].alignment.key).toEqual(
      "n:hello:world->n:olleh:dlrow");
    expect(s3.getPredictions()[1].alignment.key).toEqual("n:world->n:dlrow");
  });
});
