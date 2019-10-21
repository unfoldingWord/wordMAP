import Lexer, {Token} from "wordmap-lexer";
import Algorithm from "../Algorithm";
import AlignmentMemoryIndex from "../index/AlignmentMemoryIndex";
import CorpusIndex from "../index/CorpusIndex";
import Alignment from "../structures/Alignment";
import Ngram from "../structures/Ngram";
import Prediction from "../structures/Prediction";
import Suggestion from "../structures/Suggestion";

/**
 * Generates a score for how closely the suggestion matches the answer key
 * @param {Suggestion} suggestion
 * @param {object} answerKey
 * @return {number}
 */
export function scoreSuggestion(suggestion: Suggestion, answerKey: object): number {
  return 0;
}

/**
 * converts some strings into corpus.
 * @param {string} source
 * @param {string} target
 * @return {Token[][][]}
 */
export function makeCorpus(source: string, target: string): Token[][][] {
  const sourceCorpusTokens = Lexer.tokenize(source);
  const targetCorpusTokens = Lexer.tokenize(target);
  return [
    [sourceCorpusTokens],
    [targetCorpusTokens]
  ];
}

/**
 * Generates some strings into corpus with support for lemma
 * @param source
 * @param target
 */
export function makeComplexCorpus(source: string, target: string): Token[][][] {
  const sourceCorpusTokens = tokenizeComplexMockSentence(source);
  const targetCorpusTokens = tokenizeComplexMockSentence(target);
  return [
    [sourceCorpusTokens],
    [targetCorpusTokens]
  ];
}

/**
 * converts some strings into an unaligned sentence pair
 * @param {string} source
 * @param {string} target
 * @return {Token[][]}
 */
export function makeUnalignedSentence(source: string, target: string): [Token[], Token[]] {
  return [
    tokenizeMockSentence(source),
    tokenizeMockSentence(target)
  ];
}

/**
 * Generates a sample alignment from a sentence
 * @param {String} sentence - a raw sentence from which to generate a mock alignment
 * @return {Array<Alignment>} a mock alignment
 */
export function alignMockSentence(sentence: string): Alignment[] {
  let alignments: Alignment[] = [];
  const tokens = tokenizeMockSentence(sentence);
  while (tokens.length) {
    const ngramLength = randNgramLength(tokens.length, 1);
    alignments = [
      ...alignments,
      alignMockTokens(tokens.slice(0, ngramLength))
    ];
    tokens.splice(0, ngramLength);
  }

  return alignments;
}

/**
 * Generates a sample alignment from a complex sentence.
 * Additional data like `lemma` can be appended to the words like `word:lemma`
 * @param sentence
 */
export function alignComplexMockSentence(sentence: string): Alignment[] {
  let alignments: Alignment[] = [];
  const tokens = tokenizeComplexMockSentence(sentence);
  while (tokens.length) {
    const ngramLength = randNgramLength(tokens.length, 1);
    alignments = [
      ...alignments,
      alignComplexMockTokens(tokens.slice(0, ngramLength))
    ];
    tokens.splice(0, ngramLength);
  }

  return alignments;
}

/**
 * Creates a mock alignment from two strings.
 * The strings will be tokenized and converted to n-grams in the alignment
 * @param {string} source
 * @param {string} target
 * @return {Alignment}
 */
export function makeMockAlignment(source: string, target: string): Alignment {
  const sourceTokens = Lexer.tokenize(source);
  const targetTokens = Lexer.tokenize(target);
  return new Alignment(new Ngram(sourceTokens), new Ngram(targetTokens));
}

/**
 * Creates a mock alignment from two complex strings.
 * Additional data like `lemma` can be appended to the word like `word:lemma`
 * @param source
 * @param target
 */
export function makeComplexMockAlignment(source: string, target: string): Alignment {
  const sourceTokens = tokenizeComplexMockSentence(source);
  const targetTokens = tokenizeComplexMockSentence(target);
  return new Alignment(new Ngram(sourceTokens), new Ngram(targetTokens));
}

