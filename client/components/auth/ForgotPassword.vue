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
          v-if="!showMessage"
          type="submit"
          color="primary darken-4"
          block depressed rounded dark>
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
import { auth as api } from '@/api';
import { delay } from 'bluebird';

const getDefaultData = () => ({
  email: '',
  showMessage: false,
  error: null
});

export default {
  data: () => getDefaultData(),
  methods: {
    submit() {
      this.showMessage = true;
      Promise.all([api.forgotPassword(this.email), delay(5000)])
        .then(() => this.$router.push('/'))
        .catch(() => (this.error = 'Something went wrong!'));
    },
    resetInput() {
      Object.assign(this, getDefaultData());
    }
  }
};
</script>
