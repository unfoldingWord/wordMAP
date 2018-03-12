import align from '../src/align';

const corpus = [];
const savedAlignments = [
  {primary: ["1"], secondary: ["a"]},
  {primary: ["2"], secondary: ["b"]},
  {primary: ["3"], secondary: ["c"]},
  {primary: ["1"], secondary: ["c"]},
  {primary: ["1"], secondary: ["a"]},
  {primary: ["1", "2"], secondary: ["a"]}
];

it('should align multiple 1:1 when all hits', () => {
  const pairToBeAligned = {
    primary: ["1", "2", "3"],
    secondary: ["a", "b", "c"]
  };
  const expected = [
    {primary: ["1"], secondary: ["a"]},
    {primary: ["2"], secondary: ["b"]},
    {primary: ["3"], secondary: ["c"]}
  ];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});

it('should align with sentences in reverse order', () => {
  const pairToBeAligned = {
    primary: ["3", "2", "1"],
    secondary: ["c", "b", "a"]
  };
  const expected = [
    {primary: ["3"], secondary: ["c"]},
    {primary: ["2"], secondary: ["b"]},
    {primary: ["1"], secondary: ["a"]}
  ];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});

it('should align with sentences random word orders', () => {
  const pairToBeAligned = {
    primary: ["3", "1", "2"],
    secondary: ["b", "a", "c"]
  };
  const expected = [
    {primary: ["3"], secondary: ["c"]},
    {primary: ["1"], secondary: ["a"]},
    {primary: ["2"], secondary: ["b"]}
  ];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});

it('should align 1:1', () => {
  const pairToBeAligned = {
    primary: ["1"],
    secondary: ["a"]
  };
  const expected = [
    {primary: ["1"], secondary: ["a"]}
  ];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});

it('should align a single 1:1 when some misses', () => {
  const pairToBeAligned = {
    primary: ["1", "7"],
    secondary: ["a", "g"]
  };
  const expected = [
    {primary: ["1"], secondary: ["a"]}
  ];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});

it('should return empty alignments when all misses', () => {
  const pairToBeAligned = {
    primary: ["7"],
    secondary: ["g"]
  };
  const expected = [];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});
