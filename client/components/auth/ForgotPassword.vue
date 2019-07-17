<template>
  <div>
    <div v-if="showMessage" class="well">
      <span>{{ message }}</span>
    </div>
    <div v-else>
      <form @submit.prevent="submit">
        <div class="form-group">
          <v-text-field
            v-validate="{ required: true, email: true }"
            v-model="email"
            :error-messages="vErrors.collect('email')"
            type="email"
            name="email"
            label="Please enter your email"/>
        </div>
        <v-btn :disabled="!isValid" color="primary" outline block type="submit">
          Send reset email
        </v-btn>
        <div class="options">
          <a @click="$router.go(-1)">Back</a>
        </div>
      </form>
    </div>
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
      message: 'Reset email sent',
      showMessage: false
    };
  },
  computed: {
    isValid() {
      return this.email && this.vErrors.count() === 0;
    }
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
