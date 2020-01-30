<template>
  <div>
    <div class="activity-wrapper">
      <div
        @click="focus(showOptions)"
        @mouseover="isHovered = true"
        @mouseout="isHovered = false"
        :class="[isHighlighted ? 'elevation-9' : 'elevation-1']"
        :style="{ 'border-left': `8px solid ${color}` }"
        class="activity">
        <v-btn v-if="hasSubtypes" @click="toggle()" icon class="activity-icon">
          <v-icon size="30" color="primary darken-1">mdi-{{ icon }}</v-icon>
        </v-btn>
        <div class="activity-name text-truncate">{{ data.name }}</div>
        <div v-show="isHighlighted" class="actions">
          <v-spacer />
          <v-btn
            v-show="isEditable"
            :to="{ name: 'editor', params: { activityId: id } }"
            color="primary darken-1"
            outlined small>
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
          <activity-options
            :activity="{ id, _cid, repositoryId, parentId, type, position, data }"
            class="activity-options" />
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
import ActivityOptions from '@/components/repository/common/ActivityOptions';
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
    ...mapGetters('repository', {
      structure: 'structure',
      focusedActivity: 'activity',
      isCollapsed: 'isCollapsed'
    }),
    ...mapState({ outlineState: s => s.repository.outline }),
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
    ...mapMutations('repository',
      ['focusActivity', 'toggleActivity', 'showActivityOptions']),
    focus(options = false) {
      this.focusActivity(this._cid);
      return this.showActivityOptions(options ? this._cid : null);
    },
    toggle(expanded = !this.isExpanded) {
      this.toggleActivity({ _cid: this._cid, expanded });
    }
  },
  components: { ActivityOptions, Draggable, InsertActivity }
};
</script>

<style lang="scss" scoped>
.activity {
  display: flex;
  padding: 0 0 0 0.375rem;
  font-size: 1.125rem;
  background-color: #fcfcfc;
  border-radius: 2px;
  cursor: pointer;
  transition: all 1.5s cubic-bezier(0.25, 0.8, 0.25, 1);

  &-icon {
    margin: 0.125rem 0 0 0;
  }

  .actions {
    display: flex;
    min-width: 10.3125rem;
    margin-left: auto;

    .v-btn {
      margin: 0.375rem 0.5rem;
    }

    .activity-options ::v-deep .v-btn {
      height: 100%;
    }
  }
}

.activity-name {
  padding: 0.125rem 0.375rem 0;
  color: #424242;
  line-height: 2.375rem;
}

.sub-activity {
  margin-left: 2.125rem;
}
</style>
