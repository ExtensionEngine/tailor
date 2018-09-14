<template>
  <div class="list-group">
    <draggable
      :list="list"
      :options="options"
      @start="dragElementIndex = $event.oldIndex"
      @end="dragElementIndex = -1"
      @update="$emit('update', $event)"
      class="row">
      <div
        v-for="({ item, key, isMenuActive }, index) in getItemData()"
        :key="key"
        :class="`col-xs-${item.data.width || 12}`"
        @dragstart="dragElementIndex = index"
        @dragend="dragElementIndex = -1">
        <div
          v-if="canAddAtIndex"
          :class="[isMenuActive ? 'opaque' : 'no-opacity']"
          @click="toggleMenuDisplay(key)"
          class="divider-wrapper">
          <div class="divider"><div class="action"></div></div>
          <span
            :class="[isMenuActive ? 'btn-close' : 'btn-open']"
            class="divider-content mdi mdi-plus plus">
          </span>
          <div class="divider"><div class="action"></div></div>
        </div>
        <add-element
          v-if="canAddAtIndex && enableAdd && isMenuActive"
          :include="types"
          :activity="activity"
          :position="nextPosition"
          :layout="layout"
          :alwaysDisplayed="true"
          @add="el => { $emit('addAtIndex', { element: el, index }); hideMenu(key); }">
        </add-element>
        <slot
          :item="item"
          :setWidth="false"
          :dragged="dragElementIndex === index"
          name="list-item">
        </slot>
      </div>
    </draggable>
    <add-element
      v-if="enableAdd"
      :include="types"
      :activity="activity"
      :position="nextPosition"
      :layout="layout"
      @add="el => $emit('add', el)">
    </add-element>
  </div>
</template>

<script>
import AddElement from './AddElement';
import Draggable from 'vuedraggable';
import indexOf from 'lodash/indexOf';
import last from 'lodash/last';

export default {
  props: {
    list: { type: Array, default() { return []; } },
    dragOptions: { type: Object, default() { return {}; } },
    enableAdd: { type: Boolean, default: true },
    types: { type: Array, default: null },
    activity: { type: Object, required: true },
    layout: { type: Boolean, default: false }
  },
  data() {
    return {
      dragElementIndex: null,
      menuShown: []
    };
  },
  computed: {
    options() {
      return Object.assign(this.dragOptions, {
        handle: '.drag-handle',
        scrollSpeed: 15,
        scrollSensitivity: 125
      });
    },
    nextPosition() {
      const lastItem = last(this.list);
      return lastItem ? lastItem.position + 1 : 1;
    },
    canAddAtIndex() {
      return ['INTRO', 'PERSPECTIVE', 'PAGE'].includes(this.activity.type);
    }
  },
  methods: {
    getItemData() {
      const canAddAtIndex = this.canAddAtIndex;

      return this.list.map(item => {
        const key = item._cid || item.id;
        return {
          item,
          key,
          isMenuActive: canAddAtIndex ? this.isMenuDisplayed(key) : null
        };
      });
    },
    toggleMenuDisplay(key) {
      this.isMenuDisplayed(key) ? this.hideMenu(key) : this.menuShown.push(key);
    },
    isMenuDisplayed(key) {
      return this.menuShown.includes(key);
    },
    hideMenu(key) {
      const index = indexOf(this.menuShown, key);
      if (index !== -1) this.menuShown.splice(index, 1);
    }
  },
  components: { AddElement, Draggable }
};
</script>

<style lang="scss" scoped>
/* Do not remove! Makes sure vuedraggable detects correct scrollable parent */
.list-group {
  padding: 10px 15px;
}

.divider-wrapper {
  width: 100%;
  cursor: pointer;
  text-align: center;

  &:hover {
    opacity: 1;
  }

  .divider {
    display: inline-block;
    position: relative;
    width: 35%;
    height: 2px;
    background-color: #aaa;
    opacity: inherit;
    vertical-align: super;

    .action {
      position: absolute;
      top: -8px;
      right: -27px;
      height: 0;
      color: #aaa;
      font-size: 16px;
    }

    &-content {
      display: inline-block;
      vertical-align: middle;
      padding: 0 2%;
    }
  }

  .plus {
    padding: 0 5px;
    color: #444;
    font-size: 28px;
    line-height: 28px;
  }
}

.btn {
  &-open {
    transition: all 0.2s ease-in-out;
  }

  &-close {
    transform: rotate(45deg);
    transition: all 0.2s ease-in-out;
  }
}

.opaque {
  opacity: 1;
}

.no-opacity {
  opacity: 0;
}
</style>
