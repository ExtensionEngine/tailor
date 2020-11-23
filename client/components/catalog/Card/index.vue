<template>
  <v-hover v-slot:default="{ hover: isCardHovered }">
    <v-card
      :elevation="isCardHovered ? 20 : 1"
      color="blue-grey darken-4"
      dark
      class="repository-card">
      <div @click="navigateTo()" class="card-body">
        <tailor-chip :color="repository.data.color" x-small class="ml-4 px-1" />
        <span class="schema-name">{{ schema }}</span>
        <div class="controls float-right">
          <v-tooltip open-delay="100" top>
            <template v-slot:activator="{ on }">
              <span v-on="on">
                <v-badge
                  :color="hasUnpublishedChanges ? 'orange' : 'green'"
                  inline dot
                  class="pa-1" />
              </span>
            </template>
            {{ publishingInfo }}
          </v-tooltip>
          <v-tooltip v-if="repository.hasAdminAccess" open-delay="400" top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click.stop="navigateTo('repository-info')"
                color="blue-grey darken-1"
                icon
                class="repo-info mr-2">
                <v-icon>mdi-settings</v-icon>
              </v-btn>
            </template>
            Open settings
          </v-tooltip>
        </div>
        <v-card-title class="pt-2 blue-grey--text text--lighten-4 text-break">
          {{ name | truncate($vuetify.breakpoint.lg ? 60 : 40) }}
        </v-card-title>
        <div class="d-flex justify-start px-4 blue-grey--text text--lighten-4">
          <v-avatar size="38">
            <img :src="lastActivity.user.imgUrl">
          </v-avatar>
          <div class="ml-3 overflow-hidden">
            <div
              :class="{ 'subtitle-1 font-weight-bold': isCardHovered }"
              class="caption">
              Edited
              <timeago :datetime="lastActivity.createdAt" :auto-update="60" />
              by
            </div>
            <div class="body-2 text-truncate">{{ lastActivity.user.label }}</div>
          </div>
        </div>
      </div>
      <v-card-actions class="pb-2 px-2">
        <v-tooltip open-delay="400" bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              @click.stop="pin({ id: repository.id, pin: !isPinned })"
              :color="isPinned ? 'lime accent-4': 'blue-grey lighten-3'"
              icon
              class="mr-1">
              <v-icon :class="{ 'mdi-rotate-45': isPinned }">mdi-pin</v-icon>
            </v-btn>
          </template>
          {{ isPinned ? 'Unpin' : 'Pin' }} {{ schema }}
        </v-tooltip>
        <tags :repository="repository" />
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import first from 'lodash/first';
import get from 'lodash/get';
import { getSchema } from 'shared/activities';
import { mapActions } from 'vuex';
import Tags from './Tags';
import TailorChip from '@/components/common/TailorChip';

const getPublishingInfo = hasChanges => hasChanges
  ? 'Has unpublished changes.'
  : 'Published.';

export default {
  props: {
    repository: { type: Object, required: true }
  },
  computed: {
    name: ({ repository }) => repository.name,
    description: ({ repository }) => repository.description,
    schema: ({ repository }) => getSchema(repository.schema).name,
    lastActivity: ({ repository }) => first(repository.revisions),
    hasUnpublishedChanges: ({ repository }) => repository.hasUnpublishedChanges,
    isPinned: ({ repository }) => get(repository, 'repositoryUser.pinned', false),
    publishingInfo: vm => getPublishingInfo(vm.hasUnpublishedChanges)
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
  components: { Tags, TailorChip }
};
</script>

<style lang="scss" scoped>
.repository-card {
  text-align: left;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-0.25rem);
  }
}

.card-body {
  height: 11.5rem;
  padding: 0.625rem 0 0;
  overflow: hidden;

  @media (max-width: 1263px) {
    height: 14rem;
  }

  .v-card__title {
    line-height: 1.75rem;
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

.repo-info.v-btn:not(.v-btn--text):not(.v-btn--outlined):hover::before {
  opacity: 0.2;
}
</style>
