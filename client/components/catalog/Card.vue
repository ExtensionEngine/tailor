<template>
  <v-card @click="navigateTo" class="repository-card">
    <div class="card-heading blue-grey darken-4">
      <v-chip :color="data.color" small label class="ml-3 mr-0"/>
      <v-chip color="grey lighten-3" small label class="ml-0">
        {{ schema.name }}
      </v-chip>
      <v-card-title class="headline grey--text text--lighten-4 pt-1">
        {{ name | truncate(70) }}
      </v-card-title>
    </div>
    <div class="card-body">
      <div class="pb-2 grey--text text--darken-2">
        <v-icon color="primary" class="pr-1">mdi-history</v-icon>
        <span>{{ userAction.createdAt | formatDate }}</span>
        <div>{{ userAction.user.email }}</div>
      </div>
      <div class="desc grey--text text--darken-3">
        {{ description | truncate(100) }}
      </div>
    </div>
    <v-card-actions class="px-2 py-1">
      <v-btn @click.stop="$emit('pin', !pinned)" icon>
        <v-icon
          :color="pinned ? 'pink': 'grey'"
          :class="{ 'mdi-rotate-45': pinned }">
          mdi-pin
        </v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    schema: { type: Object, required: true },
    revisions: { type: Array, required: true, validator: ([first]) => Boolean(first) },
    data: { type: Object, default: () => ({}) },
    pinned: { type: Boolean, default: false }
  },
  computed: {
    userAction: ({ revisions }) => revisions[0]
  },
  methods: {
    navigateTo() {
      if (!getSelection().toString()) this.$emit('open');
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
    box-shadow:
      0 10px 20px rgba(0,0,0,0.2),
      0 8px 8px rgba(0,0,0,0.18);
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
