<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex md8 class="flex-container">
        <v-card class="card-container">
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
            <v-btn :disabled="!isValid" flat large>
              Submit
            </v-btn>
          </form>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="error" :timeout="timeout" color="red darken-2" left>
      An error has occurred!
      <v-btn @click="snackbar=false" dark flat>Close</v-btn>
    </v-snackbar>
  </v-container>
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
.card-container {
  width: 100%;
  padding: 30px 30px;
  text-align: left;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  .v-btn {
    display: block;
    margin: auto;
    padding: 8px 12px;
  }
}

.flex-container {
  margin: 0 20%;
}

h1 {
  margin-bottom: 30px;
}
</style>
