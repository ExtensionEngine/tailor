<template>
  <div class="auth-container">
    <div class="auth-panel">
      <div class="auth-header">
        <img :src="logo" alt="Logo"/>
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
  data() {
    return {
      title: BRAND_CONFIG.TITLE,
      logo: BRAND_CONFIG.LOGO_FULL
    };
  }
};
</script>

<style lang="scss">
.auth-container {
  padding-top: 5%;
}

.auth-panel {
  width: 440px;
  margin: auto;
  background-color: #fff;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.25,0.8,0.25,1);

  &:hover {
    box-shadow: 0 6px 10px rgba(0,0,0,0.20), 0 6px 8px rgba(0,0,0,0.22);
  }

  img {
    width: 130px;
    margin: 15px 0 10px;
  }

  h1 {
    margin: 0;
    color: white;
    font-size: 22px;
    line-height: 18px;
  }

  .auth-header {
    padding-bottom: 20px;
    background: linear-gradient(90deg, $brandColor 65%, $altBrandColor);
    border-radius: 4px 4px 0 0;
  }

  .auth-body {
    padding: 20px 30px;

    a {
      color: inherit;
      font-weight: 500;
    }
  }

  .message {
    min-height: 16px;
    margin-bottom: 20px;
    color: #da126d;
    font-size: 16px;
    line-height: 16px;
  }
}
</style>
