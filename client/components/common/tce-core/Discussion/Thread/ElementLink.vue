<template>
  <v-tooltip left>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        @click="linkToElement"
        :color="isSameRoute ? 'secondary' : 'teal'"
        text x-small>
        {{ elementLabel }}
        <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
      </v-btn>
    </template>
    <span>Go to element</span>
  </v-tooltip>
</template>

<script>
import find from 'lodash/find';

export default {
  name: 'element-link',
  inject: ['$teRegistry'],
  props: {
    activityId: { type: Number, required: true },
    contentElement: { type: Object, default: () => ({}) }
  },
  computed: {
    isSameRoute: vm => vm.contentElement.uid === vm.$route.query.elementId,
    elementLabel() {
      const { type } = this.contentElement;
      return find(this.$teRegistry._registry, { type })?.name;
    },
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
