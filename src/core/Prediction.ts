import {NumberObject} from "../index/NumberObject";
import {Alignment} from "./Alignment";
import {Ngram} from "./Ngram";

/**
 * Represents a single alignment prediction
 */
export class Prediction {
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
  get alignment(): Alignment {
    return this.predictedAlignment;
  }

  /**
   * Convenience method to access the source n-gram of the alignment
   * @return {Ngram}
   */
  get source(): Ngram {
    return this.predictedAlignment.sourceNgram;
  }

  /**
   * Convenience method to access the target n-gram of the alignment.
   * @return {Ngram}
   */
  get target(): Ngram {
    return this.predictedAlignment.targetNgram;
  }

  /**
   * Convenience method for retrieving the prediction confidence.
   * @return {number}
   */
  get confidence(): number {
    return this.getScore("confidence");
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
   * Checks if the score key exists.
   * @param key
   */
  public hasScore(key: string): boolean {
    return key in this.scores;
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
    const predictionSourceTokens = prediction.source.getTokens();
    const predictionTargetTokens = prediction.target.getTokens();
    const sourceTokens = this.source.getTokens();
    const targetTokens = this.target.getTokens();

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

  /**
   * Prints a user friendly form of the prediction
   * @return {string}
   */
  public toString(): string {
    const confidence = this.confidence.toString().substring(0, 4);
    return `${confidence}|${this.alignment.key}`;
  }

  /**
   * Outputs the prediction to json
   * @param verbose - print full metadata.
   * @return {object}
   */
  public toJSON(verbose: boolean = false): object {
    return {
      confidence: this.confidence,
      sourceNgram: this.source.toJSON(verbose),
      targetNgram: this.target.toJSON(verbose)
    };
  }
}
