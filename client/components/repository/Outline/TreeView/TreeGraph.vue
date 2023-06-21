<template>
  <div ref="graph" :class="{ grabbing }" class="graph"></div>
</template>

<script>
import * as d3 from 'd3-selection';
import { hierarchy, tree } from 'd3-hierarchy';
import clamp from 'lodash/clamp';
import { line as createLine } from 'd3-shape';
import flatten from 'lodash/flatten';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import range from 'lodash/range';
import { zoom } from 'd3-zoom';

const hasNodes = tree => !tree.children || !tree.children.length;
const line = createLine();

const isNativeEvent = (e, type) => get(e.sourceEvent, 'type') === type;
const isDragStart = e => e.type === 'start' && isNativeEvent(e, 'mousedown');
const isDragEnd = e => e.type === 'end' && isNativeEvent(e, 'mouseup');
const isRepositoryNode = node => !!node.data.schema;

const zoomOptions = {
  min: 0.3,
  max: 1,
  default: 0.6
};

const dropShadowOptions = {
  stdDeviation: 1,
  dx: 1,
  dy: 1,
  slope: 0.5,
  type: 'linear'
};

const lightenFactor = 1.5;

export default {
  name: 'tree-graph',
  props: {
    data: { type: Object, required: true },
    nodeSize: { type: Object, required: true },
    nodeDiameterRange: { type: Object, required: true },
    zoomRange: { type: Object, default: () => zoomOptions },
    padding: { type: Number, default: 60 },
    selectedNodeId: { type: Number, default: null }
  },
  data() {
    return {
      grabbing: false,
      hovered: null
    };
  },
  computed: {
    nodes() {
      if (hasNodes(this.data)) return;
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
  methods: {
    renderTree() {
      // Setup chart.
      const svg = d3.select(this.$el).append('svg')
        .on('mouseleave', () => (this.hovered = null))
        .call(this.zoomHandler);

      // Add filters.
      const defs = svg.append('defs');
      addDropShadow(defs, dropShadowOptions);
      addLighten(defs, lightenFactor);

      const g = svg.append('g');
      this.zoomHandler.on('zoom', () => {
        const e = d3.event;
        // Apply translate & scale transformation.
        g.attr('transform', e.transform);
      })
      .on('start end', () => {
        const e = d3.event;
        // Hanlde pan.
        if (isDragStart(e)) {
          this.grabbing = true;
          this.$emit('pan:start');
        } else if (isDragEnd(e)) {
          this.grabbing = false;
          this.$emit('pan:end');
        }
      });

      // Render nodes & links.
      const descendants = this.nodes ? this.nodes.descendants() : [];
      this.renderLinks(descendants.slice(1), g);
      this.renderNodes(descendants, g);

      // Center graph and adjust scale.
      const graphRect = g.node().getBoundingClientRect();
      this.setPosition(svg, graphRect);
      this.setScale(svg, graphRect);

      // Append graph to root element.
      this.$el.innerHTML = '';
      return this.$el.appendChild(svg.node());
    },
    renderLinks(data, graph) {
      return graph.selectAll('.link')
        .data(data).enter().append('path')
        .classed('link', true)
        .attr('d', link);
    },
    renderNodes(data, graph, { padding = 32 } = {}) {
      // Create node group.
      const node = graph.selectAll('.node')
        .data(data).enter().append('g')
        .attr('class', d => `node depth-${d.depth}`)
        .attr('id', d => isRepositoryNode(d) ? 'repository' : `activity${d.data.id}`)
        .attr('transform', d => `translate(${d.x}, ${d.y})`);

      // Append label.
      node.append('text')
        .classed('label subtitle-2', true)
        .text(({ data: { shortId, name } }) => name || shortId)
        .style('text-anchor', 'middle')
        .attr('dy', '.35em')
        .attr('y', d => {
          // Calculate text padding.
          if (d.depth === 0) return -30;
          return d.children ? -28 : 28;
        });

      // Create node wrapper.
      const self = this;
      const group = node.append('g')
        // NOTE: Sadly we need wrapper because svg element
        //       accepts only one filter at time.
        .classed('circle-wrapper', true)
        .on('click', function (node) {
          self.$emit('node:select', node, node.data, this.parentNode);
        });

      // Extend node area.
      group.append('circle')
        .classed('padding', true)
        .on('mouseenter', node => (this.hovered = node))
        .on('mouseleave', () => (this.hovered = null))
        .attr('r', d => this.nodeDiameters[d.depth] + padding);

      // Append node circle.
      group.append('circle')
        .classed('circle', true)
        .style('fill', d => d.data.color)
        .attr('r', d => this.nodeDiameters[d.depth]);

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
    },
    selectNode(activityId) {
      const selection = this.$refs.graph.querySelector('.selected');
      if (selection) selection.classList.remove('selected');
      const id = `#activity${activityId}`;
      this.$nextTick(() => {
        const el = this.$refs.graph.querySelector(id);
        if (!el) return;
        el.classList.add('selected');
      });
    }
  },
  watch: {
    hovered(node) {
      if (!node) return this.$emit('node:focusout');
      if (node.depth > 0) this.$emit('node:focus', node, node.data);
    },
    selectedNodeId(val) {
      if (!val) return;
      this.selectNode(val);
    }
  },
  mounted() {
    // Re-render chart when data changes.
    this.$watch('nodes', (val, prevVal) => {
      if (isEqual(val, prevVal)) return;
      this.renderTree();
    }, { immediate: true });
    this.$nextTick(() => this.selectNode(this.selectedNodeId));
  }
};

// Adapted from following bl.ocks.org example:
// http://bl.ocks.org/dimitardanailov/240cc0689604e22570e8ce22aa8a7e7e
function addDropShadow(defs, dropShadow, filterId = 'drop-shadow') {
  const filter = defs.append('filter').attr('id', filterId)
    .attr('filterUnits', 'userSpaceOnUse');

  filter.append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', parseInt(dropShadow.stdDeviation));

  filter.append('feOffset')
    .attr('dx', parseInt(dropShadow.dx, 10))
    .attr('dy', parseInt(dropShadow.dy, 10));

  const feComponentTransfer = filter.append('feComponentTransfer');
  feComponentTransfer.append('feFuncA')
    .attr('type', dropShadow.type)
    .attr('slope', parseFloat(dropShadow.slope));

  const feMerge = filter.append('feMerge');
  feMerge.append('feMergeNode');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
}

// All you need to know about `feColorMatrix`:
// https://alistapart.com/article/finessing-fecolormatrix#section10
function addLighten(defs, amount, filterId = 'lighten') {
  const filter = defs.append('filter').attr('id', filterId);

  const values = [
    [amount, 0, 0, 0, 0],
    [0, amount, 0, 0, 0],
    [0, 0, amount, 0, 0],
    [0, 0, 0, 1, 0]
  ];

  filter.append('feColorMatrix')
    .attr('type', 'matrix')
    .attr('values', flatten(values).join(' '));
}

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
$font: 0.875rem $font-family-secondary;
$text-color: #263238;
$node-color: #b9b9b9;
$link-color: #b0bec5;

.graph {
  svg {
    display: block;
    width: 100%;
    height: 100%;
    cursor: grab;
  }

  &.grabbing svg {
    cursor: grabbing;
  }

  .padding {
    fill: transparent;
  }

  // Set default node (normal & hover mode) colors.
  .node .circle-wrapper {
    .circle {
      fill: $node-color;
    }

    &:hover .circle {
      fill: darken($node-color, 10%);
    }

    // Capture all mouse events on circle wrapper.
    * {
      cursor: pointer;
      pointer-events: none;
    }

    .padding {
      fill: transparent;
      pointer-events: all;
    }
  }

  .node .label {
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
