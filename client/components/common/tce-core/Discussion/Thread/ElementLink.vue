<template>
  <v-tooltip left>
    <template v-slot:activator="{ on }">
      <v-btn
        v-on="on"
        @click="linkToElement"
        color="teal"
        text x-small>
        Element
        <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
      </v-btn>
    </template>
    <span>Toggle discussion</span>
  </v-tooltip>
</template>

<script>
import events from '../../Events/DiscussionEvent';
import { mapChannels } from '@/plugins/radio';

export default {
  name: 'element-link',
  props: {
    id: { type: Number, default: null },
    activityId: { type: Number, required: true },
    contentElement: { type: Object, default: () => ({}) }
  },
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    editorRoute: ({ id: commentId, activityId, contentElement }) => ({
      name: 'editor',
      params: { activityId },
      query: { elementId: contentElement.uid, commentId }
    })
  },
  methods: {
    linkToElement() {
      const { commentId } = this.$route.query;
      const { id, editorRoute, $route, $router } = this;
      if (parseInt(commentId, 10) === id) return;
      const isEditor = $route.name === 'editor';
      if (!isEditor) $router.push(editorRoute);
      this.editorBus.emit(events.LINK_TO_ELEMENT, editorRoute.query);
    }
  }
};
</script>
