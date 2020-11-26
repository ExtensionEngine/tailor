export const setUser = (state, user) => {
  state.user = user;
};

export const resolveLoading = state => {
  state.loading.resolve();
};
