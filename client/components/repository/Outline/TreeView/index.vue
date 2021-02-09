<template>
  <tree-graph
    @node:select="onNodeSelect"
    v-bind="graphOptions"
    :data="graphData"
    :selected-node-id="selectedActivity && selectedActivity.id" />
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';
import { mapGetters } from 'vuex';
import reduce from 'lodash/reduce';
import selectActivity from '@/components/repository/common/selectActivity';
import sortBy from 'lodash/sortBy';
import TreeGraph from './TreeGraph';

const isActivityNode = node => node.depth > 0;

const graphOptions = {
  nodeSize: { width: 60, height: 180 },
  nodeDiameterRange: { min: 8, max: 14 }
};

export default {
  name: 'tree-view',
  mixins: [selectActivity],
  props: {
    structure: { type: Array, default: () => [] },
    outlineActivities: { type: Array, default: () => [] }
  },
  data() {
    return {
      graphOptions,
      selectedNode: null
    };
  },
  computed: {
    ...mapGetters('repository', ['repository']),
    graphData() {
      // Render graph only for persisted activities
      const savedActivities = this.outlineActivities.filter(it => it.id);
      const repositoryTree = tree(sortBy(savedActivities, 'id'), this.structure);
      const repositoryColor = get(this.repository, 'data.color', '#FFFFFF');
      return {
        ...this.repository,
        color: repositoryColor,
        ...repositoryTree
      };
    }
  },
  methods: {
    onNodeSelect(node, activity, circle) {
      if (activity.id === this.selectedActivity.id) return;
      if (!isActivityNode(node)) return;
      this.selectActivity(activity.id);
    }
  },
  components: { TreeGraph }
};

function tree(activities, structure, root = { size: 0 }, parent = root, depth = 0) {
  if (depth > root.size) root.size = depth;
  parent.children = reduce(activities, (acc, it) => {
    const parentId = parent.id || null;
    if (it.parentId !== parentId) return acc;
    it.color = getColor(it.type, structure);
    const subtree = tree(activities, structure, root, { ...it }, depth + 1);
    acc.push(subtree);
    return acc;
  }, []);
  return parent;
}

function getColor(type, structure) {
  const desc = find(structure, { type });
  return desc && desc.color;
}
</script>

<style lang='scss' scoped>
$accent: #37474f;

.tree ::v-deep {
  .selected {
    .circle-wrapper {
      filter: url(#lighten);
    }

    .circle {
      filter: url(#drop-shadow);
      transform: scale(1.3);
      transition: transform 0.4s;
    }

    .label {
      fill: $accent;
      font-weight: bold;
    }
  }

  .node .circle-wrapper:hover .circle {
    filter: url(#drop-shadow);
  }

  // Disable all effects on root/repository node.
  .depth-0 .circle-wrapper {
    * {
      cursor: auto;
    }

    &:hover .circle {
      filter: none;
    }
  }
}
</style>
