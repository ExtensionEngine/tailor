<template>
  <div class="editor-link">
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <router-link v-slot="{ navigate, isExactActive }" :to="editorRoute">
          <v-btn
            v-on="on"
            @click="navigate"
            v-bind="$attrs"
            :color="isExactActive ? 'teal accent-4' : 'primary'"
            text x-small>
            {{ label }}
            <slot name="icon">
              <v-icon x-small class="ml-1">mdi-arrow-top-right-thick</v-icon>
            </slot>
          </v-btn>
        </router-link>
      </template>
      <slot name="tooltip">
        <span>View element</span>
      </slot>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'tailor-editor-link',
  props: {
    activityId: { type: Number, required: true },
    elementUid: { type: String, default: null },
    label: { type: String, required: true }
  },
  computed: {
    editorRoute: ({ activityId, elementUid }) => ({
      name: 'editor',
      params: { activityId },
      ...elementUid && { query: { elementId: elementUid } }
    })
  }
};
</script>
