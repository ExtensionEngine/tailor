export const setAuth = (state, { user, authStrategy }) => {
  state.user = user;
  state.strategy = authStrategy;
};

export const resetAuth = state => {
  state.user = null;
  state.strategy = null;
};
