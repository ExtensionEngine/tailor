<template>
  <div class="input-group courses-search">
    <input type="search" class="form-control" placeholder="search..." />
    <div class="input-group-addon">
      <button class="btn btn-primary">
        <span class="fa fa-search"></span>
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'courses-search'
  };
</script>

<style lang="scss">
  .courses-search {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
    margin: 0 auto;
    max-width: 80%;
    width: 600px;

    .form-control {
      font-size: 18px;
      padding: 20px 5px;

      &:focus {
        box-shadow: none;
      }
    }

    .input-group-addon {
      border: 0;
      padding: 0;
      margin: 0;
      position: relative;
      width: 40px;

      button {
        padding: 0;
        margin: 0;
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
        height: 100%;
        width: 100%;
      }
    }
  }
</style>
