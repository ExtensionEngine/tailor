<template>
  <div class="activities-container">
    <div class="loader-outer">
      <div class="loader-inner">
        <circular-progress v-if="showLoader"></circular-progress>
      </div>
    </div>
    <div class="activities">
      <tree-graph
        v-bind="graphOptions"
        :data="graphData"
        @node:select="onNodeSelect"
        class="tree">
      </tree-graph>
      <sidebar></sidebar>
    </div>
  </div>
</template>

<script>
import Activity from 'components/course/Activity';
import CircularProgress from 'components/common/CircularProgress';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import { mapGetters, mapMutations } from 'vuex-module';
import reduce from 'lodash/reduce';
import Sidebar from 'components/course/Sidebar';
import TreeGraph from './TreeGraph';

const isActivityNode = node => node.depth > 0;

const graphOptions = {
  nodeSize: { width: 60, height: 180 },
  nodeDiameterRange: { min: 8, max: 14 }
};

export default {
  props: ['showLoader'],
  data() {
    return { graphOptions };
  },
  computed: {
    ...mapGetters(['activities', 'course', 'structure'], 'course'),
    graphData() {
      // TODO: Make sure course is always available!
      if (!this.course) return {};
      const allowedTypes = map(this.structure, 'type');
      const activities = filter(this.activities, it => {
        return includes(allowedTypes, it.type);
      });
      return Object.assign({}, this.course, tree(activities));
    }
  },
  methods: {
    ...mapMutations(['focusActivity'], 'course'),
    onNodeSelect(node, activity) {
      if (!isActivityNode(node)) return;
      this.focusActivity(activity._cid);
    }
  },
  components: {
    Activity,
    CircularProgress,
    Sidebar,
    TreeGraph
  }
};

function tree(activities, root = { size: 0 }, parent = root, depth = 0) {
  if (depth > root.size) root.size = depth;
  parent.children = reduce(activities, (acc, it) => {
    const parentId = parent.id || null;
    if (it.parentId !== parentId) return acc;
    it.name = it.id;
    const subtree = tree(activities, root, { ...it }, depth + 1);
    acc.push(subtree);
    return acc;
  }, []);
  return parent;
}
</script>

<style lang='scss' scoped>
.loader-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-right: 400px;

  .loader-inner {
    position: absolute;
    top: 50%;
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

@mixin node-color($depth, $color, $hoverColor: darken($color, 20%)) {
  .node.depth-#{$depth} circle {
    fill: $color;
    &:hover { fill: $hoverColor; }
  }
}

.tree /deep/ {
  @include node-color(0, #ffffff, #cccccc);
  @include node-color(1, #399bf3, #2e81ca);
  @include node-color(2, #7cce77, #5e9a5a);
  @include node-color(3, #ef6790, #b34d6c);
  @include node-color(4, #d5d03e, #b1ad32);
}
</style>
