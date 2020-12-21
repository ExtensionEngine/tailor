<template>
  <div class="header">
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <span v-on="authorLabel.length > 25 ? on : null" class="author">
          {{ authorLabel | truncate(25) }}
        </span>
      </template>
      {{ authorLabel }}
    </v-tooltip>
    <span v-if="isEdited" class="edited">(edited)</span>
    <v-tooltip right>
      <template v-slot:activator="{ on }">
        <p v-on="on" class="mb-0">
          <timeago :datetime="createdAt" :auto-update="60" class="time" />
        </p>
      </template>
      <span>{{ createdAt | formatDate('M/D/YY h:mm A') }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'comment-header',
  props: {
    author: { type: Object, required: true },
    isEdited: { type: Boolean, default: false },
    createdAt: { type: String, required: true }
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

  .edited {
    color: grey;
    font-size: 0.75rem;
  }

  .time {
    color: #888;
    font-size: 0.75rem;
  }
}
</style>
