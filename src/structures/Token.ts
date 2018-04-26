/**
 * Represents a single token from a text.
 */
export default class Token {

  private text: string;
  private tokenPos: number;
  private charPos: number;
  private sentenceCharLen: number;
  private sentenceTokenLen: number;
  private tokenOccurrence: number;
  private tokenOccurrences: number;
  private strongNumber: string;
  private lemmaString: string;
  private morphString: string;

  /**
   * Returns the strong's number
   * @return {string}
   */
  get strong() {
    return this.strongNumber;
  }

  /**
   * Returns the lemma
   * @return {string}
   */
  get lemma() {
    return this.lemmaString;
  }

  /**
   * Returns the morphology
   * @return {string}
   */
  get morph() {
    return this.morphString;
  }

  /**
   * Returns the position (in units of {@link Token}) of the token within the sentence.
   * @return {number}
   */
  get position() {
    return this.tokenPos;
  }

  /**
   * Returns the occurrence index of this token
   * @return {number}
   */
  get occurrence() {
    return this.tokenOccurrence;
  }

  /**
   * Returns the number of times this token occurs in the sentence
   * @return {number}
   */
  get occurrences() {
    return this.tokenOccurrences;
  }

  /**
   * The length of the sentence (in units of character) in which this token occurs.
   * This includes whitespace in the sentence
   */
  get sentenceCharacterLength() {
    return this.sentenceCharLen;
  }

  /**
   * The length of the sentence (in units of {@link Token}) in which this token occurs.
   */
  get sentenceTokenLength() {
    return this.sentenceTokenLen;
  }

  /**
   * Returns the position (in units of character) of the token within the sentence.
   * @return {number}
   */
  get charPosition() {
    return this.charPos;
  }

  /**
   *
   * @param {string} text - The text of the token.
   * @param {number} [position = 0] - the position of the n-gram within the sentence measured in {$link Token}'s
   * @param {number} [characterPosition = 0] - The token's position within the sentence measured in characters.
   * @param {number} sentenceTokenLen - the length of the sentence measured in {@link Token}'s
   * @param {number} sentenceCharLen - the length of the sentence measured in characters.
   * @param {number} occurrence - the index of occurrence (indexed by 1). e.g. how many times have we seen this token so far.
   * @param {number} occurrences - how many times this token appears in the sentence.
   * @param {string} strong
   * @param {string} lemma
   * @param {string} morph
   */
  constructor({text = "", position = 0, characterPosition = 0, sentenceTokenLen = 0, sentenceCharLen = 0, occurrence = 1, occurrences = 1, strong = "", lemma = "", morph = ""}) {
    this.text = text;
    if (position < 0 || characterPosition < 0) {
      throw new Error("Position cannot be less than 0");
    }
    // This makes it difficult to test
    // if (sentenceTokenLen <= 0 || sentenceCharLen <= 0) {
    //   throw new Error("Sentence length cannot be 0");
    // }

    this.tokenPos = position;
    this.charPos = characterPosition;
    this.sentenceCharLen = sentenceCharLen;
    this.sentenceTokenLen = sentenceTokenLen;
    this.tokenOccurrence = occurrence;
    this.tokenOccurrences = occurrences;
    this.strongNumber = strong;
    this.lemmaString = lemma;
    this.morphString = morph;
  }

  /**
   * Returns a human readable form of the token
   * @return {string}
   */
  public toString(): string {
    return this.text;
  }

  /**
   * Checks if two tokens are linguistically equal
   * @param {Token} token - the token to compare
   * @return {boolean}
   */
  public equals(token: Token): boolean {
    return this.toString() === token.toString()
      && this.position === token.position;
  }

  /**
   * Outputs the token to json
   * @param verbose - print full metadata.
   * @return {object}
   */
  public toJSON(verbose: boolean = false): object {
    if (verbose) {
      return {
        text: this.text,
        index: this.tokenPos,
        occurrence: this.tokenOccurrence,
        occurrences: this.tokenOccurrences
      };
    } else {
      return {
        index: this.tokenPos,
        occurrence: this.tokenOccurrence,
        occurrences: this.tokenOccurrences
      };
    }
  }
}
