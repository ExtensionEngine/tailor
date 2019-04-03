<template>
  <form
    :action="action"
    :target="download ? '' : target"
    method="post"
    class="resource-link">
    <input v-for="field in fields" v-bind="field" :key="field.name" type="hidden">
    <input :value="auth" name="auth" type="hidden">
    <input v-if="download" :value="download" name="download" type="hidden">
    <button type="submit"><slot/></button>
  </form>
</template>

<script>
export default {
  name: 'resource-link',
  props: {
    action: { type: String, required: true },
    download: { type: String, default: '' },
    target: { type: String, default: '' },
    params: { type: Object, default: () => ({}) }
  },
  computed: {
    auth: ({ $options }) => $options.$_auth(),
    fields() {
      return Object.keys(this.params).map(name => ({
        name,
        value: this.params[name]
      }));
    }
  }
};
</script>

<style lang="scss">
.resource-link {
  display: inline;
}
</style>
