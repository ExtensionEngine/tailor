<template>
  <div>
    <v-alert
      :value="showMessage"
      :color="error ? 'primary darken-2' : 'grey darken-3'"
      text
      class="mb-5">
      {{ error || 'Sending reset email...' }}
    </v-alert>
    <form v-if="!error" @submit.prevent="submit">
      <v-text-field
        v-model="email"
        v-validate="{ required: true, email: true }"
        :error-messages="vErrors.collect('email')"
        type="email"
        name="email"
        label="Email"
        placeholder="Email"
        prepend-inner-icon="mdi-email-outline"
        outlined />
      <div class="d-flex">
        <v-btn
          @click="$router.go(-1)"
          tag="a"
          text
          class="px-1">
          <v-icon>mdi-chevron-left</v-icon>
          Back
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!isValid || showMessage"
          type="submit"
          color="primary darken-1">
          Send reset email
        </v-btn>
      </div>
    </form>
    <v-btn v-else @click.stop="resetInput" text>
      Retry
    </v-btn>
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
      Promise.all([this.forgotPassword({ email: this.email }), delay(5000)])
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'Something went wrong!'));
    },
    resetInput() {
      Object.assign(this, getDefaultData());
    }
  }
};
</script>
