import {Token} from "./";

/**
 * Represents a set of zero or more tokens from a text.
 */
export class Ngram {

  public occurrence: number = 1;
  public occurrences: number = 1;
  private tokens: Token[];
  private cachedKey!: string; // TRICKY: definite assignment assertion
  private cachedLemmaKey: string | undefined;

  /**
   * Returns the length of the n-gram in {@link Token}'s
   * @return {number}
   */
  get tokenLength(): number {
    return this.tokens.length;
  }

  /**
   * Returns the length of the n-gram in characters.
   * This does not account for whitespace.
   * @return {number}
   */
  get characterLength(): number {
    let length = 0;
    for (let i = 0, len = this.tokens.length; i < len; i++) {
      length += this.tokens[i].toString().length;
    }
    return length;
  }

  /**
   * Returns the position (in units of {@link Token} ) at which this n-gram appears in the sentence.
   * @return {number} - the position
   */
  get tokenPosition(): number {
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
  get sentenceTokenLength(): number {
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
  get sentenceCharacterLength(): number {
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
  get characterPosition(): number {
    if (this.tokens.length) {
      return this.tokens[0].charPosition;
    } else {
      return 0;
    }
  }

  /**
   * Returns the n-gram key
   */
  public get key(): string {
    this.cacheKeys();
    return this.cachedKey;
  }

  /**
   * Returns the n-gram lemma-based key
   */
  public get lemmaKey(): string | undefined {
    this.cacheKeys();
    return this.cachedLemmaKey;
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
  public isUnigram(): boolean {
    return this.tokens.length === 1;
  }

  /**
   * Checks if this n-gram contains two tokens
   * @return {boolean}
   */
  public isBigram(): boolean {
    return this.tokens.length === 2;
  }

  /**
   * Checks if this n-gram contains three tokens
   * @return {boolean}
   */
  public isTrigram(): boolean {
    return this.tokens.length === 3;
  }

  /**
   * Checks if this n-grams is an empty placeholder
   * @return {boolean}
   */
  public isNull(): boolean {
    return this.tokens.length === 0;
  }

  /**
   * Returns the tokens in this n-gram
   * @return {Token[]}
   */
  public getTokens(): Token[] {
    return this.tokens;
  }

  /**
   * Returns a human readable form of the n-gram
   * @return {string}
   */
  public toString(): string {
    return this.key;
  }

  /**
   * Outputs the n-gram to json
   * @param verbose - print full metadata
   * @return {object}
   */
  public toJSON(verbose: boolean = false): object {
    const json = [];
    for (let i = 0, len = this.tokens.length; i < len; i++) {
      json.push(this.tokens[i].toJSON(verbose));
    }
    return json;
  }

  /**
   * Checks if two n-grams are equal
   * @param {Ngram} ngram
   * @return {boolean}
   */
  public equals(ngram: Ngram): boolean {
    if (this.tokens.length === ngram.tokens.length) {
      // check if tokens are equal
      for (let i = 0, len = this.tokens.length; i < len; i++) {
        if (!this.tokens[i].equals(ngram.tokens[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Checks if two n-grams look the same
   * @param {Ngram} ngram
   * @return {boolean}
   */
  public looksLike(ngram: Ngram): boolean {
    if (this.tokens.length === ngram.tokens.length) {
      // check if tokens are equal
      for (let i = 0, len = this.tokens.length; i < len; i++) {
        if (!this.tokens[i].looksLike(ngram.tokens[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Caches the keys if they have not already been generated
   */
  private cacheKeys() {
    if (this.cachedKey === undefined) {
      let defaultKey = "n:";
      let lemmaKey = "n:";
      let missingLemma = false;

      const numTokens = this.tokens.length;
      for (let i = 0; i < numTokens; i++) {
        const token = this.tokens[i];
        defaultKey += token.toString() + ":";

        // TRICKY: lemma is not always available
        const lemma = token.lemma;
        if (lemma !== "") {
          lemmaKey += lemma + ":";
        } else {
          missingLemma = true;
        }
      }
      if (numTokens > 0) {
        this.cachedKey = defaultKey.slice(0, -1).toLowerCase();
      } else {
        this.cachedKey = defaultKey;
      }

      // TRICKY: all tokens must have a lemma
      if (lemmaKey.length > 0 && !missingLemma) {
        this.cachedLemmaKey = lemmaKey.slice(0, -1).toLowerCase();
      }
    }
  }
}
