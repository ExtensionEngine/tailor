<template>
  <div class="activities-container">
    <div class="loader-outer">
      <div class="loader-inner">
        <v-progress-circular v-if="showLoader" color="primary" indeterminate />
      </div>
    </div>
    <div :style="{ visibility }" class="activities">
      <tree-graph
        @node:select="onNodeSelect"
        v-bind="graphOptions"
        :data="graphData"
        :selected-node-id="selectedActivity && selectedActivity.id"
        class="tree" />
      <sidebar />
    </div>
  </div>
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';
import { mapGetters } from 'vuex';
import reduce from 'lodash/reduce';
import selectActivity from '@/components/repository/common/selectActivity';
import Sidebar from 'components/repository/common/Sidebar';
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
    showLoader: { type: Boolean, default: false }
  },
  data() {
    return {
      graphOptions,
      selectedNode: null
    };
  },
  computed: {
    ...mapGetters('repository', ['repository', 'structure', 'outlineActivities']),
    // TODO: Remove this hack!
    visibility() {
      return this.showLoader ? 'hidden' : 'visible';
    },
    graphData() {
      // TODO: Make sure repository is always available!
      if (!this.outlineActivities) return {};
      // Render graph only for persisted activities
      const savedActivities = this.outlineActivities.filter(it => it.id);
      const repositoryTree = tree(savedActivities, this.structure);
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
  components: {
    Sidebar,
    TreeGraph
  }
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

.loader-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .loader-inner {
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: inherit;
  }
}

.activities-container {
  position: relative;
  height: 100%;
}

.activities {
  position: relative;
  height: 100%;
  padding-right: 400px;
}

.tree {
  width: 100%;
  height: 100%;
  float: left;
}

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
