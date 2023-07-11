<template>
  <div>
    <v-hover v-slot="{ hover }" class="activity-wrapper">
      <div
        @mousedown="selectActivity(id)"
        :id="`activity_${uid}`"
        :style="{ 'border-left-color': config.color }"
        :class="{ selected: isSelected, highlighted: hover }"
        data-testid="repository__structureActivity"
        class="activity">
        <v-btn
          v-if="hasSubtypes"
          @mousedown.stop="toggle()"
          icon
          class="my-auto">
          <v-icon size="30" color="primary darken-3">mdi-{{ icon }}</v-icon>
        </v-btn>
        <div class="activity-name h5 my-auto text-truncate">{{ data.name }}</div>
        <div v-if="isSelected || hover" class="actions my-auto">
          <options-toolbar
            :activity="{ id, uid, repositoryId, parentId, type, position, data }"
            class="options-toolbar my-auto" />
          <v-tooltip bottom>
            <template #activator="{ on }">
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
    </v-hover>
    <div v-if="!isCollapsed({ uid }) && hasChildren">
      <draggable
        @update="data => reorder(data, children)"
        :list="children"
        v-bind="{ handle: '.activity' }">
        <outline-activity
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
import { mapGetters, mapMutations } from 'vuex';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import OptionsMenu from '../common/ActivityOptions/Menu.vue';
import OptionsToolbar from '../common/ActivityOptions/Toolbar.vue';
import reorderMixin from './reorderMixin';
import selectActivity from '@/components/repository/common/selectActivity';
import size from 'lodash/size';

export default {
  name: 'outline-activity',
  mixins: [reorderMixin, selectActivity],
  inheritAttrs: false,
  inject: ['$schemaService'],
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
  computed: {
    ...mapGetters('repository', ['structure', 'isCollapsed']),
    config: vm => vm.structure.find(it => it.type === vm.type),
    isSelected: vm => vm.selectedActivity && (vm.selectedActivity.uid === vm.uid),
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
$background-color: #eceff1;

.activity {
  display: flex;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  margin: 0.625rem 0;
  border-radius: 2px;
  height: 2.75rem;
  padding: 0 0 0 0.375rem;
  background-color: $background-color;
  cursor: pointer;
  border-left-width: 4px;
  border-left-style: solid;

  &-name {
    padding: 0.125rem 0.75rem 0 0.375rem;
    font-size: 1rem !important;
    line-height: 2.5rem;
    font-weight: 400 !important;
    color: #222;
  }

  &.selected, &.highlighted {
    opacity: 1;
    background-color: color.adjust($background-color, $lightness: -7%);

    .activity-name {
      color: #111;
    }
  }

  &.selected {
    border-left-width: 2.25rem;
  }

  .actions {
    display: flex;
    margin: 0 0 0 auto;
    height: 100%;
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
