<template>
  <v-card @click="navigateTo()" class="repository-card">
    <div class="card-body blue-grey darken-4">
      <v-chip
        :color="repository.data.color"
        x-small
        class="mt-1 ml-4 px-1" />
      <v-chip
        color="blue-grey darken-4"
        label small dark
        class="mt-1 ml-0 px-1">
        {{ schema }}
      </v-chip>
      <v-btn
        v-if="repository.hasAdminAccess"
        @click.stop="navigateTo('course-info')"
        @mousedown.stop
        color="blue-grey darken-1"
        icon
        class="btn-settings my-0 mr-1 pull-right">
        <v-icon>mdi-settings</v-icon>
      </v-btn>
      <v-card-title class="grey--text text--lighten-3 pt-1">
        {{ name | truncate(70) }}
      </v-card-title>
      <div class="grey--text text--lighten-4">
        <v-avatar size="38" class="float-left ml-4 mt-2">
          <img :src="lastActivity.user.imgUrl">
        </v-avatar>
        <div class="float-left mt-1 ml-4">
          <div class="caption">Last edited by</div>
          <div class="body-2">{{ lastActivity.user.label }}</div>
        </div>
        <div class="float-left ml-6">
          <div class="subtitle-1">
            {{ lastActivity.createdAt | formatDate('H:mm') }}
          </div>
          <div class="subtitle-2">
            {{ lastActivity.createdAt | formatDate('D/M/YY') }}
          </div>
        </div>
      </div>
    </div>
    <v-card-actions class="pa-1 grey lighten-4">
      <v-btn
        @click.stop="pin({ id: repository.id, pin: !isPinned })"
        @mousedown.stop
        icon>
        <v-icon
          :color="isPinned ? 'grey darken-3': 'grey darken-1'"
          :class="{ 'mdi-rotate-45': isPinned }">
          mdi-pin
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import first from 'lodash/first';
import get from 'lodash/get';
import { getSchema } from 'shared/activities';
import { mapActions } from 'vuex';

export default {
  props: {
    repository: { type: Object, required: true }
  },
  computed: {
    name: ({ repository }) => repository.name,
    description: ({ repository }) => repository.description,
    schema: ({ repository }) => getSchema(repository.schema).name,
    lastActivity: ({ repository }) => first(repository.revisions),
    isPinned: ({ repository }) => get(repository, 'repositoryUser.pinned', false)
  },
  methods: {
    ...mapActions('courses', ['pin']),
    navigateTo(name = 'course') {
      if (window.getSelection().toString()) return;
      this.$router.push({
        name,
        params: { courseId: this.repository.id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.repository-card {
  text-align: left;
  transition: box-shadow 0.1s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.2), 0 8px 8px rgba(0,0,0,0.18);
  }
}

.card-body {
  height: 220px;
  padding: 8px 0 0;
  overflow: hidden;

  .v-chip {
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @media (max-width: 1263px) {
    height: 180px;
  }
}
</style>
