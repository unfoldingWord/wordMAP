import {Token} from "wordmap-lexer";
import Alignment from "../../structures/Alignment";
import Ngram from "../../structures/Ngram";
import Prediction from "../../structures/Prediction";
import AlignmentRelativeOccurrence from "../AlignmentRelativeOccurrence";

describe("AlignmentRelativeOccurrence", () => {

  describe("short ranges", () => {
    it("is identical", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 1,
            occurrences: 2
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 1,
            occurrences: 2
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(1);
    });

    it("is opposite", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 1,
            occurrences: 2
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 2,
            occurrences: 2
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0);
    });
  });

  describe("long ranges", () => {
    it("is close", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 4,
            occurrences: 5
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 2,
            occurrences: 3
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0.75);
    });

    it("is somewhat close", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 4,
            occurrences: 4
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 2,
            occurrences: 3
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0.5);
    });

    it("is identical", () => {
      // both points are in the middle
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 3,
            occurrences: 5
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 5,
            occurrences: 9
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(1);
    });

    it("is far", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 2,
            occurrences: 5
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 8,
            occurrences: 9
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0.375);
    });

    it("is opposite", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 1,
            occurrences: 5
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 9,
            occurrences: 9
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0);
    });

    it("does not apply", () => {
      const p = new Prediction(new Alignment(
        new Ngram([
          new Token({
            text: "source",
            occurrence: 1,
            occurrences: 1
          })]),
        new Ngram([
          new Token({
            text: "target",
            occurrence: 1,
            occurrences: 2
          })])
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(NaN);
    });
  });
});
