atom# Multi-Lingual Word Alignment Prediction (Word MAP)

# Introduction

Word alignment prediction is the process of mapping/associating words from some primary text with corresponding words in a secondary text. This tool uses statistical algorithms to determine which words or phrases in two texts are equivalent in meaning.

Alignments provide many valuable benefits to translators including:

* Ensures that all terms and phrases in the primary text have a proper translation in the secondary text.
* Provides in-context vocabulary suggestions to the translator.
* Helps prevent inconsistencies in the translation.

## Terms

* **Primary Text**: The original biblical texts (traditionally referred to as "source text").
* **Primary Language**: The language used in a `primary text`.
* **Secondary Text**: The translation of a `primary text`.
* **Secondary Language**: The language used in a `secondary text`. See also `gateway language`.
* **Gateway (Secondary) Languages**: Those languages that compose the minimum set of trade languages in the world. See also `secondary language`.
* **Ternary Text**: The translation of a `secondary text`.
* **Ternary (Minor) Language**: A non-trade language spoken by a small group of people. i.e. a language that is not a `gateway language`. Also, the language used in a `ternary text`.
* **n-gram (word or phrase)**: A contiguous sequence of n items from a given sample of text. An n-gram of size 1 is referred to as a "unigram"; size 2 is a "bigram", etc. For example: "hello" is a unigram, while "hello world" is a bigram.
* **Unaligned Sentence Pair**: A sentence in two languages that need to be aligned. e.g. a sentence from a primary text and secondary text.
* **Alignment**: Two individual `n-grams` that have been matched from two texts. e.g. from a primary text and secondary text.
* **Saved Alignment**: An alignment that has been approved/corrected by the user.
* **Engine**: Contains a index of every permutation of possible `n-gram` `alignments`. And an index of `saved alignments`.
* **Corpus**: The input dataset which is the primary and secondary text given as a list of `unaligned sentence pairs`. This is used in training the engine. Note: This is not not input directly provided by the user.
* **Tokenization**: Separating a sentence into individual words and punctuation.
* **Normalization**: A text might use several different utf8 characters to represent the same visual character. The process of normalization reduces visual character representation to a single utf8 character. A text using a single utf8 standard is considered normalized.

> **Note:** it is important to understand that *our* definition of n-grams is "contiguous". It is possible
> and even beneficial to support non-contiguous n-grams, however this greatly
> increases the resources required by the system.

## Use Cases

* Aligning a primary text with a secondary text e.g. when generating word maps for gateway languages.
* Aligning a secondary text with a ternary text.
* Aligning a primary text to a ternary text (using the secondary as a proxy)

## The Need

Existing tools require large data sets, complex running environments, and are usually limited to running in a server environment.

We need a tool that:

* runs on the client with minimal configuration.
* works with existing web browser technology.
* integrates with translationCore and related tools.
* works without an Internet connection.
* does not have a minimum corpus size.
* requires minimal system resources.

# Requirements

## Tool Requirements

* Learn and adapt to regularly changing input without relying on previously stored engines.
* Must not store trained engines.
* Easy to add new lines of corpus.
* Easy to manually add saved alignments.
* Be fast enough to align a single sentence in real time.
* Differentiate multiple occurrences of the same word within a sentence.

> TODO: Support for metadata like lemma, stems, strong's numbers and parts of speech in all languages.
> Also support contextually saved alignments. e.g. alignments are grouped by verse.
> In order to support metadata the input will have to be an object.
> String input should also be accepted, but will result in a "dumb" object.
> We need to define the object structure and what features of the tool will be
> enabled for each key(s) in the object.

## Input Prerequisites

* The corpus must tokenized
* The unaligned sentence pairs must be tokenized.
* The corpus and unaligned sentence pairs must be in the same primary and secondary languages.
* Input must be in utf8.
* Input characters should be normalized for optimum results.
* Input tokens should be objects when including metadata.

## Overview of Operation

The following is a non-technical description of how this tool could be used.

1. The tool is initialized with some corpus and previously saved alignments.
1. The tool trains a new engine using the provided corpus.
1. The user gives the tool an unaligned sentence pair.
1. The tool generates and returns a list of possible alignments for the sentence pair provided by the user.
1. The user chooses the correct alignments to use in their work.
1. The alignments chosen by the user is given back to the tool as `saved alignments` to increase accuracy of future predictions.

