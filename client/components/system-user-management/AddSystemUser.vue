<template>
  <form @submit.prevent="addUser" novalidate>
    <div class="row">
      <div class="col-md-7">
        <input
          v-validate="'email'"
          v-model="email"
          data-vv-delay="0"
          class="form-control"
          type="email"
          name="email"
          placeholder="Email"/>
        <div class="email-error">{{ vErrors.first('email') }}</div>
      </div>
      <div class="col-lg-4 col-md-3">
        <multiselect
          :value="role"
          :options="roles"
          :searchable="false"
          :allowEmpty="false"
          @input="newRole => (role = newRole)"
          placeholder="Select role"
          class="role-select"/>
      </div>
      <div class="col-lg-1 col-md-2">
        <button
          :disabled="isDisabled"
          type="submit"
          class="btn btn-primary btn-block">
          Invite
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { withValidation } from 'utils/validation';
import Multiselect from '../common/Select';

export default {
  name: 'add-system-user',
  mixins: [withValidation()],
  props: {
    defaultRole: { type: Object, required: true },
    roles: { type: Array, required: true }
  },
  data() {
    return { email: '', role: {} };
  },
  computed: {
    isDisabled() {
      return !this.email.trim().length || this.vErrors.has('email');
    }
  },
  methods: {
    addUser() {
      const { email, role } = this;
      this.$emit('add', email, { role: role.value });
      this.reset();
    },
    reset() {
      Object.assign(this, { email: '', role: this.defaultRole });
    }
  },
  mounted() {
    this.reset();
  },
  components: {
    Multiselect
  }
};
</script>

<style lang="scss" scoped>
.email-error {
  padding: 3px 0;
  color: #a94442;
  text-align: left;
}
</style>
