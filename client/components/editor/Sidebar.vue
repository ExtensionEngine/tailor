<template>
  <div class="sidebar">
    <ul>
      <!-- Placeholders -->
      <li>
        <a @click="handleClick">
          <span class="fa fa-lg fa-fast-backward"></span>
        </a>
      </li>

      <li>
        <a @click="handleClick">
          <span class="fa fa-lg fa-play"></span>
        </a>
      </li>

      <li>
        <a @click="handleClick">
          <span class="fa fa-lg fa-pause"></span>
        </a>
      </li>

      <li>
        <a @click="handleClick">
          <span class="fa fa-lg fa-fast-forward"></span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'editor-sidebar',

    methods: {
      handleClick() {
        console.log('clicked');
      }
    }
  };
</script>

<style lang="scss">
  .sidebar {
    background-color: #fff;
    border-right: 1px solid #eee;
    box-shadow: 0 1px 4px rgba(0, 0, 0, .74);
    bottom: 0;
    display: block;
    padding: 0;
    position: fixed;
    top: 50px;
    width: 80px;
    z-index: 1;

    .row:before {
      display: inline;
    }

    ul {
      list-style: none;
      padding: 0;

      li > a {
        color: #000;
        cursor: pointer;
        display: block;
        height: 100%;
        padding: 20px 10px;
        width: 100%;

        &:hover {
          background-color: #eee;
        }
      }
    }
  }
</style>
