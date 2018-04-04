import Alignment from "./Alignment";

export interface NumberObject {
  [key: string]: number;
}

/**
 * Represents a single alignment prediction
 */
export default class Prediction {
  private possibleAlignment: Alignment;
  private scores: NumberObject;

  /**
   * Returns an array of score keys
   * @return {string[]}
   */
  get scoreKeys() {
    return Object.keys(this.scores);
  }

  /**
   * Returns the alignment represented by this prediction
   * @return {Alignment}
   */
  get alignment() {
    return this.possibleAlignment;
  }

  /**
   * Instantiates a new alignment prediction
   * @param {Alignment} alignment - the alignment for which a prediction will be calculated
   */
  constructor(alignment: Alignment) {
    this.scores = {};
    this.possibleAlignment = alignment;
  }

  /**
   * Sets a score for this prediction
   * @param {string} key - the score key
   * @param {number} value - the score value
   */
  public setScore(key: string, value: number) {
    this.scores[key] = value;
  }

  /**
   * Convenience method for setting multiple scores at a time
   * @param {NumberObject} scores - an object of scores
   */
  public setScores(scores: NumberObject) {
    this.scores = {
      ...this.scores,
      ...scores
    };
  }

  /**
   * Reads a single score from this prediction.
   * @param {string} key - the score key
   * @return {number} - the score value
   */
  public getScore(key: string): number {
    if (key in this.scores) {
      return this.scores[key];
    } else {
      throw new Error(`Unknown score key ${key}`);
    }
  }
}
