<template>
  <div class="activities-container">
    <div class="loader-outer">
      <div class="loader-inner">
        <circular-progress v-if="showLoader"></circular-progress>
      </div>
    </div>
    <div class="activities">
      <div :class="{ visible }" id="tree"></div>
      <sidebar></sidebar>
    </div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Activity from './Activity';
import CircularProgress from 'components/common/CircularProgress';
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import groupBy from 'lodash/groupBy';
import includes from 'lodash/includes';
import { mapGetters, mapMutations } from 'vuex-module';
import max from 'lodash/max';
import min from 'lodash/min';
import reject from 'lodash/reject';
import Sidebar from './Sidebar';

const MIN_SCALE_RATIO = 0.6;
const SCALE_TRESHOLD = [0.3, 1];
const PADDING = 40;
const REJECTING_ACTIVITIES = ['PERSPECTIVE', 'COURSE/INTERACTIVE_EXERCISE']; // better name?

function initializeTree() {
  if (this.activities.length === 0) return;

  var zoom = d3.zoom()
    .scaleExtent(SCALE_TRESHOLD)
    .on('zoom', zoomed);

  var svg = d3.select('#tree').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(zoom);

  var g = svg.append('g');

  function zoomed() {
    g.attr('transform', d3.event.transform);
  }

  // Declares a tree layout and assigns the node size
  const treemap = d3.tree().nodeSize([60, 180]);

  //  Assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(this.treeData);

  // Maps the node data to the tree layout
  nodes = treemap(nodes);

  // Adds the links between the nodes
  g.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter().append('path')
    .attr('class', 'link')
    .attr('d', d => `M${d.x}, ${d.y} ${d.parent.x},${d.parent.y}`);

  // Adds each node as a group
  const node = g.selectAll('.node')
    .data(nodes.descendants())
    .enter().append('g')
    .attr('class', d => `node depth${d.depth}`)
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  // Adds the circle to the node
  node.append('circle').attr('r', 8);

  // Adds the text to the node
  node.append('text')
    .attr('dy', '.35em')
    .attr('y', d => d.children ? -20 : 20)
    .style('text-anchor', 'middle')
    .text(d => d.data.name);

  node.on('click', d => this.onClick(d.data));

  const viewportWidth = document.getElementById('tree').clientWidth;
  const treeCoordinates = getTreeCoordinates(nodes.children);
  const treeOffset = getTreeOffest(treeCoordinates, viewportWidth);
  const treeWidth = getTreeWidth(treeCoordinates);
  zoom.translateBy(svg, treeOffset, 40); // center
  zoom.scaleTo(svg, getScaleRatio(treeWidth, viewportWidth));
}

function buildTree(course, activities) {
  const nodes = activities.map(activity => {
    return {
      _cid: activity._cid,
      name: activity.id,
      id: activity.id,
      parentId: activity.parentId
    };
  });
  const groups = groupBy(reject(nodes, { 'parentId': null }), 'parentId');
  const rootActivities = filter(nodes, { 'parentId': null });
  forEach(rootActivities, rootActivity => {
    addChildren(rootActivity, groups);
  });

  return { name: course.name, children: rootActivities };
}

function addChildren(activity, source) {
  const ids = Object.keys(source);
  if (includes(ids, activity.id.toString())) {
    activity.children = source[activity.id.toString()];
    forEach(activity.children, activity => {
      addChildren(activity, source);
    });
  }
  return activity;
}

function getTreeCoordinates(nodes) {
  const xCoordinates = [];
  function scanNodes(nodes) {
    forEach(nodes, node => {
      if (node.x) xCoordinates.push(node.x);
      if (node.children) scanNodes(node.children);
    });
  }

  scanNodes(nodes);

  const xMax = max(xCoordinates);
  const xMin = min(xCoordinates);
  return { xMin, xMax };
}

function getTreeOffest(treeCoordinates, viewportWidth) {
  return (viewportWidth / 2) - ((treeCoordinates.xMin + treeCoordinates.xMax) / 2);
}

function getTreeWidth(treeCoordinates) {
  return treeCoordinates.xMax - treeCoordinates.xMin;
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
    ...mapGetters(['activities', 'course'], 'course'),
    treeData() {
      if (!this.course || !this.activities) return;
      const nodes = reject(this.activities, activity => {
        return includes(REJECTING_ACTIVITIES, activity.type);
      });
      return this.buildTree(this.course, nodes);
    },
    visible() {
      return !this.showLoader || false;
    }
  },
  mounted() {
    this.$watch('treeData', treeData => {
      if (treeData) this.initializeTree();
    }, { immediate: true });
  },
  methods: {
    ...mapMutations(['focusActivity'], 'course'),
    buildTree: buildTree,
    initializeTree: initializeTree,
    onClick(node) {
      if (!node.id) return; // ignore click on root node (course)
      this.focusActivity(node._cid);
    }
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
    padding: inherit;
    transform: translate(-50%, -50%);
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

#tree {
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

    .node.depth0 circle {
      fill: #fff;

      &:hover {
        fill: #ccc;
      }
    }

    .node.depth1 circle {
      fill: #399bf3;

      &:hover {
        fill: #2e81ca;
      }
    }

    .node.depth2 circle {
      fill: #7cce77;

      &:hover {
        fill: #5e9a5a;
      }
    }

    .node.depth3 circle {
      fill: #ef6790;

      &:hover {
        fill: #b34d6c;
      }
    }

    .node.depth4 circle {
      fill: #d5d03e;

      &:hover {
        fill: #b1ad32;
      }
    }

    .node text {
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
