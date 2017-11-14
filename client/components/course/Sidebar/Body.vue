<template>
  <div class="body">
    <div class="meta-element">
      <meta-input
        v-for="it in metadata"
        :meta="it"
        :key="`${activity.id}${it.type}`"
        @update="updateActivity">
      </meta-input>
    </div>
    <prerequisites v-if="config.hasPrerequisites"></prerequisites>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Meta from 'components/common/Meta';
import Prerequisites from './Prerequisites';

export default {
  computed: {
    ...mapGetters(['activity'], 'course'),
    config() {
      return getLevel(this.activity.type) || {};
    },
    metadata() {
      if (!get(this.config, 'meta')) return [];
      return map(this.config.meta, it => {
        let value = get(this.activity, `data.${it.key}`);
        return { ...it, value };
      });
    }
  },
  methods: {
    ...mapActions(['update'], 'activities'),
    updateActivity(key, value) {
      const data = cloneDeep(this.activity.data) || {};
      data[key] = value;
      this.update({ _cid: this.activity._cid, data });
    }
  },
  components: {
    Prerequisites,
    MetaInput: Meta
  }
};
</script>

<style lang="scss" scoped>
.body {
  padding: 6px;
}
</style>
