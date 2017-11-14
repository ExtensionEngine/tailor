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

const MIN_SCALE_RATIO = 0.4;
const SCALE_TRESHOLD = [0.2, 1];

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

  // declares a tree layout and assigns the size
  const treemap = d3.tree()
    .nodeSize([60, 180]);

  //  assigns the data to a hierarchy using parent-child relationships
  let nodes = d3.hierarchy(this.treeData);

  // maps the node data to the tree layout
  nodes = treemap(nodes);

  // adds the links between the nodes
  g.selectAll('.link')
    .data(nodes.descendants().slice(1))
    .enter().append('path')
    .attr('class', 'link')
    .attr('d', function (d) {
      return 'M' + d.x + ',' + d.y + ' ' + d.parent.x + ',' + d.parent.y;
    });

  // adds each node as a group
  const node = g.selectAll('.node')
    .data(nodes.descendants())
    .enter().append('g')
    .attr('class', function (d) {
      return `node depth${d.depth}`;
    })
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  // adds the circle to the node
  node.append('circle')
    .attr('r', 8);

  // adds the text to the node
  node.append('text')
    .attr('dy', '.35em')
    .attr('y', function (d) { return d.children ? -20 : 20; })
    .style('text-anchor', 'middle')
    .text(function (d) { return d.data.name; });

  node.on('click', d => this.onClick(d.data));

  var viewportWidth = document.getElementById('tree').clientWidth;
  zoom.translateBy(svg, viewportWidth / 2, 40); // center

  zoom.scaleTo(svg, calculateScaleRatio(nodes.children, viewportWidth));
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

function calculateScaleRatio(nodes, viewportWidth) {
  const xCoordinates = [];
  function scanNodes(nodes) {
    forEach(nodes, node => {
      if (node.x) xCoordinates.push(node.x)
      if (node.children) scanNodes(node.children);
    });
  }

  scanNodes(nodes);
  const xMax = max(xCoordinates);
  const xMin = min(xCoordinates);

  const treeWidth = xMax - xMin;
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
      return this.buildTree(this.course, this.activities);
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
  width: 100%;
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

    .node circle {
      pointer-events: all;

      &:hover {
        cursor: pointer;
      }
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

    .node text { font: 12px sans-serif; }

    .node--internal text {
      text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
    }

    .link {
      fill: none;
      stroke: #ccc;
      stroke-width: 2px;
    }
  }
}
</style>
