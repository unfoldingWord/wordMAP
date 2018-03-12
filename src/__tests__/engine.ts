import Engine from '../Engine';
import NotImplemented from '../errors/NotImplemented';

describe('append saved alignments', () => {
  it('is not implemented', () => {
    const engine = new Engine();
    expect(engine.appendSavedAlignment).toThrow(new NotImplemented());
  });
});
