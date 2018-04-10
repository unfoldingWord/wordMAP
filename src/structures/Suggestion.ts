import Prediction from "./Prediction";

/**
 * A translation suggestion
 */
export default class Suggestion {
  private predictions: Prediction[];

  constructor() {
    this.predictions = [];
  }

  /**
   * Adds a prediction to the suggestion.
   * @param {Prediction} prediction
   */
  public addPrediction(prediction: Prediction) {
    this.predictions.push(prediction);
  }

  public getPredictions() {
    return this.predictions;
  }
}
