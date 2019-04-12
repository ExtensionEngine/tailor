<template class="gm">
  <a
    v-if="direct"
    v-bind="{ href, download, target }"
    class="resource-link">
    <slot/>
  </a>
  <form
    v-else
    :action="action"
    :target="download ? null : target"
    method="post"
    enctype="multipart/form-data"
    class="resource-link">
    <input v-for="field in fields" v-bind="field" :key="field.name" type="hidden">
    <input :value="auth" name="auth" type="hidden">
    <input :value="href" name="url" type="hidden">
    <input v-if="download" :value="download" name="download" type="hidden">
    <button type="submit"><slot/></button>
  </form>
</template>

<script>
export default {
  name: 'resource-link',
  props: {
    action: { type: String, required: true },
    href: { type: String, required: true },
    direct: { type: Boolean, default: false },
    download: { type: String, default: null },
    target: { type: String, default: null },
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

  button {
    text-decoration: inherit;

    &:focus {
      outline: inherit;
    }
  }
}
</style>
