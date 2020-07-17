import { getFormatDescription, getRevisionAcronym, isSameInstance } from '@/utils/revision';

describe('Tests for utils/revision', () => {
  beforeEach(() => jest.resetModules());
  it('should return true if its the same instance when I call isSameInstance with objects ', () => {
    const instance = { entity: 1, state: { id: 1 } };
    const secondInstance = { entity: 1, state: { id: 1 }, someOther: 1 };

    expect(isSameInstance(instance, {})).toEqual(false);
    expect(isSameInstance(instance, secondInstance)).toEqual(true);
  });

  it('should return specific string value when I call getRevisionAcronym ', () => {
    const rev = { entity: 'ACTIVITY', state: { type: 'some_fake_type' } };
    expect(getRevisionAcronym(rev)).toEqual('sf');
    expect(getRevisionAcronym({ })).toEqual('N/A');
    expect(getRevisionAcronym({ entity: 'REPOSITORY' })).toEqual('R');
    expect(getRevisionAcronym({ entity: 'CONTENT_ELEMENT' })).toEqual('CE');
  });
  it('should return specific string value when I call getRevisionColor ', () => {
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
    expect(getRevisionColor({ entity: 'TEACHING_ELEMENT' })).toEqual('#ccc');
    expect(mockedGetLevel).toHaveBeenCalled();
  });

  it('should return specific string value when I call getFormatDescription with REPOSITORY string ', () => {
    const rev = { entity: 'REPOSITORY' };
    expect(getFormatDescription(rev)).toEqual('Changed repository');

    rev.operation = 'CREATE';
    expect(getFormatDescription(rev)).toEqual('Created repository');

    rev.operation = 'REMOVE';
    expect(getFormatDescription(rev)).toEqual('Removed repository');

    rev.operation = 'UPDATE';
    expect(getFormatDescription(rev)).toEqual('Changed repository');
  });

  it('should return specific string value when I call getFormatDescription with CONTENT_ELEMENT string', () => {
    const mockedGetLevel = jest.fn();
    jest.mock('shared/activities', () => {
      return {
        getLevel: mockedGetLevel
      };
    });
    mockedGetLevel.mockImplementation(() => ({ label: 'fake_label', rootLevel: 'truthy' }));

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
    const { getFormatDescription } = require('@/utils/revision');
    expect(getFormatDescription(rev)).toEqual('Changed single choice element within deleted container');
    expect(getFormatDescription(rev, activity)).toEqual('Changed single choice element within surfing fake_label');

    rev.state.type = 'FAKE_STATE_TYPE';
    expect(getFormatDescription(rev, activity)).toEqual('Changed fake state type element within surfing fake_label');
  });

  it(' should return specific string value when I call getFormatDescription with ACTIVITY string', () => {
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
    mockedGetLevel.mockImplementation(() => ({ label: 'fake_label', rootLevel: 'truthy' }));
    rev.state.data.name = 'fake_name';
    expect(getFormatDescription(rev, activity)).toEqual('Changed fake_name fake label ');
    expect(getFormatDescription(rev, activity)).toEqual('Changed fake_name fake label ');
  });
});
