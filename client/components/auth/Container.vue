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
          <h1 class="ma-2 text-h5">{{ title }}</h1>
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
import Waves from '@/components/common/Waves.vue';

export default {
  name: 'auth-container',
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
  margin: 4% auto;
  width: 26rem;
  min-height: 41rem;
}

.auth-container .auth-panel.v-sheet {
  position: absolute;
  z-index: 1;
  border: 1px dashed #777;
  width: 100%;
  background: rgba($color: #e1e1e1, $alpha: 30%);

  .auth-header {
    padding-bottom: 0;

    .logo {
      max-width: 3.5rem;
    }
  }

  .auth-body {
    padding: 0.25rem 1.5rem 2rem;

    a {
      font-weight: 400;
      color: inherit;
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
