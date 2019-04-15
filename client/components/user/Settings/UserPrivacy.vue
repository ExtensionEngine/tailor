<template>
  <div class="privacy-container">
    <h1 class="title">Change password</h1>
    <form @submit.prevent="submit">
      <div :class="{ 'has-error': vErrors.has('password') }" class="form-group">
        <input
          v-validate="{ rules: { required: true, min: 6, alphanumerical: true } }"
          ref="password"
          v-model="password"
          class="form-control"
          name="password"
          type="password"
          placeholder="Password"/>
        <span class="help-block">{{ vErrors.first('password') }}</span>
      </div>
      <div
        :class="{ 'has-error': vErrors.has('passwordConfirmation') }"
        class="form-group">
        <input
          v-validate="{ rules: { required: true, confirmed: 'password' } }"
          data-vv-as="password"
          class="form-control"
          name="passwordConfirmation"
          type="password"
          placeholder="Please re-enter your password"/>
        <span class="help-block">
          {{ vErrors.first('passwordConfirmation') }}
        </span>
      </div>
      <button
        :disabled="!isValid"
        class="btn btn-default btn-block"
        type="submit">
        Submit
      </button>
    </form>
    <v-snackbar v-model="error" :timeout="timeout" :color="dangerColor" left>
      An error has occurred!
      <v-btn @click="error=false" dark flat>Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  data() {
    return {
      error: false,
      timeout: 2500,
      dangerColor: '#d9534f',
      password: ''
    };
  },
  computed: {
    ...mapGetters(['user']),
    isValid() {
      return this.password && this.vErrors.count() === 0;
    }
  },
  methods: {
    ...mapActions(['changePassword']),
    submit() {
      const UserId = this.user.id;
      this.$validator.validateAll().then(result => {
        return this.changePassword({ password: this.password, UserId })
          .then(() => this.$router.push({ name: 'general' }))
          .catch(() => (this.error = true));
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.privacy-container {
  width: 50%;
  margin: 30px;
  padding: 30px 30px;
  float: left;
  text-align: left;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  .meta-input {
    margin: 10px 0;
  }

  .form-actions {
    min-height: 36px;

    .v-btn {
      width: 150px;
      height: 40px;
      padding: 8px 12px;
      float: right;
      color: #337ab7;
    }
  }
}

h1 {
  margin-bottom: 30px;
}
</style>
