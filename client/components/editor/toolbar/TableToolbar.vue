<template>
  <div class="table-toolbar"></div>
  </div>
</template>

<script>
export default {
  name: 'table-toolbar',
  props: ['element']
};
</script>

<style lang="scss" scoped>
.table-toolbar {
  position: relative;
  width: 100%;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);
}
</style>
