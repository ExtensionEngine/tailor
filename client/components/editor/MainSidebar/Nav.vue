<template>
  <div class="pt-2 px-1">
    <v-treeview
      :items="tree"
      :active="[selected.id]"
      :open="opened"
      active-class="pink--text text--darken-2"
      class="pt-3">
      <template v-slot:label="{ item }">
        <div class="treview-item">
          <div v-if="!isEditable(item.type)" class="text-truncate">
            {{ item.name }}
          </div>
          <router-link
            v-else
            :to="{ name: 'editor', params: { activityId: item.id } }">
            <v-icon color="blue-grey darken-1">mdi-file-document-outline</v-icon>
            <div class="item-title text-truncate">{{ item.name }}</div>
          </router-link>
        </div>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import filter from 'lodash/filter';
import { getAncestors } from 'client/utils/activity';
import { isEditable } from 'shared/activities';
import map from 'lodash/map';
import pick from 'lodash/pick';
import sortBy from 'lodash/sortBy';

export default {
  name: 'repo-nav',
  props: {
    items: { type: Array, required: true },
    selected: { type: Object, required: true }
  },
  data() {
    return {
      opened: map(getAncestors(this.items, this.selected), 'id')
    };
  },
  computed: {
    tree() {
      return outlineToTree(this.items, null);
    }
  },
  methods: { isEditable }
};

function outlineToTree(items, parentId) {
  const levelItems = sortBy(filter(items, { parentId }), 'position');
  return levelItems.map(it => ({
    ...pick(it, ['id', 'type']),
    name: it.data.name,
    children: outlineToTree(items, it.id)
  }));
}
</script>

<style lang="scss" scoped>
.v-treeview {
  text-align: left;
}

.treview-item {
  a {
    display: flex;
  }

  .item-title {
    padding-top: 3px;
  }
}

/deep/ {
  .v-treeview-node__content {
    display: block;
    width: 100%;
    padding-right: 30px;
  }

  .v-treeview-node--leaf {
    margin-left: 20px;
  }
}
</style>
