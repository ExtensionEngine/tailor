<template>
  <div>
    <div class="activity-wrapper">
      <div
        @click="focus(showOptions)"
        @mouseover="isHovered = true"
        @mouseout="isHovered = false"
        :class="[isHighlighted ? 'elevation-9 selected': 'elevation-1']"
        class="activity">
        <v-chip :color="color" label dark class="icon-container">
          <v-btn
            v-if="hasSubtypes"
            @click="toggle()"
            text
            icon
            small>
            <v-icon size="26">mdi-{{ icon }}</v-icon>
          </v-btn>
          <v-icon v-else>mdi-file-document-box-outline</v-icon>
        </v-chip>
        <span class="activity-name grey--text text--darken-3">
          {{ data.name }}
        </span>
        <div v-show="isHighlighted" class="actions">
          <v-spacer />
          <v-btn
            v-show="isEditable"
            :to="{ name: 'editor', params: { activityId: id } }"
            color="pink"
            outlined
            small>
            Open
          </v-btn>
          <v-btn
            v-show="hasSubtypes"
            @click="toggle()"
            icon
            small
            class="mx-0">
            <v-icon>mdi-chevron-{{ isExpanded ? 'up' : 'down' }}</v-icon>
          </v-btn>
          <v-btn
            @click="focus(!showOptions)"
            icon
            small
            class="ml-0">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </div>
      </div>
      <insert-activity
        @expand="toggle(true)"
        :anchor="{ id, _cid, parentId, repositoryId, type, position, level }" />
    </div>
    <div v-if="!isCollapsed({ _cid }) && hasChildren">
      <draggable
        @update="data => reorder(data, children)"
        :list="children"
        v-bind="{ handle: '.activity' }">
        <activity
          v-for="(subActivity, childIndex) in children"
          :key="subActivity._cid"
          v-bind="subActivity"
          :index="childIndex + 1"
          :level="level + 1"
          :activities="activities"
          class="sub-activity" />
      </draggable>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import find from 'lodash/find';
import InsertActivity from './InsertActivity';
import { isEditable } from 'shared/activities';
import map from 'lodash/map';
import reorderMixin from './reorderMixin';
import size from 'lodash/size';

export default {
  name: 'activity',
  mixins: [reorderMixin],
  inheritAttrs: false,
  props: {
    /* eslint-disable-next-line vue/prop-name-casing */
    _cid: { type: String, required: true },
    id: { type: Number, default: null },
    parentId: { type: Number, default: null },
    repositoryId: { type: Number, required: true },
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
    ...mapGetters('course', {
      structure: 'structure',
      focusedActivity: 'activity',
      isCollapsed: 'isCollapsed'
    }),
    ...mapState({ outlineState: s => s.course.outline }),
    config() {
      return find(this.structure, { type: this.type });
    },
    color() {
      return this.config.color;
    },
    isEditable() {
      return isEditable(this.type);
    },
    isSelected() {
      return this.focusedActivity._cid === this._cid;
    },
    isHighlighted() {
      return this.isHovered || this.isSelected;
    },
    isExpanded() {
      return !this.isCollapsed({ _cid: this._cid });
    },
    hasSubtypes() {
      return !!size(this.config.subLevels);
    },
    hasChildren() {
      return (this.children.length > 0) && this.hasSubtypes;
    },
    showOptions() {
      return this._cid === this.outlineState.showOptions;
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
    ...mapMutations('course',
      ['focusActivity', 'toggleActivity', 'showActivityOptions']),
    focus(options = false) {
      this.focusActivity(this._cid);
      return this.showActivityOptions(options ? this._cid : null);
    },
    toggle(expanded = !this.isExpanded) {
      this.toggleActivity({ _cid: this._cid, expanded });
    }
  },
  components: { Draggable, InsertActivity }
};
</script>

<style lang="scss" scoped>
.activity {
  display: flex;
  font-size: 18px;
  background: #fff;
  border-radius: 2px;
  cursor: pointer;
  transition: all 1.5s cubic-bezier(0.25, 0.8, 0.25, 1);

  &.selected {
    color: #414141;
  }

  .icon-container {
    height: inherit;
    margin: 0;
    padding: 0;
    border-radius: 0 !important;

    ::v-deep span {
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

    .v-btn {
      margin: 6px 8px;
    }
  }
}

.activity-name {
  display: block;
  padding: 2px 12px 0;
  line-height: 38px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sub-activity {
  margin-left: 44px;
}
</style>
