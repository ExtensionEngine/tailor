<template>
  <div class="activities-container">
    <div class="loader-outer">
      <div class="loader-inner">
        <circular-progress v-if="showLoader"></circular-progress>
      </div>
    </div>
    <div class="activities">
      <div ref="tree" :class="{ visible }" class="tree"></div>
      <sidebar></sidebar>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Activity from './Activity';
import CircularProgress from 'components/common/CircularProgress';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';
import { mapGetters, mapMutations } from 'vuex-module';
import Sidebar from './Sidebar';

const MIN_SCALE_RATIO = 0.6;
const SCALE_TRESHOLD = [0.3, 1];
const PADDING = 40;

function initializeTree($tree, treeData) {
  if (treeData.children.length === 0) return;

  const zoom = d3.zoom()
    .scaleExtent(SCALE_TRESHOLD)
    .on('zoom', () => g.attr('transform', d3.event.transform));

  const svg = d3.select($tree).append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(zoom);

  const g = svg.append('g');

  // Declares a tree layout and assigns the node size
  const treemap = d3.tree().nodeSize([60, 180]);

  //  Assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(treeData);

  // Maps the node data to the tree layout
  nodes = treemap(nodes);

  // Adds the links between the nodes
  g.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter().append('path')
    .classed('link', true)
    .attr('d', d => `M${d.x}, ${d.y} ${d.parent.x},${d.parent.y}`);

  // Adds each node as a group
  const node = g.selectAll('.node')
    .data(nodes.descendants())
    .enter().append('g')
    .attr('class', d => `node depth-${d.depth}`)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  // Adds the circle to the node
  node.append('circle').attr('r', 8);

  // Adds the text to the node
  node.append('text')
    .attr('dy', '.35em')
    .attr('y', d => d.children ? -20 : 20)
    .style('text-anchor', 'middle')
    .text(d => d.data.name);

  const treeRect = $tree.firstChild.firstChild.getBoundingClientRect();
  const treeOffset = getTreeOffest(treeRect, $tree.clientWidth);
  zoom.translateBy(svg, treeOffset, PADDING); // center
  zoom.scaleTo(svg, getScaleRatio(treeRect.width, $tree.clientWidth));

  return node;
}

function buildTree(parent, activities, parentId = null) {
  const children = filter(activities, { parentId })
    .map(it => {
      it.name = it.id;
      return buildTree(it, activities, it.id);
    });
  parent.children = children;
  return parent;
}

function getTreeOffest(treeData, viewportWidth) {
  const treeCenterX = (treeData.width / 2) + treeData.x;
  return (viewportWidth / 2) - treeCenterX;
}

function getScaleRatio(treeWidth, viewportWidth) {
  treeWidth += PADDING;
  if (treeWidth < viewportWidth) return 1;
  const scaleRatio = viewportWidth / treeWidth;
  return scaleRatio <= MIN_SCALE_RATIO ? MIN_SCALE_RATIO : scaleRatio;
}

export default {
  props: ['showLoader'],
  computed: {
    ...mapGetters(['activities', 'course', 'structure'], 'course'),
    nodeTypes() {
      return map(this.structure, 'type');
    },
    treeData() {
      if (!this.course || !this.activities) return;
      const activities = filter(this.activities, activity => {
        return includes(this.nodeTypes, activity.type);
      });

      return buildTree(this.course, activities);
    },
    visible() {
      return !this.showLoader || false;
    }
  },
  mounted() {
    this.$watch('treeData', treeData => {
      if (!treeData) return;
      const $nodes = initializeTree(this.$refs.tree, treeData);
      if (!$nodes) return;
      $nodes.on('click', ({ data: node }) => {
        if (!node.courseId) return; // ignore click on root node (course)
        this.focusActivity(node._cid);
      });
    }, { immediate: true });
  },
  methods: {
    ...mapMutations(['focusActivity'], 'course')
  },
  components: {
    Activity,
    CircularProgress,
    Sidebar
  }
};
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
  visibility: hidden;

  &.visible {
    visibility: visible;
  }

  /deep/ {
    svg {
      width: 100%;
      height: 100%;
    }

    .node circle:hover {
      cursor: pointer;
    }

    .node.depth-0 circle {
      fill: #fff;

      &:hover {
        fill: #ccc;
      }
    }

    .node.depth-1 circle {
      fill: #399bf3;

      &:hover {
        fill: #2e81ca;
      }
    }

    .node.depth-2 circle {
      fill: #7cce77;

      &:hover {
        fill: #5e9a5a;
      }
    }

    .node.depth-3 circle {
      fill: #ef6790;

      &:hover {
        fill: #b34d6c;
      }
    }

    .node.depth-4 circle {
      fill: #d5d03e;

      &:hover {
        fill: #b1ad32;
      }
    }

    .node text {
      fill: #626262;
      font: 14px sans-serif;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }
  }
}
</style>
