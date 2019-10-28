import {Token} from "wordmap-lexer";
import {AlignmentRelativeOccurrence} from "../";
import {Alignment, Ngram, Prediction} from "../../core/";

function makeNgram(occurrence: number, occurrences: number): Ngram {
  const ngram = new Ngram([new Token({text: "text"})]);
  ngram.occurrence = occurrence;
  ngram.occurrences = occurrences;
  return ngram;
}

describe("AlignmentRelativeOccurrence", () => {

  describe("short ranges", () => {
    it("is identical", () => {
      const p = new Prediction(new Alignment(
        makeNgram(1, 2),
        makeNgram(1, 2)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(1);
    });

    it("is opposite", () => {
      const p = new Prediction(new Alignment(
        makeNgram(1, 2),
        makeNgram(2, 2)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0);
    });
  });

  describe("long ranges", () => {
    it("is close", () => {
      const p = new Prediction(new Alignment(
        makeNgram(4, 5),
        makeNgram(2, 3)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0.75);
    });

    it("is somewhat close", () => {
      const p = new Prediction(new Alignment(
        makeNgram(4, 4),
        makeNgram(2, 3)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0.5);
    });

    it("is identical", () => {
      // both points are in the middle
      const p = new Prediction(new Alignment(
        makeNgram(3, 5),
        makeNgram(5, 9)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(1);
    });

    it("is far", () => {
      const p = new Prediction(new Alignment(
        makeNgram(2, 5),
        makeNgram(8, 9)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0.375);
    });

    it("is opposite", () => {
      const p = new Prediction(new Alignment(
        makeNgram(1, 5),
        makeNgram(9, 9)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(0);
    });

    it("does not apply", () => {
      const p = new Prediction(new Alignment(
        makeNgram(1, 1),
        makeNgram(1, 2)
      ));
      const result = AlignmentRelativeOccurrence.calculate(p);
      expect(result).toEqual(NaN);
    });
  });
});
