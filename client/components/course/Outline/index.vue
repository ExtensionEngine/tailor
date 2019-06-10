<template>
  <div class="outline-page">
    <v-progress-circular v-if="showLoader" color="primary" indeterminate/>
    <div v-else class="outline">
      <div class="activity-container">
        <v-toolbar
          v-if="!isFlat"
          color="grey lighten-3"
          flat
          dense>
          <v-spacer/>
          <v-btn
            @click="toggleActivities"
            color="primary"
            flat>
            Toggle all
          </v-btn>
        </v-toolbar>
        <draggable
          :list="rootActivities"
          :options="{ handle: '.activity' }"
          @update="data => reorder(data, rootActivities)">
          <activity
            v-for="(activity, index) in rootActivities"
            v-bind="activity"
            :key="activity._cid"
            :index="index + 1"
            :level="1"
            :activities="outlineActivities"/>
        </draggable>
        <no-activities v-if="!rootActivities.length"/>
      </div>
      <sidebar/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Activity from './Activity';
import api from '../../../api/course';
import Draggable from 'vuedraggable';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import NoActivities from './NoActivities';
import reorderMixin from './reorderMixin';
import Sidebar from '../Sidebar';

export default {
  mixins: [reorderMixin],
  props: {
    showLoader: { type: Boolean, default: false }
  },
  data: () => ({ timer: null }),
  computed: {
    ...mapGetters(['structure', 'outlineActivities', 'activeUsers'], 'course'),
    isFlat() {
      const types = map(filter(this.structure, { level: 2 }), 'type');
      if (!types.length) return false;
      return !find(this.outlineActivities, it => types.includes(it.type));
    },
    rootActivities() {
      const types = map(filter(this.structure, { level: 1 }), 'type');
      return filter(this.outlineActivities, it => types.includes(it.type))
        .sort((x, y) => x.position - y.position);
    }
  },
  methods: {
    ...mapActions(['subscribe'], 'course'),
    ...mapMutations(['toggleActivities'], 'course')
  },
  watch: {
    activeUsers: {
      handler() {
        const { courseId } = this.$route.params;
        const users = this.activeUsers.course[courseId];
        this.$emit('setActiveUsers', users);
      },
      immediate: true
    }
  },
  mounted() {
    const { courseId } = this.$route.params;
    this.subscribe(courseId);
    api.addActiveUser({ courseId });
    this.timer = setInterval(() => api.addActiveUser({ courseId }), 4000);
  },
  beforeRouteLeave(to, from, next) {
    const { courseId } = this.$route.params;
    api.removeActiveUser({ courseId });
    clearInterval(this.timer);
    next();
  },
  components: { Activity, Draggable, NoActivities, Sidebar }
};
</script>

<style lang="scss" scoped>
.outline-page {
  height: 100%;

  .v-progress-circular {
    margin-top: 120px;
  }
}

.outline {
  position: relative;
  height: 100%;
  padding-right: 450px;
}

.activity-container {
  width: 100%;
  height: 100%;
  float: left;
  padding: 50px 90px 0 60px;
  overflow-y: scroll;
  overflow-y: overlay;

  /deep/ {
    > :last-child {
      margin-bottom: 120px;
    }
  }
}

/deep/ .v-toolbar__content {
  padding: 0;
}
</style>
