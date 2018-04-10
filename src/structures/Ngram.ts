import Token from "./Token";

/**
 * Represents a set of zero or more tokens from a text.
 */
export default class Ngram {

  private tokens: Token[];

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
   * Returns a human readable form of the n-gram.
   * @return {string}
   */
  public get key(): string {
    const tokenValues = [];
    for (const token of this.tokens) {
      tokenValues.push(token.toString());
    }
    return "n:" + tokenValues.join(":");
  }

  /**
   * @param {Array<Token>} [tokens=[]] - a list of tokens of which this n-gram is composed
   */
  constructor(tokens: Token[] = []) {
    this.tokens = tokens;
  }

  /**
   * Returns the tokens in this n-gram
   * @return {Token[]}
   */
  public getTokens() {
    return this.tokens;
  }
}
