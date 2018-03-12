import NotImplemented from './errors/NotImplemented';
import Alignment from './Alignment';

/**
 * Represents a multi-lingual word alginment prediction engine.
 */
export default class Engine {

  appendCorpus() {
    throw new NotImplemented();
  }


  /**
   * Appends new saved allignments to the engine.
   * Adding saved alignments improves the quality of predictions.
   * @param {[]} savedAlignments - a list of saved allignments to append to the engine.
   */
  appendSavedAlignment(savedAlignments:Array<Alignment>) {
    throw new NotImplemented();
  }
}
