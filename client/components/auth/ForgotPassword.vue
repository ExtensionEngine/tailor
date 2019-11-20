<template>
  <div>
    <v-alert
      :value="showMessage"
      :color="error ? 'secondary' : 'primary lighten-1'"
      class="mb-4 body-2">
      {{ error || 'Sending reset email...' }}
    </v-alert>
    <form v-if="!error" @submit.prevent="submit">
      <v-text-field
        v-model="email"
        v-validate="{ required: true, email: true }"
        :error-messages="vErrors.collect('email')"
        prepend-icon="mdi-email-outline"
        type="email"
        name="email"
        label="Please enter your email" />
      <v-btn
        :disabled="!isValid || showMessage"
        color="primary"
        outlined
        block
        type="submit">
        Send reset email
      </v-btn>
      <div class="options">
        <a @click="$router.go(-1)">Back</a>
      </div>
    </form>
    <a v-else @click.stop="resetInput">Retry</a>
  </div>
</template>

<script>
import { delay } from 'bluebird';
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';

const getDefaultData = () => ({
  email: '',
  showMessage: false,
  error: null
});

export default {
  mixins: [withValidation()],
  data: () => getDefaultData(),
  computed: {
    isValid: vm => vm.email && vm.vErrors.count() === 0
  },
  methods: {
    ...mapActions(['forgotPassword']),
    submit() {
      this.showMessage = true;
      Promise.all([this.forgotPassword({ email: this.email }), delay(3000)])
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'Something went wrong!'));
    },
    resetInput() {
      Object.assign(this, getDefaultData());
    }
  }
};
</script>

<style lang="scss" scoped>
.options {
  padding-top: 10px;

  a {
    display: inline-block;
    font-size: 14px;
    line-height: 14px;
    vertical-align: bottom;
    cursor: pointer;
  }
}
</style>
