<template>
  <div class="element-link">
    <v-divider vertical />
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click="linkToElement"
          :color="isShown ? 'teal' : 'blue-grey'"
          text x-small>
          {{ label }}
          <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
        </v-btn>
      </template>
      <span>View element</span>
    </v-tooltip>
  </div>
</template>

<script>
const getEditorRoute = ({ activityId, elementUid }) => ({
  name: 'editor',
  params: { activityId },
  query: { elementId: elementUid }
});

export default {
  name: 'element-link',
  props: {
    activityId: { type: Number, required: true },
    elementUid: { type: String, required: true },
    label: { type: String, required: true },
    isEditor: { type: Boolean, required: true }
  },
  computed: {
    isShown: vm => vm.elementUid === vm.$route.query.elementId
  },
  methods: {
    linkToElement() {
      const { isEditor, isShown } = this;
      const editorRoute = getEditorRoute(this);
      if (!isEditor) return this.$router.push(editorRoute);
      if (isShown) this.$router.replace({ query: {} });
      this.$router.push({ query: editorRoute.query });
    }
  }
};
</script>

<style lang="scss" scoped>
.element-link {
  display: inline-flex;
  align-self: flex-end;

  hr.v-divider--vertical {
    margin: 0.125rem 0.125rem 0.125rem 0.625rem;
  }
}
</style>
