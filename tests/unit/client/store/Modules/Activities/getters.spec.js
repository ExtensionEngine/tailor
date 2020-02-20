
import * as mockUtils from 'utils/activity';
import { activities, calculateInsertPosition, getAncestors, getDescendants, getLineage, getParent } from '@/client/store/modules/activities/getters.js';
import { fakeCommentModel, fakeItems } from '../../data/fakeCommentData';

describe('Test for modules/activities/getters', () => {
  const fillState = (items = fakeItems()) => ({ items });
  const mockDeepChildren = jest.spyOn(mockUtils, 'getDescendants');
  const mockedGetAncestors = jest.spyOn(mockUtils, 'getAncestors');
  const mockedCalculatePosition = jest.spyOn(mockUtils, 'getAncestors');

  beforeEach(() => jest.resetAllMocks());

  it('should test if activities function returns all the state items', () => {
    const state = fillState();
    expect(activities(state)).toEqual(fakeItems());
  });
  it('should get the parent from child by id ', () => {
    const returnFunction = getParent(fillState());
    expect(returnFunction('idThatDoesntExist')).toEqual(null);
    // Fetch the item that has an id 69 and find its parent in this case the
    // the parent has an id of 63
    expect(returnFunction(69).id).toEqual(63);
  });
  it('should pass the exact parameters to a function returned by getDescendants', () => {
    const state = fillState();
    const activity = 1;
    const returnFunction = getDescendants(state);
    returnFunction(activity);
    expect(mockDeepChildren).toHaveBeenCalledWith(state.items, activity);
  });
  it('should pass the exact parameters to return function getAncestors', () => {
    const state = fillState();
    const activity = 1;
    const returnFunction = getAncestors(state);
    returnFunction(activity);
    expect(mockedGetAncestors).toHaveBeenCalledWith(state.items, activity);
  });

  it('should return a function that in itself returns all the ancestors and descendants', () => {
    const state = fillState();
    const activity = 1;
    const returnFunction = getLineage(state);

    mockedGetAncestors.mockReturnValue([1]);
    mockDeepChildren.mockReturnValue([2]);
    returnFunction(activity);
    expect(returnFunction(activity)).toEqual([1, 2]);
  });
  it('should calculateInsertPosition and return a function', () => {
    const state = fillState();
    const returnFuntion = calculateInsertPosition(state);
    const activity = {
      parentId: 63,
      type: 'INTRO'
    };
    let anchor = {
      id: 69,
      type: 'INTRO'
    };
    expect(returnFuntion(activity, anchor)).toEqual(0.5);

    anchor.id = 80;
    expect(returnFuntion(activity, anchor)).toEqual(2);
    anchor.id = 200;
    expect(returnFuntion(activity, anchor)).toEqual(0.5);
    anchor = undefined;
    expect(returnFuntion(activity, anchor)).toEqual(0.5);
  });
});
