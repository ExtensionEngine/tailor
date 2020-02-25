import { getAcronym, getColor } from '@/utils/repository';

describe('Tests for utils/repository', () => {
  it('should return string of color when I call getColor with certain repository ', () => {
    const repository = {
      data: {
        color: '#someColor'
      }
    };
    expect(getColor(repository)).toEqual('#someColor');
    repository.data = undefined;
    expect(getColor(repository)).toEqual('#689F38');
    repository.id = 1;
    expect(getColor(repository)).toEqual('#FF5722');
  });
  it('should return a acronym when I call getAcronym function with a name', () => {
    expect(getAcronym('Hello World')).toEqual('HW');
    expect(getAcronym('hello My Dear world')).toEqual('HM');
  });
});
