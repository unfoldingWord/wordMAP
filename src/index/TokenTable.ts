import Token from "../structures/Token";

/**
 * A lookup table to find tokens associated with a key
 */
export default interface TokenTable {
  [key: string]: Set<Token>;
}
