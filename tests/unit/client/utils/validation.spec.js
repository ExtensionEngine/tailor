import { withValidation } from '@/utils/validation';

describe('Test for utils/validation', () => {
  it('when I call withValidation with inherit return certain objects', () => {
    expect(withValidation()).toEqual({ $_veeValidate: { validator: 'new' } });
    expect(withValidation({ inherit: true })).toEqual({ inject: ['$validator'] });
  });
});
