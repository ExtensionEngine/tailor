import { withValidation } from '@/utils/validation';

describe('Test for utils/validation', () => {
  it('should return certain objects when I call withValidation with inherit', () => {
    expect(withValidation()).toEqual({ $_veeValidate: { validator: 'new' } });
    expect(withValidation({ inherit: true })).toEqual({ inject: ['$validator'] });
  });
});
