<template>
  <div>
    <v-alert
      :value="showMessage"
      :color="error ? 'pink lighten-1' : 'grey darken-3'"
      text
      class="mb-5">
      {{ error || 'Sending reset email...' }}
    </v-alert>
    <validation-observer
      v-if="!error"
      ref="form"
      @submit.prevent="$refs.form.handleSubmit(submit)"
      tag="form"
      novalidate>
      <validation-provider
        v-slot="{ errors }"
        name="email"
        rules="required|email">
        <v-text-field
          v-model="email"
          :error-messages="errors"
          type="email"
          label="Email"
          placeholder="Email"
          prepend-inner-icon="mdi-email-outline"
          outlined
          class="required" />
      </validation-provider>
      <div>
        <v-btn
          :disabled="showMessage"
          type="submit"
          color="blue-grey darken-4"
          depressed rounded block dark
          class="px-5">
          Send reset email
        </v-btn>
        <v-btn @click="$router.go(-1)" tag="a" text class="mt-7">
          <v-icon class="pr-2">mdi-arrow-left</v-icon>Back
        </v-btn>
      </div>
    </validation-observer>
    <v-btn v-else @click.stop="resetInput" text>
      Retry
    </v-btn>
  </div>
</template>

<script>
import { delay } from 'bluebird';
import { mapActions } from 'vuex';

const getDefaultData = () => ({
  email: '',
  showMessage: false,
  error: null
});

export default {
  data: () => getDefaultData(),
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
