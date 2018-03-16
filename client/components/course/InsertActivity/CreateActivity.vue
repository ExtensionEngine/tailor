<template>
  <div class="activity-input">
    <span
      :class="{ 'has-error': vErrors.has('name') }"
      class="form-group name-input">
      <input
        v-model="name"
        v-focus.lazy="true"
        v-validate="{ rules: { required: true, min: 2, max: 250 } }"
        class="form-control"
        name="name"
        type="text"
        placeholder="Title">
      <span class="help-block">{{ vErrors.first('name') }}</span>
    </span>
    <multiselect
      v-if="hasChildren"
      v-validate="'required'"
      :value="type ? getActivityLevel(type) : supportedLevels[0]"
      :options="supportedLevels"
      :searchable="false"
      @input="onLevelSelected"
      data-vv-delay="0"
      class="type-select">
    </multiselect>
    <div class="actions">
      <button
        @click.stop="$emit('close')"
        class="btn btn-default btn-sm btn-material pull-right">X
      </button>
      <button
        :disabled="vErrors.any()"
        @click.stop="create"
        class="btn btn-default btn-sm btn-material add pull-right">
        Add
      </button>
    </div>
  </div>
</template>

<script>
import { focus } from 'vue-focus';
import { getLevel } from 'shared/activities';
import { mapGetters } from 'vuex-module';
import { withValidation } from 'utils/validation';

import ActivityBrowser from 'components/common/ActivityBrowser';
import get from 'lodash/get';
import multiselect from 'components/common/Select';
import SelectAction from './SelectAction';

export default {
  mixins: [withValidation()],
  props: ['parent', 'supportedLevels'],
  data() {
    return {
      name: '',
      type: ''
    };
  },
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters(['structure'], 'course'),
    hasChildren() {
      return this.levelPosition < this.structure.length;
    },
    levelPosition() {
      return this.parent ? getLevel(this.parent.type).level : 1;
    }
  },
  methods: {
    create() {
      this.$validator.validateAll().then(result => {
        if (!result) return;
        this.$emit('create', { type: this.type, data: { name: this.name } });
      });
    },
    getActivityLevel(type) {
      return getLevel(type);
    },
    onLevelSelected(activity) {
      this.type = get(activity, 'type', null);
    }
  },
  mounted() {
    this.type = this.supportedLevels[0].type;
  },
  directives: { focus },
  components: { multiselect, SelectAction, ActivityBrowser }
};
</script>

<style lang="scss" scoped>
.activity-input {
  display: flex;
  align-items: stretch;
  flex-flow: row nowrap;
  justify-content: space-between;
  padding: 20px 5px;

  input {
    background-color: #e0e0e0;
  }

  .btn-sm.btn-material {
    min-width: 68px;
    padding: 8px 0;
  }

  .type-select {
    width: 170px;
    min-width: 170px;
    margin-left: 25px;
  }

  .actions {
    width: 150px;
    min-width: 150px;
    margin-left: 10px;
  }

  .name-input {
    width: 100%;
  }
}

.btn.add {
  margin-right: 3px;
}
</style>
