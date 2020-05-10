import { mapGetters, mapMutations } from 'vuex';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { isEditable } from 'shared/activities';
import map from 'lodash/map';

export default {
  computed: {
    ...mapGetters('repository', ['structure', 'activities']),
    parent: vm => find(vm.activities, { id: vm.activity.parentId }),
    isEditable: vm => isEditable(vm.activity.type),
    levels: vm => vm.sameLevel.concat(vm.subLevels),
    sameLevel() {
      const sameLevelTypes = this.parent
        ? get(find(this.structure, { type: this.parent.type }), 'subLevels', [])
        : map(filter(this.structure, { level: 1 }), 'type');
      return filter(this.structure, it => sameLevelTypes.includes(it.type));
    },
    subLevels() {
      if (!this.activity) return [];
      const config = find(this.structure, { type: this.activity.type });
      const subLevels = get(config, 'subLevels', []);
      return filter(this.structure, it => subLevels.includes(it.type));
    }
  },
  methods: {
    ...mapMutations('repository', ['selectActivity', 'toggleActivity']),
    expandParent(item) {
      const { activity, parent } = this;
      const _cid = item.parentId === activity.id
        ? activity._cid
        : get(parent, '_cid');
      if (_cid) this.toggleActivity({ _cid, expanded: true });
    },
    selectActivity(activity) {
      this.$router.push({ query: { activityId: activity.id } });
    }
  }
};
