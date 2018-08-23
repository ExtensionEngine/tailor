<template>
  <form @submit.prevent="addUser" novalidate>
    <div class="row">
      <div
        :class="{ 'has-error': hasError('email') }"
        class="col-md-7">
        <input
          v-model="email"
          class="form-control"
          type="email"
          placeholder="Email"/>
        <div v-show="hasError('email')" class="text-danger input-error">
          {{ errorMessages.email }}
        </div>
      </div>
      <div class="col-md-3">
        <select v-model="role" class="form-control">
          <option
            v-for="role in roles"
            :key="role.value"
            :value="role.value">
            {{ role.title }}
          </option>
        </select>
      </div>
      <div class="col-md-2">
        <button type="submit" class="btn btn-primary btn-block">Invite</button>
      </div>
    </div>
  </form>
</template>

<script>
import emailRegex from 'email-regex';
import { mapActions } from 'vuex-module';
import yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().required().matches(emailRegex({ exact: true })).trim(),
  role: yup.string().required()
});

export default {
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return {
      email: '',
      role: this.roles[0].value,
      errors: [],
      errorMessages: { email: 'Please enter a valid email' }
    };
  },
  methods: {
    ...mapActions(['upsertUser'], 'course'),
    hasError(type) {
      return this.errors.indexOf(type) > -1;
    },
    addUser() {
      const { email, role } = this;
      const { courseId } = this.$route.params;
      this.validate({ email, role })
        .then(() => {
          this.email = '';
          this.upsertUser({ courseId, email, role });
        })
        .catch(err => {
          err.inner.forEach(it => this.errors.push(it.path));
        });
    },
    validate(user) {
      this.errors = [];
      return schema.validate(user, { abortEarly: false });
    }
  }
};
</script>

<style lang="scss" scoped>
form {
  padding-bottom: 40px;

  .input-error {
    padding-top: 5px;
    text-align: left;
  }
}
</style>
