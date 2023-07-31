import { getEnvironment } from './env';

describe('getEnvironment', () => {
  it('should return local when running Jest', () => {
    expect(getEnvironment()).toBe('local');
  });
});
