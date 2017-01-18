<template>
  <form class="user-invite" @submit.prevent="inviteUser" novalidate>
    <div class="row">
      <div class="col-md-7 form-group" :class="{ 'has-error': hasError('email') }">
        <input
          v-model="email"
          type="email"
          class="form-control"
          placeholder="email"/>
          <div v-show="hasError('email')" class="text-danger input-error">
            {{ errorMessages.email }}
          </div>
      </div>
      <div class="col-md-3 form-group">
        <select v-model="role" class="form-control select-role">
          <option v-for="role in roles" :value="role.value">
            {{ role.render }}
          </option>
        </select>
      </div>
      <div class="col-md-2 form-submit">
        <button type="submit" class="btn btn-primary">Invite</button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex-module';
import yup from 'yup';

const emailPattern = /^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)$/;
const schema = yup.object().shape({
  email: yup.string().required().matches(emailPattern).trim(),
  role: yup.string().required()
});

export default {
  name: 'user-invite',
  data() {
    return {
      email: '',
      role: this.roles[0].value,
      errors: [],
      errorMessages: {
        email: 'Please enter a valid email'
      }
    };
  },
  methods: {
    ...mapActions(['invite'], 'course'),
    hasError(type) {
      return this.errors.indexOf(type) > -1;
    },
    inviteUser() {
      const email = this.email;
      const role = this.role;
      const courseKey = this.$route.params.courseKey;

      this.errors = [];
      this.validate({ email, role })
        .then(() => {
          this.email = '';
          this.invite({ email, role, courseKey });
        })
        .catch(err => {
          err.inner.forEach(it => this.errors.push(it.path));
        });
    },
    validate(userData) {
      return schema.validate(userData, { abortEarly: false });
    }
  },
  props: {
    roles: {
      type: Array,
      required: true
    }
  }
};
</script>

<style lang="scss">
.user-invite {
  padding-bottom: 10px;

  .btn {
    text-align: center;
    width: 150px;
  }

  .form-group {
    height: 60px;
    margin: 0;
  }

  .form-submit {
    text-align: left;
  }

  .select-role {
    option {
      text-align: center;
    }
  }

  .input-error {
    padding-top: 5px;
    text-align: left;
  }
}
</style>
