export const align = (pairToBeAligned, corpus, savedAlignments) => {
  let alignments = []; // returned var
  // build internal phrase table
  let internalPhraseTable = {};
  savedAlignments.forEach(alignment => {
    const {primary, secondary} = alignment;
    if (!internalPhraseTable[primary]) internalPhraseTable[primary] = {};
    if (!internalPhraseTable[primary][secondary]) internalPhraseTable[primary][secondary] = 0;
    internalPhraseTable[primary][secondary] ++;
  });
  pairToBeAligned.primary.forEach(primary => {
    const secondary = Object.keys(internalPhraseTable[primary])
    .filter( word => pairToBeAligned.secondary.indexOf(word) > -1 )
    .sort( (b, a) => internalPhraseTable[primary][a] - internalPhraseTable[primary][b] )[0];
    alignments.push({primary, secondary});
  });
  return alignments;
};

/////


const pairToBeAligned = {
  primary: ["3","2","1"],
  secondary: ["c","b","a"]
};

const corpus = [];
const savedAlignments = [
  { primary: ["1"], secondary: ["a"] },
  { primary: ["2"], secondary: ["b"] },
  { primary: ["3"], secondary: ["c"] },
  { primary: ["1"], secondary: ["c"] },
  { primary: ["1"], secondary: ["a"] },
  { primary: ["1 2"], secondary: ["a"] }
];

const aligned = align(pairToBeAligned, corpus, savedAlignments);

console.log(aligned);
