export const login = (state, { user, token }) => {
  state.user = user;
  state.token = token;
};

export const logout = state => {
  Object.assign(state, { user: null, token: null });
};

export const setUser = (state, user) => {
  state.user = user;
};
