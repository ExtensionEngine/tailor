<template>
  <div class="prerequisite">
    <label>Prerequisite</label>
    <multiselect
      :value="prerequisite"
      :options="prerequisites"
      :searchable="true"
      :disabled="!prerequisites.length"
      :trackBy="'id'"
      :label="'name'"
      :placeholder="prerequisitePlaceholder"
      @input="onPrerequisiteSelected">
    </multiselect>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters } from 'vuex-module';
import Select from '../../common/Select';
import set from 'lodash/set';

export default {
  name: 'prerequisite',
  data() {
    return { prerequisite: null };
  },
  computed: {
    ...mapGetters(['activity', 'activities'], 'course'),
    prerequisites() {
      const cond = it => getLevel(it.type) && it.id !== this.activity.id;
      return filter(this.activities, cond);
    },
    prerequisitePlaceholder() {
      return isEmpty(this.prerequisites) ? `No activities` : `Select prerequisite`;
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    onPrerequisiteSelected(prerequisite) {
      this.prerequisite = prerequisite;
      const data = cloneDeep(this.activity.data) || {};
      set(data, '_refs.prerequisiteId', this.prerequisite.id);
      this.update({ _cid: this.activity._cid, data });
    }
  },
  mounted() {
    const prerequisiteId = get(this.activity, 'data._refs.prerequisiteId');
    if (!prerequisiteId) return;
    this.prerequisite = find(this.activities, { id: prerequisiteId });
  },
  components: { multiselect: Select }
};
</script>

<style lang="scss" scoped>
.prerequisite {
  height: 96px;
  padding: 3px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
}
</style>

<style lang="scss">
.prerequisite {
  input {
    height: 32px;
  }
}
</style>
