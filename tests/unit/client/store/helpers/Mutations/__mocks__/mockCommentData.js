export const mockItems = () => {
  return ({
    ck6i0fsmg00003h5wqtirijkm: {
      id: 63,
      uid: '570149c9-52e1-46b9-8946-a55bdd636c9b',
      type: 'DEFAULT_SCHEMA/COMPETENCY',
      position: 1,
      data: {
        name: 'stolar'
      },
      refs: {},
      detached: false,
      publishedAt: null,
      createdAt: '2020-02-05T17:44:29.055Z',
      updatedAt: '2020-02-05T17:44:29.055Z',
      deletedAt: null,
      repositoryId: 1,
      parentId: null,
      _cid: 'ck6i0fsmg00003h5wqtirijkm'
    },
    ck6i0fsmg00013h5w7hmh3r3a: {
      id: 69,
      uid: '9de9f40f-1a40-46fd-9ac6-3773cfea1e82',
      type: 'INTRO',
      position: 1,
      data: {},
      refs: {},
      detached: false,
      publishedAt: null,
      createdAt: '2020-02-05T21:02:07.902Z',
      updatedAt: '2020-02-05T21:02:07.902Z',
      deletedAt: null,
      repositoryId: 1,
      parentId: 63,
      _cid: 'ck6i0fsmg00013h5w7hmh3r3a'
    },
    ck6i0fsmg00023h5wqbtdj1e1: {
      id: 80,
      uid: '25f656bb-990f-4ec1-978b-c5ff868ad11c',
      type: 'DEFAULT_SCHEMA/OBJECTIVE',
      position: 1,
      data: {
        name: 'prvi'
      },
      refs: {},
      detached: false,
      publishedAt: null,
      createdAt: '2020-02-06T13:27:21.611Z',
      updatedAt: '2020-02-06T13:27:21.611Z',
      deletedAt: null,
      repositoryId: 1,
      parentId: 63,
      _cid: 'ck6i0fsmg00023h5wqbtdj1e1'
    }
  });
};
export const mockCommentState = () => ({ items: {}, $internals: {}, $apiUrl: '/repositories/1/activities' });
export const mockAddCommentModel = (_cid = 'ck6i4v82h00063h5wvhr7u0uc') => ({
  content: 'Here is the comment text',
  author: {
    id: 1,
    email: 'admin@extensionengine.com',
    role: 'ADMIN',
    firstName: null,
    lastName: null,
    fullName: null,
    label: 'admin@extensionengine.com',
    imgUrl: 'https://s.gravatar.com/avatar/b29ca01752b9c16029d61c1c8c8094cc?size=130&default=identicon',
    createdAt: '2020-02-03T14:44:03.815Z',
    updatedAt: '2020-02-03T14:44:03.815Z',
    deletedAt: null
  },
  activityId: 63,
  createdAt: 1581440542361,
  updatedAt: 1581440542361,
  _cid: _cid,
  _synced: false,
  _version: 1581440542361
});
