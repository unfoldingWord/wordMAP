import {AlignmentIndex} from "../";
import {makeMockAlignment} from "../../util/testUtils";

describe("AlignmentIndex", () => {
  it("writes to the index", () => {
    const index = new AlignmentIndex();
    const alignment = makeMockAlignment("hello", "olleh");

    index.write(alignment, 7);
    const value = index.read(alignment);
    expect(value).toEqual(7);

    index.write(alignment, 3);
    const updatedValue = index.read(alignment);
    expect(updatedValue).toEqual(3);
  });

  it("increments the index", () => {
    const index = new AlignmentIndex();
    const alignment = makeMockAlignment("hello", "olleh");

    index.increment(alignment);
    const value = index.read(alignment);
    expect(value).toEqual(1);

    index.increment(alignment);
    const updatedValue = index.read(alignment);
    expect(updatedValue).toEqual(2);
  });

  it("reads the default value", () => {
    const index = new AlignmentIndex();
    const alignment = makeMockAlignment("hello", "olleh");

    const value = index.read(alignment);
    expect(value).toEqual(0);
  });

  it("reads a specific key", () => {
    const index = new AlignmentIndex();
    const alignment = makeMockAlignment("hello", "olleh");
    index.increment(alignment);

    const value = index.read(alignment.key);
    expect(value).toEqual(1);
  });
});
