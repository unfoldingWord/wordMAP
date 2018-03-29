import Token from "./Token";

/**
 * Represents a set of zero or more tokens from a text.
 */
export default class Ngram {

  private tokens: Token[];

  /**
   * @param {Array<Token>} [tokens=[]] - a list of tokens of which this n-gram is composed
   */
  constructor(tokens: Token[] = []) {
    this.tokens = tokens;
  }

  /**
   * Returns a human readable form of the n-gram.
   * @return {string}
   */
  public toString(): string {
    const tokenValues = [];
    for (const token of this.tokens) {
      tokenValues.push(token.toString());
    }
    return tokenValues.join(":");
  }
}
