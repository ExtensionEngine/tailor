<template>
  <tailor-dialog
    v-model="isVisible"
    header-icon="mdi-account"
    persistent>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        color="primary darken-1"
        text>
        <v-icon x-small class="mr-1">mdi-plus</v-icon>
        <v-icon small class="mr-1">mdi-account</v-icon>Add User
      </v-btn>
    </template>
    <template v-slot:header>Add user</template>
    <template v-slot:body>
      <v-combobox
        v-model="email"
        v-validate="{ required: true, email: true }"
        @update:search-input="fetchUsers"
        :items="suggestedUsers"
        :error-messages="vErrors.collect('email')"
        label="Email"
        placeholder="Email..."
        data-vv-name="email"
        outlined />
      <v-select
        v-model="role"
        v-validate="'required'"
        :items="roles"
        :error-messages="vErrors.collect('role')"
        label="Role"
        placeholder="Role..."
        data-vv-name="role"
        outlined />
    </template>
    <template v-slot:actions>
      <v-btn @click="isVisible = false" :disabled="isSaving" text>Cancel</v-btn>
      <v-btn
        @click="addUser"
        color="primary darken-2"
        text>
        Add
      </v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import api from '@/api/user';
import { mapActions } from 'vuex';
import TailorDialog from '@/components/common/TailorDialog';
import throttle from 'lodash/throttle';
import { withValidation } from 'utils/validation';

export default {
  mixins: [withValidation()],
  props: {
    roles: { type: Array, required: true }
  },
  data() {
    return {
      isVisible: false,
      isSaving: false,
      email: '',
      suggestedUsers: [],
      role: this.roles[0].value
    };
  },
  methods: {
    ...mapActions('repository', ['upsertUser']),
    addUser() {
      setTimeout(async () => {
        const isValid = await this.$validator.validateAll();
        if (!isValid) return;
        this.isSaving = true;
        const { email, role, $route: { params: { repositoryId } } } = this;
        await this.upsertUser({ repositoryId, email, role });
        this.email = '';
        this.suggestedUsers = [];
        this.isVisible = false;
        this.isSaving = false;
      });
    },
    fetchUsers: throttle(function (filter) {
      if (filter && filter.length > 1) {
        return api.fetch({ filter }).then(({ items }) => {
          this.suggestedUsers = items.map(it => it.email);
        });
      }
      this.suggestedUsers = [];
    }, 350)
  },
  watch: {
    isVisible(val) {
      if (val) this.$validator.reset();
    }
  },
  components: { TailorDialog }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item__content {
  text-align: left;
}
</style>
