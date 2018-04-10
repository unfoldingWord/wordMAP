import Alignment from "../structures/Alignment";
import AlignmentIndex from "./AlignmentIndex";
import NgramIndex from "./NgramIndex";
import PermutationIndex from "./PermutationIndex";

/**
 * A collection of indexes for the saved alignments
 */
export default class SavedAlignmentsIndex {
  private permutationIndex: PermutationIndex;

  public get alignmentFrequency(): AlignmentIndex {
    return this.permutationIndex.alignmentFrequency;
  }

  public get sourceNgramFrequency(): NgramIndex {
    return this.permutationIndex.sourceNgramFrequency;
  }

  public get targetNgramFrequency(): NgramIndex {
    return this.permutationIndex.targetNgramFrequency;
  }

  constructor() {
    this.permutationIndex = new PermutationIndex();
  }

  public append(savedAlignments: Alignment[]) {
    this.permutationIndex.addAlignments(savedAlignments);
  }
}
