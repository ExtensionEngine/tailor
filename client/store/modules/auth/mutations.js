export const login = (state, user) => {
  state.user = user;
};

export const logout = state => {
  state.user = null;
};
