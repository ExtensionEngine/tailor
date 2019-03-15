<template>
  <div>
    <div v-if="!showInput" @click="show" class="divider-wrapper">
      <div class="divider">
        <div class="action">
          <v-btn color="blue-grey darken-1" fab dark small>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <div v-else>
      <select-action
        v-if="!action"
        @selected="selected => (action = selected)"
        @close="hide">
      </select-action>
      <activity-browser
        v-else-if="action !== 'create'"
        :selectableLevels="supportedLevels"
        @selected="executeAction"
        @close="hide">
      </activity-browser>
      <create-activity
        v-else
        :parent="anchor"
        :supportedLevels="supportedLevels"
        @create="executeAction"
        @close="hide">
      </create-activity>
    </div>
  </div>
</template>

<script>
import { getLevel } from 'shared/activities';
import { getOutlineChildren, getParent } from 'utils/activity';
import { mapActions, mapGetters } from 'vuex-module';
import ActivityBrowser from 'components/common/ActivityBrowser';
import calculatePosition from 'utils/calculatePosition';
import CreateActivity from './CreateActivity';
import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import get from 'lodash/get';
import map from 'lodash/map';
import SelectAction from './SelectAction';

export default {
  props: {
    anchor: { type: Object, required: true }
  },
  data() {
    return {
      showInput: false,
      action: null
    };
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters(['structure'], 'course'),
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
    ...mapActions({ clone: 'clone', create: 'save' }, 'activities'),
    show() {
      this.showInput = true;
    },
    hide() {
      this.showInput = false;
      this.action = null;
    },
    executeAction(activity) {
      if (this.action === 'clone') {
        activity = {
          srcId: activity.id,
          srcCourseId: activity.courseId,
          type: activity.type
        };
      }
      activity.courseId = this.anchor.courseId;
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
  components: { ActivityBrowser, CreateActivity, SelectAction }
};
</script>

<style lang="scss" scoped>
.divider-wrapper {
  width: 100%;
  padding: 8px 0;
  cursor: pointer;
  opacity: 0;

  &:hover {
    opacity: 1;
  }

  .divider {
    position: relative;
    width: 100%;
    height: 2px;
    background-color: #717171;
    opacity: inherit;
    transition-delay: 0.2s;

    .action {
      position: absolute;
      top: -26px;
      right: -62px;
      height: 0;
      font-size: 16px;
      text-align: left;
    }
  }
}
</style>
