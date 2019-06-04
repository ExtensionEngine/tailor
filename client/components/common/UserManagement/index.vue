<template>
  <v-card class="settings elevation-2">
    <div v-if="isInitialLoad" class="loading-spinner">
      <v-progress-circular color="primary" indeterminate/>
    </div>
    <template v-else>
      <add-user
        :roles="roles"
        :isLoading="isAddLoad"
        @upsert="(...data) => upsert(loadingTypes.ADD, data)"/>
      <user-list
        v-bind="$attrs"
        :users="users"
        :roles="roles"
        :isLoading="isEditLoad"
        @upsert="(...data) => upsert(loadingTypes.EDIT, data)"
        @remove="data => $emit('remove', loadingTypes.EDIT, data)"/>
    </template>
  </v-card>
</template>

<script>
import AddUser from './AddUser';
import UserList from './UserList';

const LOADING_TYPES = { INIT: 'INIT', ADD: 'ADD', EDIT: 'EDIT' };

export default {
  inheritAttrs: false,
  props: {
    users: { type: Array, required: true },
    roles: { type: Array, required: true },
    isRequesting: { type: Boolean, required: true }
  },
  data() {
    return {
      loadingType: LOADING_TYPES.INIT
    };
  },
  computed: {
    loadingTypes() {
      return LOADING_TYPES;
    },
    isInitialLoad() {
      return this.loadingType === this.loadingTypes.INIT;
    },
    isAddLoad() {
      return this.loadingType === this.loadingTypes.ADD;
    },
    isEditLoad() {
      return this.loadingType === this.loadingTypes.EDIT;
    }
  },
  methods: {
    upsert(type, data) {
      this.loadingType = type;
      this.$emit('upsert', ...data);
    }
  },
  watch: {
    isRequesting(val) {
      if (!val) this.loadingType = null;
    }
  },
  components: {
    AddUser,
    UserList
  }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px;
}

.loading-spinner {
  margin: 40px auto;
}
</style>
