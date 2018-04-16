import NumberObject from "../index/NumberObject";
import Alignment from "./Alignment";

/**
 * Represents a single alignment prediction
 */
export default class Prediction {
  private predictedAlignment: Alignment;
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
    return this.predictedAlignment;
  }

  /**
   * Returns the prediction key
   * @return {string}
   */
  public get key(): string {
    return this.predictedAlignment.key;
  }

  /**
   * Instantiates a new alignment prediction
   * @param {Alignment} alignment - the alignment for which a prediction will be calculated
   */
  constructor(alignment: Alignment) {
    this.scores = {};
    this.predictedAlignment = alignment;
  }

  /**
   * Sets a score for this prediction
   * @param {string} key - the score key
   * @param {number} value - the score value
   */
  public setScore(key: string, value: number) {
    if (key in this.scores) {
      throw new Error(`Score key "${key}" already exists. Scores can only be written once.`);
    } else {
      this.scores[key] = value;
    }
  }

  /**
   * Convenience method for setting multiple scores at a time
   * @param {NumberObject} scores - an object of scores
   */
  public setScores(scores: NumberObject) {
    const keys = Object.keys(scores);
    for (const key of keys) {
      this.setScore(key, scores[key]);
    }
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

  /**
   * Returns a copy of the prediction scores
   * @return {NumberObject}
   */
  public getScores() {
    return Object.assign({}, this.scores);
  }

  /**
   * Checks if this prediction intersects with another prediction.
   * @param {Prediction} prediction
   * @return {boolean}
   */
  public intersects(prediction: Prediction): boolean {
    const predictionSourceTokens = prediction.alignment.source.getTokens();
    const predictionTargetTokens = prediction.alignment.target.getTokens();
    const sourceTokens = this.alignment.source.getTokens();
    const targetTokens = this.alignment.target.getTokens();

    // check source tokens
    for (const t of sourceTokens) {
      for (const pt of predictionSourceTokens) {
        if (t.equals(pt)) {
          return true;
        }
      }
    }

    // check target tokens
    for (const t of targetTokens) {
      for (const pt of predictionTargetTokens) {
        if (t.equals(pt)) {
          return true;
        }
      }
    }

    return false;
  }
}
