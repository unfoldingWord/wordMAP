import align from '../src/align';

const pairToBeAligned = {
  primary: ["3", "2", "1"],
  secondary: ["c", "b", "a"]
};

const corpus = [];
const savedAlignments = [
  {primary: ["1"], secondary: ["a"]},
  {primary: ["2"], secondary: ["b"]},
  {primary: ["3"], secondary: ["c"]},
  {primary: ["1"], secondary: ["c"]},
  {primary: ["1"], secondary: ["a"]},
  {primary: ["1 2"], secondary: ["a"]}
];

it('should ouput expected content', () => {
  const expected = [
    {primary: '3', secondary: 'c'},
    {primary: '2', secondary: 'b'},
    {primary: '1', secondary: 'a'}
  ];

  const aligned = align(pairToBeAligned, corpus, savedAlignments);
  expect(aligned).toEqual(expected);
});
