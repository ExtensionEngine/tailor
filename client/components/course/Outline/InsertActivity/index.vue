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
    <div v-else>
      <select-action
        v-if="action !== 'create'"
        @selected="selected => (action = selected)"
        @close="hide" />
      <progress-dialog
        :show="isLoading"
        :status="loading.status"
        :label="loading.label"
        :width="500" />
      <template v-if="!isLoading">
        <create-activity
          v-if="action === 'create'"
          @create="createActivity"
          @close="hide"
          :parent="anchor"
          :supported-levels="supportedLevels" />
        <copy-activity
          v-if="action === 'copy'"
          @copy="copyActivities"
          @cancel="action = ''"
          :supported-levels="supportedLevels"
          :anchor-type="anchor.type" />
      </template>
    </div>
  </div>
</template>

<script>
import { getOutlineChildren, getParent } from 'utils/activity';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import calculatePosition from 'utils/calculatePosition';
import CopyActivity from './CopyActivity';
import CreateActivity from './CreateActivity';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import map from 'lodash/map';
import ProgressDialog from '@/components/common/ProgressDialog';
import Promise from 'bluebird';
import SelectAction from './SelectAction';

export default {
  props: {
    anchor: { type: Object, required: true }
  },
  data() {
    return {
      action: null,
      loading: { status: 0, label: '' }
    };
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters('course', ['structure']),
    ...mapState({ outlineState: s => s.course.outline }),
    showActions() {
      return this.anchor._cid === this.outlineState.showOptions;
    },
    isLoading() {
      return !!this.loading.label;
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
    formatActivity(it) {
      const { id: srcId, repositoryId: srcRepositoryId, type } = it;
      if (this.action === 'copy') it = { srcId, srcRepositoryId, type };
      it.repositoryId = this.anchor.repositoryId;
      it.parentId = this.resolveParent(it);
      it.position = this.calculatePosition(it);
      return it;
    },
    resetActivityState(item) {
      if (this.anchor.id === item.parentId) this.$emit('expand');
      this.hide();
      this.loading = { status: 0, label: '' };
    },
    createActivity(item) {
      const activity = this.formatActivity(item);
      return this.create(activity).then(() => this.resetActivityState(item));
    },
    copyActivities(items) {
      const increment = 100 / items.length;
      return Promise.each(items, it => {
        const activity = this.formatActivity(it);
        this.loading.label = `Copying "${it.name}..."`;
        return this.copy(activity).then(() => {
          this.loading.status += increment;
        });
      }).then(() => this.resetActivityState(items[0]));
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
  components: { CopyActivity, CreateActivity, ProgressDialog, SelectAction }
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
</style>
