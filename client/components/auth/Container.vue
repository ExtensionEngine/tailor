<template>
  <div class="auth-container">
    <div class="auth-panel-container">
      <v-sheet elevation="0" rounded class="auth-panel">
        <div class="auth-header py-9">
          <v-avatar size="88" color="primary darken-4" class="elevation-4">
            <div class="pt-1">
              <img :src="logo" alt="Logo" class="logo">
            </div>
          </v-avatar>
          <h1 class="ma-2 headline">{{ title }}</h1>
        </div>
        <div class="auth-body">
          <router-view />
        </div>
      </v-sheet>
    </div>
    <div class="waves-container">
      <waves height="15rem" color="31,58,84" slow />
    </div>
  </div>
</template>

<script>
import Waves from '@/components/common/Waves';

export default {
  computed: {
    title: () => BRAND_CONFIG.TITLE,
    logo: () => BRAND_CONFIG.LOGO_FULL
  },
  components: { Waves }
};
</script>

<style lang="scss">
.auth-container {
  background: #f1f1f1;
}

.auth-container .auth-panel-container {
  position: relative;
  width: 26rem;
  min-height: 41rem;
  margin: 4% auto;
}

.auth-container .auth-panel.v-sheet {
  position: absolute;
  width: 100%;
  background: rgba($color: #e1e1e1, $alpha: 0.3);
  border: 1px dashed #777;
  z-index: 1;

  .auth-header {
    padding-bottom: 0;

    .logo {
      max-width: 3.5rem;
    }
  }

  .auth-body {
    padding: 0.25rem 1.5rem 2rem;

    a {
      color: inherit;
      font-weight: 400;
    }
  }
}

.auth-container .waves-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 15rem;
}
</style>
