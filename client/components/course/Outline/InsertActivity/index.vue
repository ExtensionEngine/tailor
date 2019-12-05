<template>
  <div>
    <div v-if="!showActions" @click="show" class="divider-wrapper">
      <div class="divider">
        <div class="action">
          <v-btn color="blue-grey darken-1" dark small>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div v-else class="action-container">
      <select-action
        v-if="!action"
        @selected="selected => (action = selected)"
        @close="hide" />
      <activity-browser
        v-else-if="action !== 'create'"
        @selected="executeAction"
        @close="hide"
        :selectable-levels="supportedLevels" />
      <create-dialog
        v-else
        @close="hide"
        @expand="$emit('expand')"
        :repository-id="anchor.repositoryId"
        :levels="supportedLevels"
        :anchor="anchor" />
    </div>
  </div>
</template>

<script>
import { getOutlineChildren, getParent } from 'utils/activity';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import ActivityBrowser from 'components/common/ActivityBrowser';
import calculatePosition from 'utils/calculatePosition';
import CreateDialog from './CreateDialog';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import map from 'lodash/map';
import SelectAction from './SelectAction';

export default {
  props: {
    anchor: { type: Object, required: true }
  },
  data() {
    return {
      action: null
    };
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters('course', ['structure']),
    ...mapState({ outlineState: s => s.course.outline }),
    showActions() {
      return this.anchor._cid === this.outlineState.showOptions;
    },
    supportedLevels() {
      const grandParent = getParent(this.activities, this.anchor);
      const { subLevels = [] } = find(this.structure, { type: this.anchor.type });
      const sameLevel = grandParent
        ? get(find(this.structure, { type: grandParent.type }), 'subLevels', [])
        : map(filter(this.structure, { level: 1 }), 'type');
      const cond = l => subLevels.includes(l.type) || sameLevel.includes(l.type);
      return filter(this.structure, cond);
    }
  },
  methods: {
    ...mapActions('activities', { copy: 'clone', create: 'save' }),
    ...mapMutations('course', ['showActivityOptions', 'focusActivity']),
    show() {
      this.showActivityOptions(this.anchor._cid);
      this.focusActivity(this.anchor._cid);
    },
    hide() {
      this.showActivityOptions(null);
      this.action = null;
    },
    executeAction(activity) {
      if (this.action === 'copy') {
        activity = {
          srcId: activity.id,
          srcRepositoryId: activity.repositoryId,
          type: activity.type
        };
      }
      activity.repositoryId = this.anchor.repositoryId;
      activity.parentId = this.resolveParent(activity);
      activity.position = this.calculatePosition(activity);
      this[this.action](activity);
      if (this.anchor.id === activity.parentId) this.$emit('expand');
      this.hide();
    },
    isSameLevel(activity) {
      return getLevel(activity.type).level === getLevel(this.anchor.type).level;
    },
    resolveParent(activity) {
      return this.isSameLevel(activity) ? this.anchor.parentId : this.anchor.id;
    },
    calculatePosition(activity) {
      const items = getOutlineChildren(this.activities, activity.parentId);
      const newPosition = findIndex(items, { id: this.anchor.id });
      const isFirstChild = !this.isSameLevel(activity) || newPosition === -1;
      const context = { items, newPosition, isFirstChild, insert: true };
      return calculatePosition(context);
    }
  },
  components: { ActivityBrowser, CreateDialog, SelectAction }
};
</script>

<style lang="scss" scoped>
.divider-wrapper {
  margin-right: -6px;
  padding: 8px 0;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }

  .divider {
    position: relative;
    width: 100%;
    height: 2px;
    background-color: #717171;
    opacity: inherit;
    transition-delay: 0.05s;

    .action {
      position: absolute;
      top: -12px;
      right: -24px;
      height: 0;
    }

    .v-btn {
      $size: 24px;

      width: $size;
      min-width: $size;
      height: $size;

      .v-icon {
        font-size: 20px;
      }
    }
  }
}

.action-container {
  min-height: 1.125rem;
}
</style>
