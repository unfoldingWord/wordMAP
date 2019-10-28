jest.mock("../index/PermutationIndex");
import {Engine, Ngram, Parser, Prediction, Token} from "../";
import {AlignmentMemoryIndex, CorpusIndex} from "../../index/";
// @ts-ignore
import {
  mockAddAlignment,
  mockAddAlignments
} from "../../index/PermutationIndex";
import {
  alignMockSentence,
  makeMockAlignment,
  makeMockPrediction,
  MockAlgorithm,
  reverseSentenceWords,
  tokenizeMockSentence
} from "../../util/testUtils";

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
  engine.addAlignmentMemory(sentence);
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
    expect(mockAddAlignment).toBeCalled();
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
    const zerograms = Parser.sizedNgrams(sentence, 0);
    expect(zerograms).toEqual([
      {
        "cachedKey": "n:",
        "cachedLemmaKey": "n",
        "occurrence": 1,
        "occurrences": 1,
        "tokens": []
      },
      {
        "cachedKey": "n:",
        "cachedLemmaKey": "n",
        "occurrence": 2,
        "occurrences": 1,
        "tokens": []
      },
      {
        "cachedKey": "n:",
        "cachedLemmaKey": "n",
        "occurrence": 3,
        "occurrences": 1,
        "tokens": []
      },
      {
        "cachedKey": "n:",
        "cachedLemmaKey": "n",
        "occurrence": 4,
        "occurrences": 1,
        "tokens": []
      },
      {
        "cachedKey": "n:",
        "cachedLemmaKey": "n",
        "occurrence": 5,
        "occurrences": 1,
        "tokens": []
      }
    ]);
  });
  it("reads uni-grams", () => {
    const unigrams = Parser.sizedNgrams(sentence, 1);
    expect(unigrams.toString())
      .toEqual("n:in,n:the,n:beginning,n:god,n:created");
  });
  it("reads bi-grams", () => {
    const bigrams = Parser.sizedNgrams(sentence, 2);
    expect(bigrams.toString()).toEqual(
      "n:in:the,n:the:beginning,n:beginning:god,n:god:created");
  });
  it("reads tri-grams", () => {
    const trigrams = Parser.sizedNgrams(sentence, 3);
    expect(trigrams.toString()).toEqual(
      "n:in:the:beginning,n:the:beginning:god,n:beginning:god:created");
  });
  it("generates all n-grams", () => {
    const ngrams = Parser.ngrams(sentence);
    expect(ngrams.toString()).toEqual(
      "n:in,n:the,n:beginning,n:god,n:created,n:in:the,n:the:beginning,n:beginning:god,n:god:created,n:in:the:beginning,n:the:beginning:god,n:beginning:god:created");
  });

  it("throws out of range error", () => {
    const error = () => {
      return Parser.ngrams(sentence, -1);
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
      .toEqual(
        "0|n:in->n:ni,0|n:in->n:eht,0|n:in->n:ni:eht,0|n:in->n:,0|n:the->n:ni,0|n:the->n:eht,0|n:the->n:ni:eht,0|n:the->n:,0|n:in:the->n:ni,0|n:in:the->n:eht,0|n:in:the->n:ni:eht,0|n:in:the->n:");
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
  engine.performPrediction(
    source,
    target,
    new CorpusIndex(),
    new AlignmentMemoryIndex(),
    algorithms,
    []
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
      ngramLength: 2,
      sourceAlignmentMemoryFrequencyRatio: 3,
      sourceAlignmentMemoryLemmaFrequencyRatio: 3,
      sourceCorpusPermutationsFrequencyRatio: 5,
      sourceCorpusLemmaPermutationsFrequencyRatio: 5,
      targetCorpusPermutationsFrequencyRatio: 2,
      targetCorpusLemmaPermutationsFrequencyRatio: 2,
      targetAlignmentMemoryFrequencyRatio: 1,
      targetAlignmentMemoryLemmaFrequencyRatio: 1,
      phrasePlausibility: 2,
      sourceNgramLength: 1,
      characterLength: 3,
      alignmentOccurrences: 2,
      lemmaAlignmentOccurrences: 2,
      uniqueness: 1,
      lemmaUniqueness: 1
    });
    const result = Engine.calculateConfidence(
      [prediction],
      new AlignmentMemoryIndex()
    );
    expect(result[0].getScore("confidence")).toEqual(4.848484848484848);
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
