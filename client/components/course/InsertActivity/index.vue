<template>
  <div>
    <div v-if="!showInput" @click="show" class="divider-wrapper">
      <div class="divider">
        <div class="action">
          <span class="mdi mdi-plus plus"></span>
        </div>
      </div>
    </div>
    <div v-else>
      <select-action
        v-if="!action"
        @selected="action => (this.action = action)"
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
        :parent="parent"
        :supportedLevels="supportedLevels"
        @save="executeAction"
        @close="hide">
      </create-activity>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import ActivityBrowser from 'components/common/ActivityBrowser';
import CreateActivity from './CreateActivity';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import SelectAction from './SelectAction';

export default {
  props: ['parent'],
  data() {
    return {
      showInput: false,
      action: null
    };
  },
  computed: {
    ...mapGetters(['course', 'structure'], 'course'),
    supportedLevels() {
      if (!this.parent) return filter(this.structure, { level: 1 });
      const parentType = find(this.structure, { type: this.parent.type });
      const { level, subLevels = [] } = parentType;
      const cond = it => subLevels.includes(it.type) || (it.level === level);
      let levels = filter(this.structure, cond);
      levels.forEach(it => (it.value = it.type));
      return levels;
    }
  },
  methods: {
    ...mapActions(['save', 'clone'], 'activities'),
    show() {
      this.showInput = true;
    },
    hide() {
      this.showInput = false;
      this.action = null;
    },
    executeAction(activity) {
      if (this.action === 'clone') {
        const dstParentId = activity.type === get(this.parent, 'type')
          ? this.parent.parentId
          : this.parent.id;
        activity = {
          ...activity,
          dstRepositoryId: this.course.id,
          dstParentId
        }
      }
      this[this.action](activity);
      this.hide();
    }
  },
  components: { ActivityBrowser, CreateActivity, SelectAction }
};
</script>

<style lang="scss" scoped>
.plus {
  padding: 0 5px;
  font-size: 20px;
  line-height: 20px;
}

.btn {
  &.add {
    margin-right: 3px;
  }
}
</style>
