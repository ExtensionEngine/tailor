<template>
  <tailor-dialog
    :key="isVisible"
    v-model="isVisible"
    header-icon="mdi-account"
    persistent>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="primary darken-1"
        text>
        <v-icon class="mr-2">mdi-account-plus</v-icon>Add User
      </v-btn>
    </template>
    <template v-slot:header>Add user</template>
    <template v-slot:body>
      <validation-observer
        ref="form"
        @submit.prevent="$refs.form.handleSubmit(submit)"
        tag="form"
        novalidate>
        <validation-provider
          v-slot="{ errors }"
          name="email"
          rules="required|email">
          <v-combobox
            v-model="email"
            @update:search-input="fetchUsers"
            :items="suggestedUsers"
            :error-messages="errors"
            label="Email"
            placeholder="Enter email..."
            outlined />
        </validation-provider>
        <validation-provider
          v-slot="{ errors }"
          name="role"
          rules="required">
          <v-select
            v-model="role"
            :items="roles"
            :error-messages="errors"
            label="Role"
            placeholder="Role..."
            outlined />
        </validation-provider>
        <div class="d-flex justify-end">
          <v-btn @click="close" :disabled="isSaving" text>Cancel</v-btn>
          <v-btn
            :disabled="isSaving"
            type="submit"
            color="blue-grey darken-4"
            text>
            Add
          </v-btn>
        </div>
      </validation-observer>
    </template>
  </tailor-dialog>
</template>

<script>
import api from '@/api/user';
import { mapActions } from 'vuex';
import TailorDialog from '@/components/common/TailorDialog';
import throttle from 'lodash/throttle';

function getDefaultData(roles) {
  return { email: '', role: roles[0].value };
}

export default {
  name: 'add-user-dialog',
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return {
      isVisible: false,
      isSaving: false,
      suggestedUsers: [],
      ...getDefaultData(this.roles)
    };
  },
  methods: {
    ...mapActions('repository', ['upsertUser']),
    addUser() {
      setTimeout(async () => {
        this.isSaving = true;
        const { email, role, $route: { params: { repositoryId } } } = this;
        await this.upsertUser({ repositoryId, email, role });
        this.suggestedUsers = [];
        this.isSaving = false;
        this.close();
      });
    },
    fetchUsers: throttle(async function (filter) {
      if (!filter || (filter.length < 2)) {
        this.suggestedUsers = [];
        return;
      }
      const { items: users } = await api.fetch({ filter });
      this.suggestedUsers = users.map(it => it.email);
    }, 350),
    close() {
      this.isVisible = false;
      Object.assign(this, getDefaultData(this.roles));
    }
  },
  components: { TailorDialog }
};
</script>
