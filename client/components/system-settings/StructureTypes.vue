<template>
  <v-card class="schema-list-container">
    <v-text-field
      v-model.trim="search"
      label="Search"
      append-icon="mdi-magnify"
      clearable />
    <v-treeview
      :items="schemas"
      :search="search"
      open-on-click
      item-text="label"
      class="pt-3">
      <template v-slot:prepend="{ item, open }">
        <v-icon :color="item.color">
          {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
        </v-icon>
      </template>
    </v-treeview>
  </v-card>
</template>

<script>
import cuid from 'cuid';
import { SCHEMAS } from 'shared/activities';

const buildTree = (type, structure) => {
  const id = cuid();
  const { subLevels, ...leaf } = structure.find(it => it.type === type);
  if (!subLevels.length) return { id, ...leaf };
  const children = subLevels.map(type => buildTree(type, structure));
  return { id, children, ...leaf };
};

export default {
  data() {
    return { search: '' };
  },
  computed: {
    schemas() {
      return SCHEMAS.map(({ name: label, structure }) => {
        const roots = structure.filter(it => it.level === 1);
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
  padding: 30px;
  text-align: left;

  /deep/ .v-treeview-node__label {
    font-size: 17px;
  }
}
</style>
