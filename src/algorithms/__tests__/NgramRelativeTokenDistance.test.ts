import NgramRelativeTokenDistance from "../NgramRelativeTokenDistance";

function round(num: number): number {
  return Math.round(num * 1000) / 1000;
}

describe("NgramRelativeTokenDistance", () => {
  // sentence length
  const t = 9;

  it("is next to", () => {
    const result = NgramRelativeTokenDistance.calculate(t, 2, 3);
    expect(result).toEqual(1);
  });
  it("is close", () => {
    const result = NgramRelativeTokenDistance.calculate(t, 2, 4);
    expect(round(result)).toEqual(0.857);
  });
  it("is far from", () => {
    const result = NgramRelativeTokenDistance.calculate(t, 2, 8);
    expect(round(result)).toEqual(0.286);
  });
  it("is opposite", () => {
    const result = NgramRelativeTokenDistance.calculate(t, 0, 8);
    expect(result).toEqual(0);
  });
});
