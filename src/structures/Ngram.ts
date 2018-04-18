import Token from "./Token";

/**
 * Represents a set of zero or more tokens from a text.
 */
export default class Ngram {

  private tokens: Token[];
  private cachedKey!: string; // TRICKY: definite assignment assertion

  /**
   * Returns the length of the n-gram in {@link Token}'s
   * @return {number}
   */
  get tokenLength() {
    return this.tokens.length;
  }

  /**
   * Returns the length of the n-gram in characters.
   * This does not account for whitespace.
   * @return {number}
   */
  get characterLength() {
    let length = 0;
    for (const token of this.tokens) {
      length += token.toString().length;
    }
    return length;
  }

  /**
   * Returns the position (in units of {@link Token} ) at which this n-gram appears in the sentence.
   * @return {number} - the position
   */
  get tokenPosition() {
    if (this.tokens.length) {
      return this.tokens[0].position;
    } else {
      return 0;
    }
  }

  /**
   * Returns the length of the sentence (in units of {@link Token}) in which this n-gram occurs.
   * @return {number}
   */
  get sentenceTokenLength() {
    if (this.tokens.length) {
      return this.tokens[0].sentenceTokenLength;
    } else {
      return 0;
    }
  }

  /**
   * Returns the length of the sentence (in units of character) in which this n-gram occurs.
   * This includes whitespace in the sentence
   * @return {number}
   */
  get sentenceCharacterLength() {
    if (this.tokens.length) {
      return this.tokens[0].sentenceCharacterLength;
    } else {
      return 0;
    }
  }

  /**
   * Returns the position (in units of character) at which this n-gram appears in the sentence.
   * @return {number} - the position
   */
  get characterPosition() {
    if (this.tokens.length) {
      return this.tokens[0].charPosition;
    } else {
      return 0;
    }
  }

  /**
   * Returns the n-gram key
   * @return {string}
   */
  public get key(): string {
    if (this.cachedKey === undefined) {
      const tokenValues = [];
      for (const token of this.tokens) {
        tokenValues.push(token.toString());
      }
      this.cachedKey = "n:" + tokenValues.join(":").toLowerCase();
    }
    return this.cachedKey;
  }

  /**
   * @param {Array<Token>} [tokens=[]] - a list of tokens of which this n-gram is composed
   */
  constructor(tokens: Token[] = []) {
    this.tokens = tokens;
  }

  /**
   * Checks if this n-gram contains one token
   * @return {boolean}
   */
  public isUnigram() {
    return this.tokens.length === 1;
  }

  /**
   * Checks if this n-gram contains two tokens
   * @return {boolean}
   */
  public isBigram() {
    return this.tokens.length === 2;
  }

  /**
   * Checks if this n-gram contains three tokens
   * @return {boolean}
   */
  public isTrigram() {
    return this.tokens.length === 3;
  }

  /**
   * Checks if this n-grams is an empty placeholder
   * @return {boolean}
   */
  public isNull() {
    return this.tokens.length === 0;
  }

  /**
   * Returns the tokens in this n-gram
   * @return {Token[]}
   */
  public getTokens() {
    return this.tokens;
  }
}
