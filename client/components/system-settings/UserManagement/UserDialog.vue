<template>
  <tailor-dialog v-model="show" header-icon="mdi-account">
    <template v-slot:header>{{ userData ? "Edit" : "Create" }} User</template>
    <template v-slot:body>
      <v-btn
        @click="reinvite"
        :loading="isReinviting"
        :disabled="isReinviting"
        color="primary darken-2"
        text
        class="d-block ml-auto mb-6">
        Reinvite
      </v-btn>
      <validation-observer
        ref="form"
        v-slot="{ invalid, pristine }"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form">
        <validation-provider
          v-slot="{ errors }"
          name="email"
          :rules="{ required: true, email: true, unique_email: { userData } }">
          <v-text-field
            v-model="user.email"
            :error-messages="errors"
            :disabled="!isNewUser"
            label="E-mail"
            placeholder="Enter email..."
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="first name"
          rules="required|min:2|max:50">
          <v-text-field
            v-model="user.firstName"
            :error-messages="errors"
            label="First name"
            placeholder="Enter first name..."
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="last name"
          rules="required|min:2|max:50">
          <v-text-field
            v-model="user.lastName"
            :error-messages="errors"
            label="Last name"
            placeholder="Enter last name..."
            outlined
            class="mb-3" />
        </validation-provider>
        <validation-provider v-slot="{ errors }" name="role" rules="required">
          <v-select
            v-model="user.role"
            :error-messages="errors"
            :items="roles"
            label="Role"
            placeholder="Select role..."
            outlined
            class="mb-3" />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn @click="close" text>Cancel</v-btn>
          <v-btn
            type="submit"
            :disabled="invalid || pristine"
            color="blue-grey darken-4" text>
            Save
          </v-btn>
        </div>
      </validation-observer>
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
  data: () => ({ user: resetUser(), isReinviting: false }),
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
    async submit() {
      const action = this.isNewUser ? 'create' : 'update';
      api.upsert(this.user).then(() => this.$emit(`${action}d`));
      this.close();
    },
    reinvite() {
      this.isReinviting = true;
      api.reinvite(this.user).finally(() => (this.isReinviting = false));
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.$nextTick(() => this.$refs.form.reset());
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
