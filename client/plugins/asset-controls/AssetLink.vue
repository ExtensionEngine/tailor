<template>
  <form
    :action="action"
    :target="download ? '' : target"
    method="post"
    class="asset-link">
    <input :value="auth" type="hidden" name="auth">
    <input :value="href" type="hidden" name="url">
    <input v-if="download" :value="download" type="hidden" name="download">
    <button type="submit"><slot/></button>
  </form>
</template>

<script>
export default {
  name: 'asset-link',
  props: {
    href: { type: String, required: true },
    download: { type: String, default: '' },
    target: { type: String, default: '' }
  },
  computed: {
    action: ({ $options }) => $options.$_apiUrl,
    auth: ({ $options }) => $options.$_auth()
  }
};
</script>

<style lang="scss">
.asset-link {
  display: inline;
}
</style>
