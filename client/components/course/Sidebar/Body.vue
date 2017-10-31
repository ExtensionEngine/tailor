<template>
  <div class="body">
    <div class="meta-element">
      <component
        v-for="data in metadata"
        :is="tagname(data.type)"
        :meta="data"
        :key="`${activity.id}${data.type}`"
        @update="updateActivity">
      </component>
    </div>
    <prerequisites v-if="level.hasPrerequisites"></prerequisites>
  </div>
</template>

<script>
import Checkbox from './Checkbox';
import cloneDeep from 'lodash/cloneDeep';
import ColorPicker from './ColorPicker/';
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import Input from './Input';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Prerequisites from './Prerequisites';
import Select from './Select';
import Switch from './Switch';
import Textarea from './Textarea';

const META_TYPES = {
  CHECKBOX: Checkbox,
  COLOR: ColorPicker,
  INPUT: Input,
  SELECT: Select,
  SWITCH: Switch,
  TEXTAREA: Textarea
};

export default {
  data() {
    return {
      nameInput: '',
      showNameInput: false
    };
  },
  computed: {
    ...mapGetters(['activity'], 'course'),
    name() {
      return this.activity.name;
    },
    level() {
      return getLevel(this.activity.type) || {};
    },
    metadata() {
      if (!get(this.level, 'meta')) return [];
      return map(this.level.meta, it => {
        let value = get(this.activity, `data.${it.key}`);
        return { ...it, value };
      });
    }
  },
  methods: {
    ...mapActions(['remove', 'update'], 'activities'),
    tagname(type = '') {
      const component = META_TYPES[type.toUpperCase()] || META_TYPES.INPUT;
      return component.name;
    },
    updateActivity(key, value) {
      const data = cloneDeep(this.activity.data) || {};
      data[key] = value;
      this.update({ _cid: this.activity._cid, data });
    }
  },
  components: {
    [Checkbox.name]: Checkbox,
    [Input.name]: Input,
    [Select.name]: Select,
    [Switch.name]: Switch,
    [Textarea.name]: Textarea,
    ColorPicker,
    Prerequisites
  },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.body {
  padding: 6px;
}

.title {
  height: 100px;
  margin: 5px 3px 5px 0;
  color: #333;
  font-size: 17px;
  font-weight: normal;
  line-height: 24px;
  word-wrap: break-word;
}

.form-control {
  font-size: 17px;
  letter-spacing: 0.1px;
}

textarea {
  height: 100px;
  margin: 5px 0;
  resize: none;
}

.help-block {
  margin-bottom: 0;
}

label {
  color: gray;
}
</style>
