/**
 * A generic exception for code that has not yet been implemented.
 */
export default class NotImplemented extends Error {
  constructor() {
    super(`Not implemented`);
    this.name = 'NotImplemented';
  }
}
