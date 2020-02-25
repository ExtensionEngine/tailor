import { defaults, errorProcessor, schemas } from '@/utils/assessment';

jest.mock('cuid');

const mockCuid = (number = '123456') => require('cuid').mockImplementation(() => number);

describe('Test form utils/assessment', () => {
  it('should return a string value if errorProcessor is called ', () => {
    const error = {
      value: {
        type: 'DD',
        fakePath: { fakePath1: { fakePath2: { key: 'Some' } } },
        fakePathSecond: { fakePath1: { fakePath2: { key: 'Some' } } }
      },
      key: 'errorKey',
      inner: [
        { path: 'fakePath.fakePath1.fakePath2.value' },
        { path: 'fakePathSecond.fakePath1.fakePath2.value' },
        { path: 'singlePath' }
      ]
    };

    expect(errorProcessor(error)).toEqual(['fakePathSome', 'fakePathSecondSome', 'singlePath']);
    error.value.type = 'NOTDD';
    expect(errorProcessor(error)).toEqual(['fakePath.fakePath1.fakePath2.value', 'fakePathSecond.fakePath1.fakePath2.value', 'singlePath']);

    error.value.type = 'DD';
    error.inner.push({ path: 'more.paths.noValueAtEnd' });
    expect(errorProcessor(error)).toEqual(['fakePathSome', 'fakePathSecondSome', 'singlePath', undefined]);
  });
  it('should test the outputs of defaults object functions', () => {
    mockCuid();
    expect(defaults.MC()).toEqual({ answers: ['', '', ''], correct: [], hint: '', question: [], type: 'MC' });
    expect(defaults.NR()).toEqual({ correct: [''], hint: '', prefixes: [''], question: [], suffixes: [''], type: 'NR' });
    expect(defaults.SC()).toEqual({ answers: ['', ''], correct: '', hint: '', question: [], type: 'SC' });
    expect(defaults.TR()).toEqual({ correct: '', hint: '', question: [], type: 'TR' });
    expect(defaults.TF()).toEqual({ correct: null, hint: '', question: [], type: 'TF' });
    expect(defaults.FB()).toEqual({ correct: [], hint: '', question: [], type: 'FB' });
    expect(defaults.MQ()).toEqual({
      correct: {
        123456: '123456'
      },
      headings: {
        premise: 'Premise',
        response: 'Response'
      },
      hint: '',
      premises: [
        {
          key: '123456',
          value: ''
        },
        {
          key: '123456',
          value: ''
        }
      ],
      question: [

      ],
      responses: [
        {
          key: '123456',
          value: ''
        },
        {
          key: '123456',
          value: ''
        }
      ],
      type: 'MQ'
    });
    expect(defaults.DD()).toEqual({
      answers: {
        123456: ''
      },
      correct: {
        123456: [
          '123456'
        ]
      },
      groups: {
        123456: ''
      },
      hint: '',
      question: [

      ],
      type: 'DD'
    });
  });
  it.skip('should test the output of schemas object', () => {
    // See the need for testing this, maybe snapshots?
    expect(schemas.MC).toEqual(1);
    expect(schemas.NR).toEqual(1);
    expect(schemas.SC).toEqual(1);
    expect(schemas.TR).toEqual(1);
    expect(schemas.TF).toEqual(1);
    expect(schemas.FB).toEqual(1);
    expect(schemas.MQ).toEqual(1);
  });
});
