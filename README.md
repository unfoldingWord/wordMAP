# Multi-Lingual Word Alignment Prediction (Word MAP)

# Introduction

Word alignment prediction is the process of mapping/associating words from some primary text with corresponding words in a secondary text. This tool uses advanced statistical algorithms to determine which words or phrases in two texts are equivalent in meaning.

Alignments provide many valuable benefits to translators including:

* Ensures that all terms and phrases in the primary text have a proper translation in the secondary text.
* Provides in-context vocabulary suggestions to the translator.
* Helps prevent inconsistencies in the translation.

## Terms

* **Primary Text**: The original biblical texts (historically referred to as "source text").
* **Primary Language**: The language used in a `primary text`.
* **Secondary Text**: The translation of a `primary text`.
* **Secondary Language**: The language used in a `secondary text`. See also `gateway language`.
* **Gateway (Secondary) Languages**: Those languages that compose the minimum set of trade languages in the world. See also `secondary language`.
* **Ternary Text**: The translation of a `secondary text`.
* **Ternary (Minor) Language**: A non-trade language spoken by a small group of people. i.e. a language that is not a `gateway language`. Also, the language used in a `ternary text`.
* **n-gram (word or phrase)**: A contiguous sequence of n items from a given sample of text. An n-gram of size 1 is referred to as a "unigram"; size 2 is a "bigram", etc. For example: "hello" is a unigram, while "hello world" is a bigram.
* **Unaligned Sentence Pair**: A sentence in two languages that need to be aligned. e.g. a sentence from a primary text and secondary text.
* **Alignment**: Two individual `n-grams` that have been aligned from two texts. e.g. from a primary text and secondary text.
* **Saved Alignment**: An alignment that has been approved/corrected by the user.
* **Engine**: Contains a index of every permutation of possible `n-gram` `alignments`. And an index of `saved alignments`.
* **Corpus**: The input dataset which is the primary and secondary text grouped by `unaligned sentence pairs`. This is used in training the engine. Note: This is a list of `unaligned sentence pairs` though not input directly provided by the user.
* **Tokenization**: Separating a sentence into individual words and punctuation.
* **Normalization**: A text might use several different utf8 characters to represent the same visual character. The process of normalization reduces visual character representation to a single utf8 character. A text using a single utf8 standard is considered normalized.

> **Note:** it is important to understand that n-grams are "contiguous". It is possible
> and even beneficial to support non-contiguous n-grams, however this greatly
> increases the resources required by the system.

## Use Cases

The following use cases provide the basis for accomplishing the vision set forth below.

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
* does not have a minimal corpus size.
* requires minimal system resources.

# Requirements

## Tool Requirements

* Learn and adapt to regularly changing input without relying on previously stored engines.
* Must not store trained engines.
* Easy to add new lines of corpus.
* Easy to add manually saved alignments.
* Be fast enough to be usable in real time.
* Differentiate multiple occurrences of the same word.

> TODO: Support for metadata like strong's numbers and parts of speech.
> Also support contextually saved alignments. e.g. alignments are grouped by verse.

## Input Prerequisites

* The corpus must tokenized
* The unaligned sentence pairs must be tokenized.
* The corpus and unaligned sentence pairs must be in the same primary and secondary languages.
* Input must be in utf8.
* Input characters should be normalized for optimum results.

## Overview of Operation

The following is a non-technical description of how this tool would be used.

1. The tool is initialized with some corpus and previously saved alignments.
1. The tool trains a new engine using the provided corpus.
1. The user gives the tool an unaligned sentence pair.
1. The tool generates and returns a list of possible alignments for the sentence pair provided by the user.
1. The user chooses the correct alignment to use in their work.
1. The alignment chosen by the user is given back to the tool to increase accuracy of future predictions.

# Engine Training

An engine is composed of two indices; The corpus index and saved alignments index.


