<template>
  <div class="video-toolbar">
    <div class="form-inline">
      <div class="form-group">
        <input type="text" class="form-control" placeholder="url">
      </div>
      <button type="submit" class="btn btn-default btn-xs">Save</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'video-toolbar',
  props: ['asset', 'isFocused']
};
</script>

<style lang="scss" scoped>
.video-toolbar {
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 60px;
  padding: 7px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  input {
    min-width: 500px;
  }
}
</style>
