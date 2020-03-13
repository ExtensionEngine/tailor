<template>
  <v-card class="repository-card">
    <div @click="navigateTo()" class="card-body blue-grey darken-4">
      <v-chip :color="repository.data.color" x-small class="ml-4 px-1" />
      <span class="schema-name">{{ schema }}</span>
      <div class="controls float-right">
        <publishing-badge
          :color="hasChanges ? 'orange' : 'green'"
          :tooltip="{ top: true }">
          {{ publishingInfo }}
        </publishing-badge>
        <v-btn
          v-if="repository.hasAdminAccess"
          @click.stop="navigateTo('repository-info')"
          color="blue-grey darken-1"
          icon small
          class="mr-2 float-right">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      </div>
      <v-card-title class="grey--text text--lighten-3 text-break pt-2">
        {{ name | truncate(70) }}
      </v-card-title>
      <div class="grey--text text--lighten-4 px-4">
        <v-avatar size="38" class="float-left">
          <img :src="lastActivity.user.imgUrl">
        </v-avatar>
        <div class="float-left ml-4">
          <div class="caption">Last edited by</div>
          <div class="user-label body-2 text-truncate">
            {{ lastActivity.user.label }}
          </div>
        </div>
        <div class="float-left activity-date">
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
      <v-btn @click.stop="pin({ id: repository.id, pin: !isPinned })" icon>
        <v-icon
          :color="isPinned ? 'grey darken-3': 'grey'"
          :class="{ 'mdi-rotate-45': isPinned }">
          mdi-pin
        </v-icon>
      </v-btn>
      <tags :repository="repository" />
    </v-card-actions>
  </v-card>
</template>

<script>
import first from 'lodash/first';
import get from 'lodash/get';
import { getSchema } from 'shared/activities';
import { mapActions } from 'vuex';
import PublishingBadge from 'components/common/PublishingBadge';
import Tags from './Tags';

const getPublishingInfo = hasChanges => hasChanges
  ? 'Repository has unpublished content'
  : 'Repository content is published';

export default {
  props: {
    repository: { type: Object, required: true }
  },
  computed: {
    name: ({ repository }) => repository.name,
    hasChanges: ({ repository }) => repository.hasChanges,
    description: ({ repository }) => repository.description,
    schema: ({ repository }) => getSchema(repository.schema).name,
    lastActivity: ({ repository }) => first(repository.revisions),
    isPinned: ({ repository }) => get(repository, 'repositoryUser.pinned', false),
    publishingInfo: ({ hasChanges }) => getPublishingInfo(hasChanges)
  },
  methods: {
    ...mapActions('repositories', ['pin']),
    navigateTo(name = 'repository') {
      if (window.getSelection().toString()) return;
      this.$router.push({
        name,
        params: { repositoryId: this.repository.id }
      });
    }
  },
  components: { PublishingBadge, Tags }
};
</script>

<style lang="scss" scoped>
.repository-card {
  text-align: left;
  transition: box-shadow 0.1s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 6px 12px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.18);
  }
}

.card-body {
  height: 14rem;
  padding: 0.625rem 0 0;
  overflow: hidden;

  @media (max-width: 1263px) {
    height: 17rem;
  }

  .schema-name {
    padding: 0 0 0 0.25rem;
    color: #fafafa;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .controls {
    display: flex;
    align-items: center;
  }

  .v-avatar {
    margin-top: 0.125rem;
  }
}

.user-label {
  max-width: 8.5rem;
}

.activity-date {
  padding-left: 1rem;

  .subtitle-1 {
    line-height: 1.25rem;
  }
}
</style>
