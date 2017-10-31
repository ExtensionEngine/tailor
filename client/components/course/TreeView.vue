<template>
  <div class="activities-container">
    <circular-progress v-if="showLoader"></circular-progress>
    <!-- <div v-else class="activities">
      <activity :level="0" :activities="activities" class="outline"></activity>
      <sidebar></sidebar>
    </div> -->
  </div>
</template>

<script>
import * as d3 from 'd3';

import Activity from './Activity';
import CircularProgress from 'components/common/CircularProgress';
import { mapGetters } from 'vuex-module';
import Sidebar from './Sidebar';

export default {
  props: ['showLoader'],
  computed: mapGetters(['activities'], 'course'),
  mounted () {
    var treeData = {
      "name": "Top Level",
      "children": [
        { 
      "name": "Level 2: A",
          "children": [
            {
              "name": "Son of A",
              "children": [
                { "name": 'level 3 C' }
              ]
            },
            { "name": "Daughter of A" },
            { "name": "Daughter of A" },
            { "name": "Daughter of A" },
            { "name": "Daughter of A" }
          ]
        },
        { "name": "Level 2: B" }
      ]
    };

    // set the dimensions and margins of the diagram
    var margin = {top: 40, right: 90, bottom: 50, left: 90},
      width = 660 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // declares a tree layout and assigns the size
    var treemap = d3.tree()
      .size([width, height]);

    //  assigns the data to a hierarchy using parent-child relationships
    var nodes = d3.hierarchy(treeData);

    // maps the node data to the tree layout
    nodes = treemap(nodes);

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select(".activities-container").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
    
    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // adds the links between the nodes
    var link = g.selectAll(".link")
      .data( nodes.descendants().slice(1))
      .enter().append("path")
      .attr("class", "link")
      .attr("d", function(d) {
        return "M" + d.x + "," + d.y
          + "C" + d.x + "," + (d.y + d.parent.y) / 2
          + " " + d.parent.x + "," +  (d.y + d.parent.y) / 2
          + " " + d.parent.x + "," + d.parent.y;
      });

    // adds each node as a group
    var node = g.selectAll(".node")
      .data(nodes.descendants())
      .enter().append("g")
      .attr("class", function(d) { 
        return "node" + 
          (d.children ? " node--internal" : " node--leaf"); })
      .attr("transform", function(d) { 
        return "translate(" + d.x + "," + d.y + ")"; });

    // adds the circle to the node
    node.append("circle")
      .attr("r", 10);

    // adds the text to the node
    node.append("text")
      .attr("dy", ".35em")
      .attr("y", function(d) { return d.children ? -20 : 20; })
      .style("text-anchor", "middle")
      .text(function(d) { return d.data.name; });

    // let canvas = d3.select("body").append('svg')
    //   .attr("width", 500)
    //   .attr("height", 500);
      
    // let diagonal = d3.svg.diagonal()
    //   .source({ x:10, y:10 })
    //   .target({ x:300, y:200 });

    // canvas.append("path")
    //   .attr("fill", 'none')
    //   .attr("stroke", 'black')
    //   .attr("d", diagonal);

    // --------------

    // d3.select("body").style("background-color", "black");

    // var svg = d3.select("svg"),
    //   width = +svg.attr("width"),
    //   height = +svg.attr("height"),
    //   g = svg.append("g").attr("transform", "translate(40,0)");

    // var tree = d3.tree()
    //   .size([height, width - 160]);

    // var stratify = d3.stratify()
    //   .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

    // d3.csv("flare.csv", function(error, data) {
    //   if (error) throw error;

    //   var root = stratify(data)
    //       .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });

    //   var link = g.selectAll(".link")
    //     .data(tree(root).links())
    //     .enter().append("path")
    //       .attr("class", "link")
    //       .attr("d", d3.linkHorizontal()
    //           .x(function(d) { return d.y; })
    //           .y(function(d) { return d.x; }));

    //   var node = g.selectAll(".node")
    //     .data(root.descendants())
    //     .enter().append("g")
    //       .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
    //       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

    //   node.append("circle")
    //       .attr("r", 2.5);

    //   node.append("text")
    //       .attr("dy", 3)
    //       .attr("x", function(d) { return d.children ? -8 : 8; })
    //       .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
    //       .text(function(d) { return d.id.substring(d.id.lastIndexOf(".") + 1); });
    // });
  },
  components: {
    Activity,
    CircularProgress,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
.activities-container /deep/ {
  .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 3px;

    &:hover {
      stroke: red;
      fill: #ffbbff;
      cursor: pointer;
    }
  }

  .node text { font: 12px sans-serif; }

  .node--internal text {
    text-shadow: 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff;
  }

  .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1px;
  }
}
</style>
