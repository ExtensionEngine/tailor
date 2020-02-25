import { numeric } from '@/utils/paramsParser';
describe('Test form utils/paramsParser', () => {
  it('should map values when I call numeric function  with route it', () => {
    const route = {
      params: {
        key1: 1,
        key2: 2,
        kez3: 4
      }
    };
    expect(numeric(route)).toEqual({ key1: 1, key2: 2, kez3: 4 });
  });
});
