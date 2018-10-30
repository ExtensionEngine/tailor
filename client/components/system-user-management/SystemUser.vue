<template>
  <tr class="system-user-row">
    <td class="email-cell">{{ email }}</td>
    <td>
      <multiselect
        :value="role"
        :options="roles"
        :disabled="!canChangeRole"
        :searchable="false"
        :allowEmpty="false"
        :trackBy="null"
        :label="null"
        @input="role => $emit('update', { role })"
        placeholder="Select new role">
      </multiselect>
    </td>
    <td class="text-center">
      <button @click="$emit('delete')" type="button" class="btn btn-link">
        <span class="mdi mdi-close"></span>
      </button>
    </td>
  </tr>
</template>

<script>
import Multiselect from '../common/Select';

export default {
  name: 'system-user',
  props: {
    email: { type: String, required: true },
    role: { type: String, required: true },
    roles: { type: Array, required: true }
  },
  data() {
    return { selectedRole: this.role };
  },
  computed: {
    canChangeRole() {
      return this.roles.includes(this.role);
    }
  },
  components: {
    Multiselect
  }
};
</script>

<style lang="scss" scoped>
.system-user-row td {
  vertical-align: middle;
}
</style>
