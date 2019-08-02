<template>
  <div class="auth-container">
    <div class="auth-panel elevation-2">
      <div class="auth-header">
        <img :src="logo" alt="Logo" class="logo">
        <h1>{{ title }}</h1>
      </div>
      <div class="auth-body">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    title: () => BRAND_CONFIG.TITLE,
    logo: () => BRAND_CONFIG.LOGO_FULL
  }
};
</script>

<style lang="scss">
.auth-container {
  padding-top: 5%;
}

.auth-panel {
  width: 480px;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;

  h1 {
    margin: 0;
    color: white;
    font-size: 22px;
  }

  .auth-header {
    padding-bottom: 20px;
    background-color: var(--v-primary-darken1);
    border-radius: 4px 4px 0 0;

    .logo {
      width: 75px;
      margin: 30px 0;
    }
  }

  .auth-body {
    padding: 25px 30px;

    a {
      color: inherit;
      font-weight: 400;
    }
  }

  .message {
    min-height: 16px;
    margin-bottom: 20px;
    color: var(--v-secondary-base);
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
