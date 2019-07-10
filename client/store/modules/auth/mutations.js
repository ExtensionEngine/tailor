export const login = (state, user) => {
  state.user = user;
};

export const logout = state => {
  state.user = null;
};

export const setUser = (state, user) => {
  state.user = user;
};
