<template>
  <div class='activities-container'>
    <circular-progress v-if='showLoader'></circular-progress>
    <div class="activities">
      <div id='tree'></div>
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
import reject from 'lodash/reject';
import Sidebar from './Sidebar';

function initializeTree() {
  if (this.activities.length === 0) return;

  var zoom = d3.zoom()
    .scaleExtent([0.2, 10])
    .on('zoom', zoomed);

  var svg = d3.select('#tree').append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .call(zoom);

  var g = svg.append('g');

  function zoomed() {
    g.attr('transform', d3.event.transform);
  }

  // var width = document.getElementById('tree').clientWidth;
  // var height = document.getElementById('tree').clientHeight;

  // declares a tree layout and assigns the size
  const treemap = d3.tree()
    .nodeSize([60, 180]);
    // .size([width, height]);

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

  node.on('click', d => this.onClick(d.data._cid));

  var width = document.getElementById('tree').clientWidth;
  zoom.translateBy(svg, width / 2, 40); // center
  // zoom.scaleTo(svg, 0.9); // fit to svg

  console.log(nodes.children);
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

export default {
  props: ['showLoader'],
  computed: {
    ...mapGetters(['activities', 'course'], 'course'),
    treeData() {
      if (!this.course || !this.activities) return;
      return this.buildTree(this.course, this.activities);
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
    onClick(_cid) {
      this.focusActivity(_cid);
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
.activities-container {
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
