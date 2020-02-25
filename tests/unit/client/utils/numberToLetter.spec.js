import numberToLetter from '@/utils/numberToLetter';

describe('Test for numberToLetters', () => {
  it('should return a string of letters when I call numberToLetter', () => {
    expect(numberToLetter(1234)).toEqual('AUM');
    expect(numberToLetter(123409986534125368319)).toEqual('AWSENCEUXERNEOA');
  });
});
