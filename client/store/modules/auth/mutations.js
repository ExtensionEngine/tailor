export const login = (state, data) => {
  Object.assign(state, data);
};

export const logout = state => {
  Object.assign(state, { user: null, token: null });
};
