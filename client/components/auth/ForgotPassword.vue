<template>
  <div>
    <v-alert
      :value="showMessage"
      :color="error ? 'secondary' : 'primary lighten-1'"
      class="mb-4 body-2">
      {{ error || 'Sending reset email...' }}
    </v-alert>
    <form @submit.prevent="submit">
      <v-text-field
        v-validate="{ required: true, email: true }"
        v-model="email"
        :error-messages="vErrors.collect('email')"
        prepend-icon="mdi-email-outline"
        type="email"
        name="email"
        label="Please enter your email"/>
      <v-btn :disabled="!isValid" color="primary" outline block type="submit">
        Send reset email
      </v-btn>
      <div class="options">
        <a @click="$router.go(-1)">Back</a>
      </div>
    </form>
  </div>
</template>

<script>
import { delay } from 'bluebird';
import { mapActions } from 'vuex';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  data() {
    return {
      email: '',
      showMessage: false,
      error: null
    };
  },
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
