<template>
  <div v-if="showContent">
    <slot></slot>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Permissions from '../../utils/perms';

export default {
  name: 'permission-wrapper',

  props: {
    perms: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters(['user'], 'users'),
    showContent() {
      return Permissions.checkPerms(this.user, this.perms);
    }
  }
};
</script>
