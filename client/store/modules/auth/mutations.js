export const setUser = (state, user) => {
  state.user = user;
};

export const setAuth = (state, { user, authData }) => {
  state.user = user;
  state.authData = authData;
};

export const resetAuth = state => {
  state.user = null;
  state.authData = null;
};
