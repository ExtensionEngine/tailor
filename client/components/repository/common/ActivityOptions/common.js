import { mapGetters, mapMutations } from 'vuex';
import find from 'lodash/find';
import get from 'lodash/get';
import InsertLocation from '@/utils/InsertLocation';
import { isEditable } from 'shared/activities';
import selectActivity from '@/components/repository/common/selectActivity';
import uniqBy from 'lodash/uniqBy';

const { ADD_AFTER, ADD_BEFORE, ADD_INTO } = InsertLocation;

export default {
  mixins: [selectActivity],
  computed: {
    ...mapGetters('repository', ['structure', 'activities']),
    parent: vm => find(vm.activities, { id: vm.activity.parentId }),
    isEditable: vm => isEditable(vm.activity.type),
    levels: vm => uniqBy(vm.sameLevel.concat(vm.subLevels), 'type'),
    sameLevel() {
      if (!this.parent) return this.structure.filter(it => it.rootLevel);
      const parentConfig = find(this.structure, { type: this.parent.type });
      const sameLevelTypes = get(parentConfig, 'subLevels', []);
      return this.structure.filter(it => sameLevelTypes.includes(it.type));
    },
    subLevels() {
      if (!this.activity) return [];
      const config = find(this.structure, { type: this.activity.type });
      const subLevels = get(config, 'subLevels', []);
      return this.structure.filter(it => subLevels.includes(it.type));
    },
    dialogHeading: ({ action }) => {
      const heading = {
        [ADD_BEFORE]: 'Add above',
        [ADD_AFTER]: 'Add below',
        [ADD_INTO]: 'Add into'
      };
      return heading[action];
    }
  },
  methods: {
    ...mapMutations('repository', ['toggleActivity']),
    expandParent(item) {
      const { activity, parent } = this;
      const _cid = item.parentId === activity.id
        ? activity._cid
        : get(parent, '_cid');
      if (_cid) this.toggleActivity({ _cid, expanded: true });
    }
  }
};
