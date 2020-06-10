<template>
  <tailor-dialog v-model="show" header-icon="mdi-account">
    <template v-slot:header>{{ userData ? 'Edit' : 'Create' }} User</template>
    <template v-slot:body>
      <validation-observer ref="form">
        <validation-provider
          v-slot="{ errors }"
          name="email"
          :rules="{ required: true, email: true, unique_email: { userData: userData } }">
          <v-text-field
            v-model="user.email"
            :error-messages="errors"
            :disabled="!isNewUser"
            label="E-mail"
            placeholder="Enter email..."
            data-vv-name="email"
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="firstName"
          rules="required|min:2|max:50">
          <v-text-field
            v-model="user.firstName"
            :error-messages="errors"
            label="First name"
            placeholder="Enter first name..."
            data-vv-as="First name"
            data-vv-name="firstName"
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="lastName"
          rules="required|min:2|max:50">
          <v-text-field
            v-model="user.lastName"
            :error-messages="errors"
            label="Last name"
            placeholder="Enter last name..."
            data-vv-as="Last name"
            data-vv-name="lastName"
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="userRole"
          rules="required">
          <v-select
            v-model="user.role"
            :error-messages="errors"
            :items="roles"
            label="Role"
            placeholder="Select role..."
            data-vv-name="role"
            outlined
            class="mb-3" />
        </validation-provider>
      </validation-observer>
    </template>
    <template v-slot:actions>
      <v-btn @click="close" text>Cancel</v-btn>
      <v-btn @click="save" color="blue-grey darken-4" text>Save</v-btn>
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

const resetUser = () => ({
  email: '',
  firstName: '',
  lastName: '',
  role: null
});

export default {
  name: 'user-dialog',
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
      const isValid = await this.$refs.form.validate();
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
      if (this.$refs.form) this.$refs.form.reset();
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