# Engine Training

An engine is composed of two indices; The corpus index and saved alignments index.


## Corpus Index
This index is generated by iterating over the corpus.
For each unaligned sentence pair in the corpus:

1. Filter out punctuation from the corpus.
1. Generate n-grams for each sentence (n-grams are often limited to lengths of 1 to 3).
1. Generate permutations of all possible combinations of n-grams between primary and secondary sentences so that we can:
1. Tally the occurrences of each permutation across the entire corpus.

> NOTE: while generating permutation include a match against 0-length n-grams.
> This accounts for the case where an n-gram may not have a valid match in the apposing language.

Code samples:
```js
// Note: the token strings would be objects by the time it gets here
// Strings are used for simplicity in conveying concepts
corpus = [
 [["a", "b", "c", "."], ["d", "e", "f", "|"]],
 // e.g. [["primary", "language", "sentence", "."], [...]]
 ...
];

// first sentence in primary text
ngrams[0][0] = [
  ["a"], ["b"], ["c"],
  ["a", "b"], ["b", "c"],
  ["a", "b", "c"]
];

// first sentence in secondary text
ngrams[0][1] = [
  ["d"], ["e"], ["f"],
  ["d", "e"], ["e", "f"],
  ["d", "e", "f"]
];

// temporary calculations
permutations = [
  // permutations of first sentence
  [
    // [<primary n-gram>, <secondary n-gram>], ...
    [["a"],["d"]], [["a"],["e"]], [["a"],["f"]],
    [["b"],["d"]], [["b"],["e"]], [["b"],["f"]],
    [["c"],["d"]], [["c"],["e"]], [["c"],["f"]],
    ...
    [["b","c"],["d"]], [["b","c"],["e"]], [["b","c"],["f"]],
    [["b","c"],["d","e"]], [["b","c"],["e","f"]],
    [["b","c"],["d","e","f"]],
    ...
  ],
  // permutations of other sentences
  ...
];

// keyed by n-grams by the primary text
primaryAlignmentFrequencyIndex = {
  "a": {
    "d": 1,
    "e": 3,
    "f": 12,
    ...
  },
  "b": {
    "d": 4,
    "e": 1,
    "f": 1,
    ...
  },
  "b c": {
    "d": 1,
    "e": 1,
    "f": 1,
    "d e": 1,
    "e f": 1,
    "d e f": 1
  }
  ...
}

// keyed by n-grams in the secondary text
secondaryAlignmentFrequencyIndex = {
  "d": {
    "a": 1,
    "b": 2,
    "c": 12,
    ...
  },
  "e": {
    "a": 4,
    "b": 1,
    "c": 1,
    ...
  },
  ...
}

```

## Save Alignments Index
This index is generated by iterating over all saved alignments.
For each saved alignment, it tallies occurrences.
Since these alignments have already been verified by the user there is no need to generate n-grams or permutations.

See the code examples for the Corpus Index above.

## Performance Notes

Most other engines require millions of lines of corpus on which they are trained.
This amount of data takes enormous amounts of time to process.
Also, these engines include in their training, heavy statistical algorithms that are computed on every permutation.
Only a small percentage of the data is used in the decoding of the alignments for a single sentence.
The result is a lot of wasted time and resources.

In our engine implementation the corpus is first indexed and stored without running statistical algorithms.
This allows us to dynamically add new corpus to the index quickly without running expensive algorithms.

When a sentence is decoded we only use the relevant data from the index.
Since we are only using a subset of the data our statistical algorithms can run exponentially faster.

---

# Scratch Pad

we thinking out loud here.

### Corpus Preprocessing (done)
Corpus must be prepared as a list of unaligned tokenized sentence pairs and optionally normalized.

### Training/Encoding (done)
- Receive corpus
  - Generate n-grams for corpus
  - Generate permutations
  - Index and tally occurrences
- Receive saved alignments (as a list of known permutations)
  - Index and tally occurrences

### Prediction/Decoding (in progress)
- Receive unaligned sentence pair
  - Generate n-grams for unaligned sentence pair
  - Generate permutations for the n-grams between languages
- Selecting subset of data that is relevant
  - relevant to words in provided unaligned sentence pair
  - from both corpus and saved alignments indices
(done up to here)
- Statistical algorithms
  - Scoring
  - Weighted average of all scores
