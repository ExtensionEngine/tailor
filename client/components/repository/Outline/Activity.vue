<template>
  <div>
    <div class="activity-wrapper">
      <div
        @click="selectActivity(id)"
        @mouseover="isHovered = true"
        @mouseout="isHovered = false"
        :id="`activity_${uid}`"
        :class="{
          selected: isSelected,
          highlighted: isHovered || isSelected,
          parent: hasSubtypes
        }"
        :style="{ 'border-left-color': color }"
        class="activity">
        <v-btn
          v-if="hasSubtypes"
          @click.stop="toggle()"
          icon
          class="my-auto">
          <v-icon size="30" color="primary darken-3">mdi-{{ icon }}</v-icon>
        </v-btn>
        <div class="activity-name h5 my-auto text-truncate">{{ data.name }}</div>
        <div v-show="isHighlighted" class="actions my-auto">
          <v-spacer />
          <options-toolbar
            :activity="{ id, uid, repositoryId, parentId, type, position, data }"
            class="options-toolbar my-auto" />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                v-show="hasSubtypes"
                v-on="on"
                @click="toggle()"
                color="primary darken-4"
                icon
                class="my-auto mx-0">
                <v-icon>mdi-chevron-{{ isExpanded ? 'up' : 'down' }}</v-icon>
              </v-btn>
            </template>
            <span>{{ isExpanded ? 'Collapse' : 'Expand' }}</span>
          </v-tooltip>
          <options-menu
            :activity="{ id, uid, repositoryId, parentId, type, position, data }"
            class="options-menu" />
        </div>
      </div>
    </div>
    <div v-if="!isCollapsed({ uid }) && hasChildren">
      <draggable
        @update="data => reorder(data, children)"
        :list="children"
        v-bind="{ handle: '.activity' }">
        <activity
          v-for="(subActivity, childIndex) in children"
          :key="subActivity.uid"
          v-bind="subActivity"
          :index="childIndex + 1"
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
    uid: { type: String, required: true },
    id: { type: Number, default: null },
    parentId: { type: Number, default: null },
    repositoryId: { type: Number, required: true },
    index: { type: Number, required: true },
    position: { type: Number, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true },
    activities: { type: Array, default: () => ([]) }
  },
  data: () => ({ isHovered: false }),
  computed: {
    ...mapGetters('repository', ['structure', 'isCollapsed']),
    ...mapState('repository', { outlineState: 'outline' }),
    config: vm => find(vm.structure, { type: vm.type }),
    color: vm => vm.config.color,
    isEditable: vm => isEditable(vm.type),
    isSelected: vm => vm.selectedActivity && (vm.selectedActivity.uid === vm.uid),
    isHighlighted: vm => vm.isHovered || vm.isSelected,
    isExpanded: vm => !vm.isCollapsed({ uid: vm.uid }),
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
      this.toggleActivity({ uid: this.uid, expanded });
    }
  },
  components: { Draggable, OptionsMenu, OptionsToolbar }
};
</script>

<style lang="scss" scoped>
$background-color:  #eceff1;

.activity {
  display: flex;
  height: 2.75rem;
  margin: 0.625rem 0;
  padding: 0 0 0 0.5rem;
  border-radius: 2px;
  background-color: $background-color;
  cursor: pointer;
  border-left-width: 4px;
  border-left-style: solid;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  &-name {
    padding: 0.125rem 0.75rem 0 0.375rem;
    color: #222;
    font-size: 1rem !important;
    font-weight: 400 !important;
    line-height: 2.5rem;
  }

  &.highlighted {
    opacity: 1;
    background-color: darken($background-color, 7);

    &.parent {
      padding-right: 1.25rem;
    }

    .activity-name {
      color: #111;
    }
  }

  &.selected {
    border-left-width: 2.25rem;
  }

  .actions {
    display: flex;
    min-width: 11.5rem;
    height: 100%;
    margin: 0 0 0 auto;
    padding: 0;

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

.sub-activity {
  margin-left: 1.25rem;
}
</style>
