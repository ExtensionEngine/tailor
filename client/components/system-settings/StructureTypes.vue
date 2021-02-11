<template>
  <div class="schema-list-container">
    <v-text-field
      v-model.trim="search"
      label="Search"
      append-icon="mdi-magnify"
      outlined clearable
      class="mx-2" />
    <v-treeview
      :items="schemas"
      :search="search"
      item-text="label"
      open-all open-on-click
      class="pt-3">
      <template v-slot:prepend="{ item, open }">
        <v-icon color="primary darken-3">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
        <v-icon v-if="item.recursive" color="primary darken-4">mdi-replay</v-icon>
      </template>
    </v-treeview>
  </div>
</template>

<script>
import cuid from 'cuid';
import { SCHEMAS } from 'shared/activities';
import without from 'lodash/without';

const buildTree = (type, structure) => {
  const id = cuid();
  const { subLevels, ...leaf } = structure.find(it => it.type === type);
  if (!subLevels.length) return { id, ...leaf };
  const children = without(subLevels, type).map(type => buildTree(type, structure));
  return { id, children, recursive: subLevels.includes(type), ...leaf };
};

export default {
  data() {
    return { search: '' };
  },
  computed: {
    schemas() {
      return SCHEMAS.map(({ name: label, structure }) => {
        const roots = structure.filter(it => it.rootLevel);
        const children = roots.reduce((acc, { type }) => {
          acc.push(buildTree(type, structure));
          return acc;
        }, []);
        return { id: cuid(), label, children };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.schema-list-container {
  padding: 1.875rem;
  text-align: left;

  ::v-deep .v-treeview-node__label {
    font-size: 1rem;
  }
}
</style>
