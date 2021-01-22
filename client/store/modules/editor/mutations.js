const togglePublishDiff = (state, showPublishDiff) => {
  state.showPublishDiff = showPublishDiff ?? !state.showPublishDiff;
};

export { togglePublishDiff };
