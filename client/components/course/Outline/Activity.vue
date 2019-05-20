<template>
  <div>
    <div class="activity-wrapper">
      <div
        :class="{ 'grey lighten-4 elevation-8 selected': isHovered || isSelected }"
        @click="focusActivity(_cid)"
        @mouseover="isHovered = true"
        @mouseout="isHovered = false"
        class="activity elevation-1">
        <v-chip :color="color" label disabled dark class="icon-container">
          <v-btn
            v-if="hasSubtypes"
            @click="toggleActivity({ _cid })"
            color="grey lighten-4"
            flat
            icon
            small>
            <v-icon size="26">mdi-{{ icon }}</v-icon>
          </v-btn>
          <v-icon v-else>mdi-file-document-box-outline</v-icon>
        </v-chip>
        <span class="activity-name">{{ data.name }}</span>
        <div v-show="isHovered" class="actions">
          <v-spacer/>
          <v-btn
            v-show="isEditable"
            :to="{ name: 'editor', params: { activityId: id } }"
            color="pink"
            outline
            small>
            Open
            <v-icon class="pl-1">mdi-square-edit-outline</v-icon>
          </v-btn>
          <v-btn
            v-show="hasSubtypes"
            @click="toggleActivity({ _cid })"
            icon
            small
            class="mx-0">
            <v-icon>mdi-chevron-{{ isExpanded ? 'up' : 'down' }}</v-icon>
          </v-btn>
          <v-btn @click="showOptions()" icon small class="ml-0">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </div>
      </div>
      <insert-activity
        ref="options"
        :anchor="{ id, parentId, courseId, type, position }"
        @expand="toggleActivity({ _cid, expanded: true })"/>
    </div>
    <div v-if="!isCollapsed({ _cid }) && hasChildren">
      <draggable
        :list="children"
        :options="{ handle: '.activity' }"
        @update="data => reorder(data, children)">
        <activity
          v-for="(subActivity, index) in children"
          v-bind="subActivity"
          :key="subActivity._cid"
          :index="index + 1"
          :level="level + 1"
          :activities="activities"
          class="sub-activity"/>
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex-module';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import find from 'lodash/find';
import InsertActivity from './InsertActivity';
import { isEditable } from 'shared/activities';
import map from 'lodash/map';
import reorderMixin from './reorderMixin';

export default {
  name: 'activity',
  mixins: [reorderMixin],
  inheritAttrs: false,
  props: {
    _cid: { type: String, required: true },
    id: { type: Number, default: null },
    parentId: { type: Number, default: null },
    courseId: { type: Number, required: true },
    level: { type: Number, required: true },
    index: { type: Number, required: true },
    position: { type: Number, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true },
    activities: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      isHovered: false
    };
  },
  computed: {
    ...mapGetters({
      structure: 'structure',
      focusedActivity: 'activity',
      isCollapsed: 'isCollapsed'
    }, 'course'),
    color() {
      return find(this.structure, { type: this.type }).color;
    },
    isEditable() {
      return isEditable(this.type);
    },
    isSelected() {
      return this.focusedActivity._cid === this._cid;
    },
    isExpanded() {
      return !this.isCollapsed({ _cid: this._cid });
    },
    hasSubtypes() {
      return this.level < this.structure.length;
    },
    hasChildren() {
      return (this.children.length > 0) && this.hasSubtypes;
    },
    children() {
      const level = this.level + 1;
      const types = map(filter(this.structure, { level }), 'type');
      return filter(this.activities, it => {
        return this.id && (this.id === it.parentId) && types.includes(it.type);
      }).sort((x, y) => x.position - y.position);
    },
    icon() {
      if (!this.hasSubtypes) return;
      let icon = this.isExpanded ? 'folder-open' : 'folder';
      if (!this.hasChildren) icon += '-outline';
      return icon;
    }
  },
  methods: {
    ...mapMutations(['focusActivity', 'toggleActivity'], 'course'),
    showOptions() {
      this.$refs['options'].$el.children[0].click();
    }
  },
  components: { Draggable, InsertActivity }
};
</script>

<style lang="scss" scoped>
.activity {
  display: flex;
  color: #424242;
  font-size: 20px;
  font-family: Roboto, sans-serif;
  font-weight: 300;
  background: #fff;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

  &.selected {
    color: #212121;
  }

  .icon-container {
    margin: 0;
    padding: 0;

    /deep/ span {
      padding: 0 10px;
      color: #fff;
    }

    .v-btn {
      margin: 0;
    }
  }

  .actions {
    display: flex;
    min-width: 165px;
    margin-left: auto;
  }
}

.activity-name {
  display: block;
  padding: 0 12px;
  line-height: 40px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sub-activity {
  margin-left: 44px;
}
</style>
