<template>
  <div class="graph"></div>
</template>

<script>
import * as d3 from 'd3-selection';
import clamp from 'lodash/clamp';
import { hierarchy, tree } from 'd3-hierarchy';
import range from 'lodash/range';
import { zoom } from 'd3-zoom';
const clear = el => (el.innerHTML = '');
const line = require('d3-shape').line();

const zoomOptions = {
  min: 0.3,
  max: 1,
  default: 0.6
};

export default {
  name: 'tree-graph',
  props: {
    data: { type: Object, required: true },
    nodeSize: { type: Object, required: true },
    nodeDiameterRange: { type: Object, required: true },
    zoomRange: { type: Object, default: () => zoomOptions },
    padding: { type: Number, default: 60 }
  },
  computed: {
    nodes() {
      if (!this.data) return;
      const nodes = hierarchy(this.data);
      const { width, height } = this.nodeSize;
      const treemap = tree().nodeSize([width, height]);
      return treemap(nodes);
    },
    nodeDiameters() {
      const { min: end, max: start } = this.nodeDiameterRange;
      const size = this.data.size + 1;
      return rangeToArray(start, end, size);
    },
    zoomHandler() {
      const { min: start, max: end } = this.zoomRange;
      return zoom().scaleExtent([start, end]);
    }
  },
  mounted() {
    // Re-render chart when data changes.
    this.$watch('nodes', nodes => {
      if (nodes) this.renderTree();
    }, { immediate: true });
  },
  methods: {
    renderTree() {
      // Setup chart.
      const svg = d3.select(this.$el).append('svg')
        .call(this.zoomHandler);

      const g = svg.append('g');
      this.zoomHandler.on('zoom', () => {
        g.attr('transform', d3.event.transform);
      });

      // Render nodes & links.
      const descendants = this.nodes.descendants();
      this.renderLinks(descendants.slice(1), g);
      this.renderNodes(descendants, g);

      // Center graph and adjust scale.
      const graphRect = g.node().getBoundingClientRect();
      this.setPosition(svg, graphRect);
      this.setScale(svg, graphRect);

      // Append graph to root element.
      clear(this.$el);
      return this.$el.appendChild(svg.node());
    },
    renderLinks(data, graph) {
      return graph.selectAll('.link')
        .data(data).enter().append('path')
        .classed('link', true)
        .attr('d', link);
    },
    renderNodes(data, graph) {
      // Create node group.
      const node = graph.selectAll('.node')
        .data(data).enter().append('g')
        .attr('class', d => `node depth-${d.depth}`)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

      // Append text & label.
      node.append('circle')
        .on('click', node => this.$emit('node:select', node, node.data))
        .style('fill', d => d.data.color)
        .attr('r', d => this.nodeDiameters[d.depth]);

      node.append('text')
        .text(d => d.data.name)
        .style('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('y', d => {
          // Calculate text padding.
          if (d.depth === 0) return -30;
          return d.children ? -25 : 25;
        });

      return node;
    },
    setPosition(svg, graphRect) {
      const deltaX = (this.$el.clientWidth - graphRect.width) / 2 - graphRect.x;
      const deltaY = this.padding;
      this.zoomHandler.translateBy(svg, deltaX, deltaY);
    },
    setScale(svg, graphRect) {
      const ratio = this.$el.clientWidth / (graphRect.width + this.padding);
      const { default: defScale, max: maxScale } = this.zoomRange;
      const scale = clamp(ratio, defScale, maxScale);
      this.zoomHandler.scaleTo(svg, scale);
    }
  }
};

function link(data = {}) {
  const { x, y, parent } = data;
  return line([[x, y], [parent.x, parent.y]]);
}

function rangeToArray(start, end, size) {
  const step = (end - start) / (size - 1);
  // Include upper bound.
  end += start < end ? 1 : -1;
  return range(start, end, step);
}
</script>

<style lang="scss">
$font: 14px Roboto, Helvetica, Arial;
$text-color: #5a5a5a;
$node-color: #b9b9b9;
$link-color: #ababab;

.graph {
  svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  .node circle {
    fill: $node-color;
  }

  .node circle:hover {
    cursor: pointer;
    fill: darken($node-color, 10%);
  }

  .node text {
    fill: $text-color;
    font: $font;
  }

  .link {
    fill: none;
    stroke: $link-color;
    stroke-width: 1px;
  }
}
</style>

