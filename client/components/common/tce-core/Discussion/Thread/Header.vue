<template>
  <div class="header">
    <div class="d-block">
      <v-tooltip right>
        <template v-slot:activator="{ on }">
          <span v-on="authorLabel.length > 25 ? on : null" class="author">
            {{ authorLabel | truncate(25) }}
          </span>
        </template>
        {{ authorLabel }}
      </v-tooltip>
      <span v-if="isEdited" class="edited">(edited)</span>
    </div>
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <span v-on="on" class="mb-0">
          <timeago :datetime="createdAt" :auto-update="60" class="time" />
        </span>
      </template>
      <span>{{ createdAt | formatDate('DD. MMM h:mm A') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'comment-header',
  props: {
    author: { type: Object, required: true },
    isEdited: { type: Boolean, default: false },
    createdAt: { type: [Number, String], required: true }
  },
  computed: {
    authorLabel: vm => vm.author.fullName || vm.author.email
  }
};
</script>

<style lang="scss" scoped>
.header {
  .author {
    color: #000;
    font-size: 1rem;
  }

  .edited, .time {
    color: #888;
    font-size: 0.75rem;
  }
}
</style>
