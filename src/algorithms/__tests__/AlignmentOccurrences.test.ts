import AlignmentOccurrences from "../AlignmentOccurrences";

describe("AlignmentOccurrences", () => {
  it("has similar occurrence with large numbers", () => {
    const weight = AlignmentOccurrences.calc(30, 33);
    expect(weight).toEqual(0.9090909090909091);
  });

  it("has same occurrence", () => {
    const weight = AlignmentOccurrences.calc(3, 3);
    expect(weight).toEqual(1);
  });

  it("has similar occurrence", () => {
    const weight = AlignmentOccurrences.calc(3, 4);
    expect(weight).toEqual(0.75);
  });

  it("has dis-similar occurrence", () => {
    const weight = AlignmentOccurrences.calc(3, 20);
    expect(weight).toEqual(0.15);
  });
});
