<template>
  <v-toolbar height="72" color="grey lighten-5" class="elevation-0">
    <v-toolbar-title class="pl-1">{{ label }}</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  name: 'default-toolbar',
  props: {
    label: { type: String, required: true }
  }
};
</script>