- Alignment Prediction
  - Selection of best alignments via Process of elimination
    - Pick the best
    - Eliminate non-usable conflicts
    - Penalize usable conflicts
    - Repeat until all words are covered
  - Order selected alignments to one of the unaligned sentence word order

loop through each index and filter by keys that match the n-grams in the provided unaligned sentence pair.

---

# Prediction Algorithms
The alignment prediction begins when the user provides an unaligned sentence pair.

## n-gram Document Frequency

> **Note:** This algorithm uses similar concepts as found in tf-idf.

The alignment document frequency algorithm is the foundation for most of the other algorithms in this tool.

The algorithm proceeds as follows:

1. Generate n-grams for each sentence in the unaligned sentence pair.
1. Generate permutations of all `possible alignments` of n-grams between the sentences in the pair.
1. Filter the corpus/saved alignment indices to just those possible alignments within the unaligned sentence pair.

Perform the following calculations on the filtered and unfiltered corpus/saved alignment indices:

1. Calculate the frequency of each filtered *primary* n-gram over the corpus/saved alignment index.
1. Calculate the frequency of each filtered *secondary* n-gram over the corpus/saved alignment index.
1. Calculate the ratio of alignment frequency vs *primary* n-gram frequency.
1. Calculate the ratio of alignment frequency vs *secondary* n-gram frequency.

> **Note:** It is important to compare the filtered and unfiltered frequency ratios.
This is done in other algorithms.

Pseudo Code Samples:

```js
// filter the corpus and add corpus frequency sums and ratios
primaryNgrams = ngram(unalignedSentencePair[0], 2);
secondaryNgrams = ngram(unalignedSentencePair[1], 3);
primaryIndex = {};
secondaryIndex = {};
primaryNgrams.forEach(primaryNgram => {
  secondaryNgrams.forEach(secondaryNgram => {
    primaryIndex[primaryNgram][secondaryNgram] = {
      // frequency of this n-gram combination in the corpus (this is the same value as the frequency below)
      frequency: primaryAlignmentFrequencyIndex[primaryNgram][secondaryNgram],
      // frequency of primary n-gram in the corpus
      corpusFrequency: objectSum(primaryAlignmentFrequencyIndex[primaryNgram]),
      corpusFrequencyRatio: this.frequency / this.corpusFrequency
    };
    secondaryIndex[secondaryNgram][primaryNgram] = {
      // frequency of this n-gram combination in the corpus (this is the same value as the frequency above)
      frequency: secondaryAlignmentFrequencyIndex[primaryNgram][secondaryNgram],
      // frequency of secondary n-gram in the corpus
      corpusFrequency: objectSum(secondaryAlignmentFrequencyIndex[secondaryNgram]),
      corpusFrequencyRatio: this.frequency / this.corpusFrequency
    };
  });
});

// add filtered frequency sums and ratios
Object.keys(primaryIndex).forEach(primaryNgram => {
  // frequency of this n-gram combination in the filtered corpus (this is the same value as the frequency below)
  primaryIndex[primaryNgram][secondaryNgram].filteredFrequency = objectSumByAttribute(primaryIndex[primaryNgram], 'frequency');
  primaryIndex[primaryNgram][secondaryNgram].filteredFrequencyRatio = this.frequency / this.filteredFrequency;
});
Object.keys(secondaryIndex).forEach(secondaryNgram => {
  // frequency of this n-gram combination in the filtered corpus (this is the same value as the frequency above)
  secondaryIndex[secondaryNgram][primaryNgram].filteredFrequency = objectSumByAttribute(secondaryIndex[secondaryNgram], 'frequency');
  secondaryIndex[primaryNgram][secondaryNgram].filteredFrequencyRatio = this.frequency / this.filteredFrequency;
});
```

## Phrase Plausibility

N-grams are essentially dumb phrases as it combines any contiguous tokens.
A major problem is identifying if an n-gram is actually a phrase.
Checking to see how common an n-gram is used over the corpus helps determine
how likely it is a phrase.

Plausibility is determined by first assuming unigrams are a phrase.
Larger n-grams use the calculated commonality.

> NOTE: we need a way to allow 0-length n-grams in alignments,
> because one word may not exist in another language.

### Commonality

Commonality demonstrates the likely-hood that both n-grams are phrases.
And a high scores indicates it is plausible that as phrases, they could be equivalent.

