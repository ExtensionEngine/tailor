<template>
  <div id="joditToolbar" class="tce-passage-toolbar"></div>
</template>

<style lang="scss" scoped>
.tce-passage-toolbar {
  padding-top: 5px;

  /deep/ .jodit_toolbar {
    border: none;
    background: #fff;
    box-shadow: none;

    .jodit_toolbar_btn a span span {
      display: inherit;
    }
  }
}
</style>
