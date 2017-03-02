<template>
  <div>
    <div v-if="showMessage" class="well">
      <span>{{ message }}</span>
    </div>
    <div v-else>
      <form @submit.prevent="submit">
        <div class="form-group">
          <input
            v-model="email"
            class="form-control"
            type="email"
            placeholder="Please enter your email"/>
        </div>
        <button type="submit" class="btn btn-default btn-block">
          Send reset email
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { delay } from 'bluebird';
import { mapActions } from 'vuex-module';

export default {
  data() {
    return {
      email: '',
      message: 'Reset email sent',
      showMessage: false
    };
  },
  methods: {
    ...mapActions(['forgotPassword']),
    submit() {
      // TODO: Temp
      this.showMessage = true;
      this.forgotPassword({ email: this.email })
        .then(() => delay(1000))
        .then(() => this.$router.push('/'))
        .catch(() => (this.message = 'Error'));
    }
  }
};
</script>


<style lang="scss" scoped>
.well {
  font-size: 16px;
}
</style>
