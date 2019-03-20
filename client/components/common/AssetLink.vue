<template>
  <form :action="resolveEndpoint" method="post" target="_blank">
    <input type="hidden" name="action" value="resolve">
    <input :value="auth" type="hidden" name="auth">
    <input :value="url" type="hidden" name="url">
    <button type="submit"><slot/></button>
  </form>
</template>

<script>
export default {
  name: 'asset-link',
  inject: ['$storageService'],
  props: {
    url: {
      type: String,
      required: true
    },
    resolveEndpoint: {
      type: String,
      default() {
        return this.$storageService.resolveEndpoint;
      }
    },
    auth: {
      type: String,
      default() {
        return localStorage.getItem('JWT_TOKEN');
      }
    }
  }
};
</script>
