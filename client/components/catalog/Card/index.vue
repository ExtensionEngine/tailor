<template>
  <v-hover v-slot="{ hover: isCardHovered }">
    <v-card
      @click="navigateTo()"
      :elevation="isCardHovered ? 24 : 1"
      :ripple="false"
      color="primary darken-4"
      dark
      class="repository-card d-flex flex-column justify-space-between text-left">
      <div @click="navigateTo()" class="card-body">
        <div class="d-flex align-center ml-4">
          <v-chip :color="repository.data.color" x-small class="readonly px-1" />
          <v-tooltip :disabled="!isSchemaTruncated" open-delay="300" top>
            <template #activator="{ on }">
              <span
                ref="schemaName"
                v-on="on"
                class="schema-name flex-grow-1 mx-2 text-truncate text-uppercase">
                {{ schema }}
              </span>
            </template>
            {{ schema }}
          </v-tooltip>
          <v-tooltip open-delay="100" top>
            <template #activator="{ on }">
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
            <template #activator="{ on }">
              <v-btn
                v-on="on"
                @click.stop="navigateTo('repository-info')"
                color="primary darken-1"
                icon
                class="repo-info mr-2">
                <v-icon>mdi-cog</v-icon>
              </v-btn>
            </template>
            Open settings
          </v-tooltip>
        </div>
        <v-card-title class="pt-0 primary--text text--lighten-4 text-break">
          {{ name | truncate($vuetify.breakpoint.lg ? 60 : 40) }}
        </v-card-title>
        <div class="d-flex justify-start px-4 primary--text text--lighten-4">
          <v-avatar size="38">
            <img :src="lastActivity.user.imgUrl">
          </v-avatar>
          <div class="ml-3 overflow-hidden">
            <div class="text-aption">
              Edited
              <timeago :datetime="lastActivity.createdAt" :auto-update="60" />
              by
            </div>
            <div class="text-body-2 text-truncate">{{ lastActivity.user.label }}</div>
          </div>
        </div>
      </div>
      <v-card-actions class="pb-2 px-2">
        <v-tooltip open-delay="400" bottom>
          <template #activator="{ on }">
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
import { mapActions } from 'vuex';
import Tags from './Tags';

const getPublishingInfo = hasChanges => hasChanges
  ? 'Has unpublished changes.'
  : 'Published.';

export default {
  name: 'catalog-card',
  inject: ['$schemaService'],
  props: {
    repository: { type: Object, required: true }
  },
  data: () => ({ isSchemaTruncated: false }),
  computed: {
    name: ({ repository }) => repository.name,
    description: ({ repository }) => repository.description,
    schema: vm => vm.$schemaService.getSchema(vm.repository.schema).name,
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
    detectSchemaTruncation() {
      const { clientWidth, scrollWidth } = this.$refs.schemaName;
      this.isSchemaTruncated = clientWidth < scrollWidth;
    }
  },
  watch: {
    '$vuetify.breakpoint.width'() {
      this.detectSchemaTruncation();
    }
  },
  mounted() {
    this.$nextTick(() => this.detectSchemaTruncation());
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
}

.card-body {
  padding: 0.375rem 0 0;

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
