/**
 * A generic exception for code that has not yet been implemented.
 */
export default class NotImplemented extends Error {
  constructor() {
    super(`This code block has not yet been implemented. Maybe you should finish it!`);
    this.name = 'NotImplemented';
  }
}
