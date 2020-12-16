<template>
  <v-tooltip left>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        @click="linkToElement"
        :color="isSameRoute ? 'secondary' : 'teal'"
        text x-small>
        {{ elementType }}
        <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
      </v-btn>
    </template>
    <span>Go to element</span>
  </v-tooltip>
</template>

<script>
import { sentenceCase } from 'change-case';

export default {
  name: 'element-link',
  props: {
    activityId: { type: Number, required: true },
    contentElement: { type: Object, default: () => ({}) }
  },
  computed: {
    elementType: vm => sentenceCase(vm.contentElement.type),
    isSameRoute: vm => vm.contentElement.uid === vm.$route.query.elementId,
    isEditor: vm => vm.$route.name === 'editor',
    editorRoute: ({ activityId, contentElement }) => ({
      name: 'editor',
      params: { activityId },
      query: { elementId: contentElement.uid }
    })
  },
  methods: {
    linkToElement() {
      const { isEditor, editorRoute, isSameRoute } = this;
      if (!isEditor) return this.$router.push(editorRoute);
      if (isSameRoute) this.$router.replace({ query: {} });
      this.$router.push({ query: editorRoute.query });
    }
  }
};
</script>
