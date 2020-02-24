import { getFormatDescription, getRevisionAcronym, isSameInstance } from '@/utils/revision';

describe('Tests for utils/revision', () => {
  beforeEach(() => jest.resetModules());
  it('when I call isSameInstance with objects it should return true if its the same instance ', () => {
    const instance = { entity: 1, state: { id: 1 } };
    const secondInstance = { entity: 1, state: { id: 1 }, someOther: 1 };

    expect(isSameInstance(instance, {})).toEqual(false);
    expect(isSameInstance(instance, secondInstance)).toEqual(true);
  });

  it('when I call getRevisionAcronym it should return specific string value', () => {
    const rev = { entity: 'ACTIVITY', state: { type: 'some_fake_type' } };
    expect(getRevisionAcronym(rev)).toEqual('sf');
    expect(getRevisionAcronym({ })).toEqual('N/A');
    expect(getRevisionAcronym({ entity: 'REPOSITORY' })).toEqual('R');
    expect(getRevisionAcronym({ entity: 'CONTENT_ELEMENT' })).toEqual('CE');
  });
  it('when I call getRevisionColor it should return specific string value', () => {
    const mockedGetLevel = jest.fn();
    jest.mock('shared/activities', () => {
      return {
        getLevel: mockedGetLevel
      };
    });
    const { getRevisionColor } = require('@/utils/revision');

    mockedGetLevel.mockImplementation(() => ({ color: '#color_in_schema' }));
    const rev = { entity: 'ACTIVITY', state: { type: 'DEFAULT_SCHEMA' } };
    expect(getRevisionColor(rev)).toEqual('#color_in_schema');
    mockedGetLevel.mockImplementation(() => false);
    expect(getRevisionColor(rev)).toEqual('#ccc');
    expect(getRevisionColor({ })).toEqual('#ccc');
    expect(getRevisionColor({ entity: 'REPOSITORY' })).toEqual('#00BCD4');
    expect(getRevisionColor({ entity: 'TEACHING_ELEMENT' })).toEqual('#FF5722');
    expect(mockedGetLevel).toHaveBeenCalled();
  });

  it('when I call getFormatDescription with REPOSITORY string it should return specific string value', () => {
    const rev = { entity: 'REPOSITORY' };
    expect(getFormatDescription(rev)).toEqual('Changed repository');

    rev.operation = 'CREATE';
    expect(getFormatDescription(rev)).toEqual('Created repository');

    rev.operation = 'REMOVE';
    expect(getFormatDescription(rev)).toEqual('Removed repository');

    rev.operation = 'UPDATE';
    expect(getFormatDescription(rev)).toEqual('Changed repository');
  });

  it('when I call getFormatDescription with CONTENT_ELEMENT string it should return specific string value', () => {
    const rev = {
      entity: 'CONTENT_ELEMENT',
      state: { type: 'ASSESSMENT', data: { type: 'SC' } },
      operation: 'UPDATE'
    };
    const activity = {
      data: {
        name: 'surfing'
      },
      label: 'fake_label'
    };
    expect(getFormatDescription(rev)).toEqual('Changed single choice element');
    expect(getFormatDescription(rev, activity)).toEqual('Changed single choice element within \'surfing\' fake label');

    rev.state.type = 'FAKE_STATE_TYPE';
    expect(getFormatDescription(rev, activity)).toEqual('Changed fake state type element within \'surfing\' fake label');
  });

  it('when I call getFormatDescription with ACTIVITY string it should return specific string value', () => {
    const mockedGetLevel = jest.fn();
    jest.mock('shared/activities', () => {
      return {
        getLevel: mockedGetLevel
      };
    });
    const rev = {
      entity: 'ACTIVITY',
      state: { type: 'ASSESSMENT', data: { type: 'SC' } },
      operation: 'UPDATE'
    };
    const activity = {
      data: {
        name: 'surfing'
      },
      label: 'fake_label'
    };

    const { getFormatDescription } = require('@/utils/revision');
    expect(getFormatDescription(rev)).toEqual('Changed assessment');

    rev.state.data.name = 'fake_name';
    expect(getFormatDescription(rev, activity)).toEqual('Changed \'fake_name\' assessment within \'surfing\' fake label');
    mockedGetLevel.mockImplementation(() => ({ label: 'fake_label' }));
    expect(getFormatDescription(rev, activity)).toEqual('Changed \'fake_name\' fake label within \'surfing\' fake label');
  });
});