```
where x = primary n-gram corpusFrequency.
and y = secondary n-gram corpusFrequency.

commonality = min( (1-(1/x)), (1-(1/y)) )
```

## Uniqueness

Because some words are uniquely used in the current unaligned sentence pair,
this results in low or unreliable confidence scores in most algorithms.

Uniqueness is the inverse of commonality.
If an n-gram is used only once or very rarely in the primary text it is likely the
equivalent n-gram in the secondary text is also used very rarely.

Primary n-gram uniqueness
```
where x = primary n-gram filteredFrequency
and y = primary n-gram corpusFrequency

primary uniqueness = x / y
```

Secondary n-gram uniqueness
```
where x = secondary n-gram filteredFrequency
and y = secondary n-gram corpusFrequency

secondary uniqueness = x / y
```

### Uniqueness Affinity

Once we have the uniqueness of primary and secondary n-grams we can calculate
the uniqueness of the alignment.

```
delta = abs(primary uniqueness - secondary uniqueness)
uniqueness = 1 - delta
```


## N-gram Length

In other algorithms n-grams are scored equally regardless of length.
However, shorter n-grams are more prevalent than longer n-grams.
This typically results in shorter n-grams overwhelming the output.

The weight of an alignment increases proportionally to it's length, and relative
sentence coverage in primary and secondary text.

### Length Ratio

Get the ratio of n-gram length to the sentence token length for each language.

Primary n-gram length ratio
```
where x = primary n-gram length
and y = primary sentence token length

primary length ratio = x / y
```

Secondary n-gram length ratio
```
where x = secondary n-gram length
and y = secondary sentence token length

secondary length ratio = x / y
```

### Length Affinity

Once we have the length ratios of the two n-grams we can calculate
the n-gram weight for the alignment.

```
delta = abs(primary length ratio - secondary length ratio)
weight = pow(1 - delta, 5)
```

> NOTE: the numbers in the initial delta calculation were too flat
> so we added a power of 5 to improve the curve.

## Character Length

> **Note** This algorithm is very similar to the n-gram length algorithm.
> However, we ended up using a completely different algorithm.

Phrases commonly have similar length across multiple languages.
Other algorithms do not account for this similarity.
Therefore, these highly probable alignments are overlooked.

Character length weight is proportional to the character length of the primary n-gram and the secondary n-gram.

> **NOTE**: it's important to see the ratio of the length vs the sentence length.
> Additionally, we may want a new algorithm that compares this ratio.

> **TODO**: give this algorithm some TLC. Is there a better formula for calculating this?

```
where x = primary n-gram character length
and y = secondary n-gram character length

delta = abs(x - y)
largest = max(x, y)
weight = (largest - delta) / largest
```


## Alignment Occurrences

A commonly seen pattern in translation is that word repetition in the primary text
is often seen in the secondary text. Other algorithms are unable to account for this pattern in the text. Therefore, these highly probable alignments are overlooked.


The alignment occurrences weight is inversely proportional to the difference of n-gram frequency in the primary sentence vs the n-gram frequency in the secondary sentence.

> Example: a 1 to 1 n-gram alignment would get the highest score.
> As this deviates the score will decrease.

```
where x = primary n-gram occurrences count
and y = secondary n-gram occurrences count

delta = abs(x - y)
weight = 1 / ( delta + 1)
```

## Alignment Position

> **Note:** this feature is currently for literal translations only.
> It could be enhanced to support dynamic translations in the future.

Other algorithms will not identify the relative position of n-grams in the sentence.
However, in literal translations this positioning is usually proportional.
Therefore, these highly probable alignments are overlooked.

We want to give extra preference to those aliments for which n-grams are in relatively proportional positions within their sentences.
The alignment position weight is proportional to the difference in n-gram position in the primary sentence vs the n-gram position in the secondary sentence.

```
where x = primary n-gram position
and y = secondary n-gram position

delta = abs(x - y)
weight = 1 - delta
```

> **NOTE:** This algorithm accounts for single occurrences within a sentence.
> A new algorithm would need to be created to account for multiple occurrences.
> We cannot combine the two algorithms, because it would skew the weight toward
> either single occurrences or multiple occurrences.

## Frequency Ratios

---

> Work on these next!

- Frequency Ratios
- Static Scores