/**
 * Creates a mock prediction from two strings
 * @param {string} source
 * @param {string} target
 * @param {number} confidence - the confidence of the prediction
 * @return {Prediction}
 */
export function makeMockPrediction(source: string, target: string, confidence: number): Prediction {
  const prediction = new Prediction(makeMockAlignment(source, target));
  prediction.setScore("confidence", confidence);
  return prediction;
}

/**
 * Generates a sample alignment
 * @param {Array<Token>} tokens - An array of tokens to align
 * @return {Alignment} a sample alignment
 */
function alignMockTokens(tokens: Token[]): Alignment {
  const source = new Ngram(tokens);
  const flippedTokens: Token[] = [];
  for (const token of tokens) {
    flippedTokens.push(
      new Token({
        text: token.toString().split("").reverse().join(""),
        position: token.position,
        characterPosition: token.charPosition,
        sentenceTokenLen: token.sentenceTokenLength,
        sentenceCharLen: token.sentenceCharacterLength
      })
    );
  }
  const target = new Ngram(flippedTokens);
  return new Alignment(source, target);
}

/**
 * Generates a sample alignment
 * @param {Array<Token>} tokens - An array of tokens to align
 * @return {Alignment} a sample alignment
 */
function alignComplexMockTokens(tokens: Token[]): Alignment {
  const source = new Ngram(tokens);
  const flippedTokens: Token[] = [];
  for (const token of tokens) {
    flippedTokens.push(
      new Token({
        text: token.toString().split("").reverse().join(""),
        position: token.position,
        characterPosition: token.charPosition,
        sentenceTokenLen: token.sentenceTokenLength,
        sentenceCharLen: token.sentenceCharacterLength
      })
    );
  }
  const target = new Ngram(flippedTokens);
  return new Alignment(source, target);
}

/**
 * Reverses the character order of words in a sentence
 * @param {string} sentence
 * @return {string}
 */
export function reverseSentenceWords(sentence: string): string {
  return sentence.split(" ").map((word: string) => {
    return word.split("").reverse().join("");
  }).join(" ");
}

/**
 * Flips a sentence.
 * @param sentence
 */
export function reverseSentence(sentence: string): string {
  return sentence.split(/\s+/).reverse().join(" ");
}

/**
 * Converts a sentence to an array of Tokens
 * @param {String} sentence - a raw sentence to convert into tokens
 * @return {Array<Token>} an array of tokens
 */
export function tokenizeMockSentence(sentence: string): Token[] {
  return Lexer.tokenize(sentence);
}

/**
 * Converts a sentence to an array of
 * @param sentence - a sentence with lemmas appended to words like `word:lemma`.
 */
export function tokenizeComplexMockSentence(sentence: string): Token[] {
  const words = sentence.split(/\s+/);
  const sentenceWords = [];
  const lemmaWords = [];
  for (const w of words) {
    const [text, lemma] = w.split(":");
    sentenceWords.push(text);
    if (lemma) {
      lemmaWords.push(lemma);
    } else {
      lemmaWords.push(text);
    }
  }

  const tokens = Lexer.tokenize(sentenceWords.join(" "));
  const tokenizedSentence = [];
  for (let i = 0, len = tokens.length; i < len; i++) {
    tokenizedSentence.push(new Token({
      ...tokens[i].toJSON(true),
      lemma: lemmaWords[i]
    }));
  }
  return tokenizedSentence;
}

/**
 * Generates the length of an n-gram.
 * n-grams are limited to lengths of 3.
 * @param {number} numTokens - the number of tokens available for use in the n-gram.
 * @param {number} [maxLength=3] - the maximum length of the n-gram
 * @return {number} an n-gram size
 */
function randNgramLength(numTokens: number, maxLength: number = 3): number {
  const ceiling = Math.min(numTokens, maxLength);
  return Math.floor(Math.random() * ceiling) + 1;
}

export class MockAlgorithm extends Algorithm {
  public name: string = "mock algorithm";

  execute(prediction: Prediction, cIndex: CorpusIndex, saIndex: AlignmentMemoryIndex, usIndex: CorpusIndex): Prediction {
    return prediction;
  }
}
