<template>
  <div class="element-link-container">
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click="linkToElement"
          :color="isShown ? 'secondary' : 'teal'"
          text x-small>
          {{ elementLabel }}
          <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
        </v-btn>
      </template>
      <span>View element</span>
    </v-tooltip>
  </div>
</template>

<script>
const getEditorRoute = ({ activityId, contentElement }) => ({
  name: 'editor',
  params: { activityId },
  query: { elementId: contentElement.uid }
});

export default {
  name: 'element-link',
  props: {
    activityId: { type: Number, required: true },
    contentElement: { type: Object, required: true },
    elementLabel: { type: String, required: true },
    isEditor: { type: Boolean, required: true }
  },
  computed: {
    isShown: vm => vm.contentElement.uid === vm.$route.query.elementId
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
