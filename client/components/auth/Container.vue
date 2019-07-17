<template>
  <div class="auth-container">
    <div class="auth-panel elevation-2">
      <div class="auth-header">
        <img :src="logo" alt="Logo" class="logo">
        <h1>{{ title }}</h1>
      </div>
      <div class="auth-body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    title: BRAND_CONFIG.TITLE,
    logo: BRAND_CONFIG.LOGO_FULL
  })
};
</script>

<style lang="scss">
$primary: #2e434c;

.auth-container {
  padding-top: 5%;
}

.auth-panel {
  width: 480px;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);

  h1 {
    margin: 0;
    color: white;
    font-size: 1.57rem;
    line-height: 18px;
  }

  .auth-header {
    padding-bottom: 20px;
    background-color: $primary;
    border-radius: 4px 4px 0 0;

    .logo {
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
    color: #e91e63;
    font-size: 16px;
    line-height: 16px;
  }
}

.logo {
  width: 5.36rem;
}
</style>
