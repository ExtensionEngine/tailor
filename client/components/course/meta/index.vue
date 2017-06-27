<template>
  <div class="meta-element">
    <component
      v-for="meta in metas"
      :is="resolveElement(meta.type)"
      :meta="meta"
      :key="`${activity.id}${meta.type}`"
      @update="updateActivity">
    </component>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import map from 'lodash/map';
import { mapActions } from 'vuex-module';
import MetaInput from './MetaInput';
import MetaTextarea from './MetaTextarea';

const META_TYPES = {
  INPUT: 'meta-input',
  TEXTAREA: 'meta-textarea'
};

export default {
  props: ['activity'],
  computed: {
    metas() {
      if (!this.activity) return [];
      const properties = getLevel(this.activity.type).meta;
      return map(properties, it => {
        let value = get(this.activity, `data.${it.key}`);
        return { ...it, value };
      });
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    resolveElement(type) {
      return META_TYPES[type];
    },
    updateActivity(key, value) {
      const data = cloneDeep(this.activity.data) || {};
      data[key] = value;
      this.update({
        _cid: this.activity._cid,
        data
      });
    }
  },
  components: {
    MetaInput,
    MetaTextarea
  }
};
</script>
