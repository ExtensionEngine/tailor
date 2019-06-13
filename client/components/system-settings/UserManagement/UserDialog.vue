<template>
  <v-dialog v-hotkey="{ esc: close }" v-model="show" width="700">
    <v-form @submit.prevent="save">
      <v-card class="pa-3">
        <v-card-title class="headline pr-0">
          <span>{{ userData ? 'Edit' : 'Create' }} User</span>
          <v-spacer/>
          <v-btn
            v-if="!isNewUser"
            :disabled="isLoading"
            :loading="isLoading"
            @click="invite"
            color="blue-grey"
            outline>
            Reinvite
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-validate="{ required: true, email: true, 'unique-email': userData }"
            v-model="user.email"
            :error-messages="vErrors.collect('email')"
            label="E-mail"
            data-vv-name="email"
            class="mb-3"/>
          <v-select
            v-validate="'required'"
            v-model="user.role"
            :items="roles"
            :error-messages="vErrors.collect('role')"
            label="Role"
            data-vv-name="role"
            class="mb-3"/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn @click="close">Cancel</v-btn>
          <v-btn color="primary" type="submit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script>
import api from '@/api/user';
import cloneDeep from 'lodash/cloneDeep';
import humanize from 'humanize-string';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { role } from 'shared';
import { withValidation } from 'utils/validation';

const resetUser = () => {
  return {
    email: '',
    role: null
  };
};

export default {
  name: 'user-dialog',
  mixins: [withValidation()],
  props: {
    visible: { type: Boolean, default: false },
    userData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      user: resetUser(),
      isLoading: false
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(value) {
        if (!value) this.close();
      }
    },
    roles() {
      return map(role.getRoleValues('user'), it => ({ text: humanize(it), value: it }));
    },
    isNewUser() {
      return !this.user.id;
    }
  },
  methods: {
    close() {
      this.user = resetUser();
      this.$emit('update:visible', false);
    },
    save() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        const action = this.isNewUser ? 'create' : 'update';
        api.upsert(this.user).then(() => this.$emit(`${action}d`));
        this.close();
      });
    },
    invite() {
      this.isLoading = true;
      api.invite(this.user).finally(() => (this.isLoading = false));
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
      if (!isEmpty(this.userData)) this.user = cloneDeep(this.userData);
    }
  },
  mounted() {
    if (this.$validator.rules['unique-email']) return;
    this.$validator.extend('unique-email', {
      getMessage: field => `The ${field} is not unique.`,
      validate: (email, userData) => {
        if (userData && email === userData.email) return true;
        return api.fetch({ email })
          .then(({ total }) => ({ valid: !total }));
      }
    });
  }
};
</script>
