export const login = (state, user) => {
  state.user = user;
  console.log(state);
};

export const logout = state => {
  state.user = null;
};
