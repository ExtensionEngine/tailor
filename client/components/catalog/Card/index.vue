<template>
  <v-hover v-slot:default="{ hover: isCardHovered }">
    <v-card
      :elevation="isCardHovered ? 20 : 1"
      color="primary darken-4"
      dark
      class="repository-card d-flex flex-column justify-space-between text-left">
      <div @click="navigateTo()" class="card-body">
        <div class="d-flex align-center ml-4">
          <v-chip :color="repository.data.color" x-small class="readonly px-1" />
          <v-tooltip :disabled="!isTruncated" open-delay="300" top>
            <template v-slot:activator="{ on }">
              <span
                ref="schemaName"
                v-on="on"
                class="schema-name flex-grow-1 text-truncate text-uppercase mx-2">
                {{ schema }}
              </span>
            </template>
            {{ schema }}
          </v-tooltip>
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
                color="primary darken-1"
                icon
                class="repo-info mr-2">
                <v-icon>mdi-settings</v-icon>
              </v-btn>
            </template>
            Open settings
          </v-tooltip>
        </div>
        <v-card-title class="pt-2 primary--text text--lighten-4 text-break">
          {{ name | truncate($vuetify.breakpoint.lg ? 60 : 40) }}
        </v-card-title>
        <div class="d-flex justify-start px-4 primary--text text--lighten-4">
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
              :color="isPinned ? 'lime accent-4': 'primary lighten-3'"
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

const getPublishingInfo = hasChanges => hasChanges
  ? 'Has unpublished changes.'
  : 'Published.';

export default {
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({ isTruncated: false }),
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
    },
    detectTruncation() {
      const { clientWidth, scrollWidth } = this.$refs.schemaName;
      this.isTruncated = clientWidth < scrollWidth;
    }
  },
  watch: {
    '$vuetify.breakpoint.width'() {
      this.detectTruncation();
    }
  },
  mounted() {
    this.$nextTick(() => this.detectTruncation());
  },
  components: { Tags }
};
</script>

<style lang="scss" scoped>
.repository-card {
  height: 14.75rem;
  transition: all 0.3s ease;
  cursor: pointer;

  @media (max-width: 1263px) {
    height: 17.25rem;
  }

  &:hover {
    transform: translateY(-0.25rem);
  }
}

.card-body {
  padding: 0.625rem 0 0;

  .schema-name {
    color: #fafafa;
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 1px;
  }

  .v-card__title {
    line-height: 1.75rem;
  }

  .v-avatar {
    margin-top: 0.125rem;
  }
}

.repo-info.v-btn:not(.v-btn--text):not(.v-btn--outlined):hover::before {
  opacity: 0.2;
}
</style>