## Corpus Index
This index is generated by iterating over the corpus.
For each unaligned sentence pair in the corpus
1. Filter out punctuation from the corpus.
1. Generate n-grams for each sentence (n-grams are often limited to lengths of 1 to 3).
1. Generate permutations of all possible combinations of n-grams between primary and secondary sentences so that we can:
1. Tally the occurrences of each permutation across the entire corpus.


Code samples:
```js
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
Since the alignments are verified there is no need for generating n-grams or permutations.

See the code examples for the Corpus Index above.

## Performance Notes

Most other engines require millions of lines of corpus on which they are trained.
This amount of data takes enormous amounts of time to process.
Also, these engines include in their training, heavy statistical algorithms that are computed on every permutation.
Only a small percentage of the data is used in the decoding of the alignment for a single sentence.
The result is a lot of wasted time and resources.

In our engine implementation the corpus is first indexed and stored without running statistical algorithms.
This allows us to dynamically add new corpus to the index quickly without running expensive algorithms.

When a sentence is decoded we only use the relevant data from the index.
Since we are only using a subset of the data our statistical algorithms can run exponentially faster.

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


# Alignment Prediction
The alignment prediction begins when the user provides an unaligned sentence pair.

## Alignment Document Frequency

> **Note:** This algorithm appears to be a hybrid of tf-idf.

The alignment document frequency algorithm is the foundation for most of the other algorithms.
This algorithm should be ran over the corpus indices (filtered and unfiltered),
and saved alignment indices (filtered and unfiltered).

> **Note:** It is important to compare the filtered and unfiltered frequency ratios.
This is done in other algorithms.

The algorithm proceeds as follows:

1. Generate n-grams for each sentence in the unaligned sentence pair.
1. Generate permutations of all `possible alignments` of n-grams between the sentences in the pair.
1. Filter the corpus/saved alignment indices to just those possible alignments within the unaligned sentence pair.

Perform the following calculations on the filtered and unfiltered corpus/saved alignment indices:

1. Calculate the frequency of each filtered *primary* n-gram over the corpus/saved alignment index.
1. Calculate the frequency of each filtered *secondary* n-gram over the corpus/saved alignment index.
1. Calculate the ratio of alignment frequency vs *primary* n-gram frequency.
1. Calculate the ratio of alignment frequency vs *secondary* n-gram frequency.

Pseudo Code Samples:

```js
// corpus frequency sums and ratios
primaryNgrams = ngram(unalignedSentencePair[0], 2);
secondaryNgrams = ngram(unalignedSentencePair[1], 3);
primaryIndex = {};
secondaryIndex = {};
primaryNgrams.forEach(primaryNgram => {
  secondaryNgrams.forEach(secondaryNgram => {
    primaryIndex[primaryNgram][secondaryNgram] = {
      frequency: primaryAlignmentFrequencyIndex[primaryNgram][secondaryNgram],
      corpusFrequency: objectSum(primaryAlignmentFrequencyIndex[primaryNgram]),
      corpusFrequencyRatio: this.frequency / this.corpusFrequency
    };
    secondaryIndex[secondaryNgram][primaryNgram] = {
      frequency: secondaryAlignmentFrequencyIndex[primaryNgram][secondaryNgram],
      corpusFrequency: objectSum(secondaryAlignmentFrequencyIndex[secondaryNgram]),
      corpusFrequencyRatio: this.frequency / this.corpusFrequency
    };
  });
});
// filtered frequency sums and ratios
Object.keys(primaryIndex).forEach(primaryNgram => {
  primaryIndex[primaryNgram][secondaryNgram].filteredFrequency = objectSumByAttribute(primaryIndex[primaryNgram], 'frequency');
  primaryIndex[primaryNgram][secondaryNgram].filteredFrequencyRatio = this.frequency / this.filteredFrequency;
});
Object.keys(secondaryIndex).forEach(secondaryNgram => {
  secondaryIndex[secondaryNgram][primaryNgram].filteredFrequency = objectSumByAttribute(secondaryIndex[secondaryNgram], 'frequency');
  secondaryIndex[primaryNgram][secondaryNgram].filteredFrequencyRatio = this.frequency / this.filteredFrequency;
});
```
