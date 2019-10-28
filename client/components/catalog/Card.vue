<template>
  <v-card @click="navigateTo()" class="repository-card">
    <div class="card-heading blue-grey darken-4">
      <v-chip :color="repository.data.color" small label class="ml-3 mr-0" />
      <v-chip color="grey lighten-3" small label class="ml-0">
        {{ schema }}
      </v-chip>
      <v-btn
          @click.stop="navigateTo('course-info')"
          flat
          icon
          color="grey"
        class="btn-settings text--darken-1 pull-right my-0">
          <v-icon>mdi-settings</v-icon>
        </v-btn>
      <v-card-title class="headline grey--text text--lighten-4 pt-1">
        {{ name | truncate(70) }}
      </v-card-title>
    </div>
    <div class="card-body">
      <div class="pb-2 grey--text text--darken-2">
        <v-icon color="primary" class="pr-1">mdi-history</v-icon>
        <template v-if="userAction">
          <span>{{ userAction.createdAt | formatDate }}</span>
          <div>{{ userAction.user.email }}</div>
        </template>
      </div>
      <div class="desc grey--text text--darken-3">
        {{ description | truncate(100) }}
      </div>
    </div>
    <v-card-actions class="px-2 py-1">
      <v-btn @click.stop="pin({ id: repository.id, pin: !isPinned })" icon>
        <v-icon
          :color="isPinned ? 'pink': 'grey'"
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
    userAction: ({ repository }) => first(repository.revisions),
    isPinned: ({ repository }) => get(repository, 'courseUser.pinned', false)
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

.card-heading {
  height: 146px;
  padding: 8px 0 0;
  overflow: hidden;

  .v-chip {
    font-weight: 600;
    text-transform: uppercase;
  }

  @media (max-width: 1263px) {
    height: 180px;
  }
}

.card-body {
  margin-bottom: 10px;
  padding: 14px 24px 0;

  .desc {
    height: 60px;
    font-weight: 500;
    overflow: hidden;

    @media (max-width: 1263px) {
      height: 85px;
    }
  }
}
</style>
