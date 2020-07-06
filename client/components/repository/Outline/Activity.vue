<template>
  <div>
    <div class="activity-wrapper">
      <div
        @click="selectActivity(id)"
        @mouseover="isHovered = true"
        @mouseout="isHovered = false"
        :id="`activity_${_cid}`"
        :class="{
          selected: isSelected,
          'elevation-6': isHighlighted,
          'elevation-1': !isHighlighted
        }"
        :style="{ 'border-left-color': color }"
        class="activity">
        <v-btn
          v-if="hasSubtypes"
          @click.stop="toggle()"
          icon
          class="activity-icon">
          <v-icon size="30" color="blue-grey darken-3">mdi-{{ icon }}</v-icon>
        </v-btn>
        <div class="activity-name text-truncate">{{ data.name }}</div>
        <div v-show="isHighlighted" class="actions">
          <v-spacer />
          <options-toolbar
            :activity="{ id, _cid, repositoryId, parentId, type, position, data }"
            class="options-toolbar" />
          <v-btn
            v-show="hasSubtypes"
            @click="toggle()"
            color="blue-grey darken-4"
            icon small
            class="mx-0">
            <v-icon>mdi-chevron-{{ isExpanded ? 'up' : 'down' }}</v-icon>
          </v-btn>
          <options-menu
            :activity="{ id, _cid, repositoryId, parentId, type, position, data }"
            class="options-menu" />
        </div>
      </div>
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
import { isEditable } from 'shared/activities';
import OptionsMenu from '../common/ActivityOptions/Menu';
import OptionsToolbar from '../common/ActivityOptions/Toolbar';
import reorderMixin from './reorderMixin';
import selectActivity from '@/components/repository/common/selectActivity';
import size from 'lodash/size';

export default {
  name: 'activity',
  mixins: [reorderMixin, selectActivity],
  inheritAttrs: false,
  props: {
    /* eslint-disable-next-line vue/prop-name-casing */
    _cid: { type: String, required: true },
    id: { type: Number, default: null },
    parentId: { type: Number, default: null },
    repositoryId: { type: Number, required: true },
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
    ...mapGetters('repository', ['structure', 'isCollapsed']),
    ...mapState('repository', { outlineState: 'outline' }),
    config: vm => find(vm.structure, { type: vm.type }),
    color: vm => vm.config.color,
    isEditable: vm => isEditable(vm.type),
    isSelected: vm => vm.selectedActivity && (vm.selectedActivity._cid === vm._cid),
    isHighlighted: vm => vm.isHovered || vm.isSelected,
    isExpanded: vm => !vm.isCollapsed({ _cid: vm._cid }),
    hasSubtypes: vm => !!size(vm.config.subLevels),
    hasChildren: vm => (vm.children.length > 0) && vm.hasSubtypes,
    children() {
      const { subLevels } = this.config;
      return filter(this.activities, it => {
        return this.id && (this.id === it.parentId) && subLevels.includes(it.type);
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
    ...mapMutations('repository', ['toggleActivity']),
    toggle(expanded = !this.isExpanded) {
      this.toggleActivity({ _cid: this._cid, expanded });
    }
  },
  components: { Draggable, OptionsMenu, OptionsToolbar }
};
</script>

<style lang="scss" scoped>
.activity {
  display: flex;
  margin: 0.875rem 0;
  padding: 0 0 0 0.5rem;
  font-size: 1.125rem;
  background-color: #fafafa;
  border-radius: 2px;
  cursor: pointer;
  border-left-width: 8px;
  border-left-style: solid;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &.selected {
    background: #f5f5f5;
    border-left-width: 28px;

    > * {
      color: #111;
    }
  }

  &-icon {
    margin: 0.125rem 0 0 0;
  }

  .actions {
    display: flex;
    min-width: 11.5rem;
    margin-left: auto;

    .v-btn {
      margin: 0.375rem 0.5rem;
    }

    .options-menu ::v-deep .v-btn {
      height: 100%;
    }

    .options-toolbar {
      padding-top: 0.125rem;
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
