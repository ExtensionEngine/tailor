<template>
  <tailor-dialog v-model="show" header-icon="mdi-account">
    <template v-slot:header>{{ userData ? 'Edit' : 'Create' }} User</template>
    <template v-slot:body>
      <v-text-field
        v-model="user.email"
        v-validate="{ required: true, email: true, 'unique-email': userData }"
        :error-messages="vErrors.collect('email')"
        label="E-mail"
        placeholder="Enter email..."
        data-vv-name="email"
        outlined
        class="mb-3" />
      <v-text-field
        v-model="user.firstName"
        v-validate="'required|min:2|max:50'"
        :error-messages="vErrors.collect('firstName')"
        label="First name"
        placeholder="Enter first name..."
        data-vv-as="First name"
        data-vv-name="firstName"
        outlined
        class="mb-3" />
      <v-text-field
        v-model="user.lastName"
        v-validate="'required|min:2|max:50'"
        :error-messages="vErrors.collect('lastName')"
        label="Last name"
        placeholder="Enter last name..."
        data-vv-as="Last name"
        data-vv-name="lastName"
        outlined
        class="mb-3" />
      <v-select
        v-model="user.role"
        v-validate="{ required: true }"
        :items="roles"
        :error-messages="vErrors.collect('role')"
        label="Role"
        placeholder="Select role..."
        data-vv-name="role"
        outlined
        class="mb-3" />
    </template>
    <template v-slot:actions>
      <v-btn @click="close" text>Cancel</v-btn>
      <v-btn @click="save" color="primary" text>Save</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import api from '@/api/user';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { user as roles } from 'shared/role';
import TailorDialog from '@/components/common/TailorDialog';
import { withValidation } from 'utils/validation';

const resetUser = () => ({
  email: '',
  firstName: '',
  lastName: '',
  role: null
});

export default {
  name: 'user-dialog',
  mixins: [withValidation()],
  props: {
    visible: { type: Boolean, default: false },
    userData: { type: Object, default: () => ({}) }
  },
  data: () => ({ user: resetUser(), isLoading: false }),
  computed: {
    isNewUser: vm => !vm.user.id,
    roles: vm => map(roles, it => ({ text: humanize(it), value: it })),
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    }
  },
  methods: {
    close() {
      this.user = resetUser();
      this.$emit('update:visible', false);
    },
    async save() {
      const isValid = await this.$validator.validateAll();
      if (!isValid) return;
      const action = this.isNewUser ? 'create' : 'update';
      api.upsert(this.user).then(() => this.$emit(`${action}d`));
      this.close();
    },
    reinvite() {
      this.isLoading = true;
      api.reinvite(this.user).finally(() => (this.isLoading = false));
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.userData)) this.user = cloneDeep(this.userData);
    }
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list.v-sheet {
  text-align: left;
}
</style>
