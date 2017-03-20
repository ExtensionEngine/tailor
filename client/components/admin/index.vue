<template>
  <div class="administration">
    <div class="row">
      <button @click="getIntegrationToken" class="btn btn-default">
        Generate token
      </button>
      <div v-if="token" class="alert alert-success" role="alert">{{ token }}</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';
export default {
  data() {
    return {
      token: ''
    };
  },
  methods: {
    ...mapActions(['generateIntegrationToken']),
    getIntegrationToken() {
      this.generateIntegrationToken().then(({ data }) => {
        this.token = data.token;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.administration {
  padding: 20px 100px 100px 100px;
  @media (min-width: 1700px) {
    padding: 20px 300px 100px 300px;
  }
}
.alert {
  margin-top: 10px;
}
</style>
