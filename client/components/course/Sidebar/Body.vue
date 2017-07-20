<template>
  <div class="body">
    <div class="row-a">
      <label>Name</label>
      <div v-show="showNameInput" :class="{ 'has-error': vErrors.has('name') }">
        <textarea
          v-model="nameInput"
          v-validate="{ rules: { required: true, min: 2, max: 150 } }"
          @blur="focusoutName"
          @keyup.enter="focusoutName"
          @keyup.esc="hideNameInput"
          ref="nameInput"
          name="name"
          class="form-control">
        </textarea>
        <span class="help-block">{{ vErrors.first('name') }}</span>
      </div>
      <div v-show="!showNameInput" @click.stop="focusName">
        <div class="title">{{ name }}</div>
      </div>
    </div>
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
import get from 'lodash/get';
import { getLevel } from 'shared/activities';
import Input from './Input';
import map from 'lodash/map';
import { mapActions, mapGetters } from 'vuex-module';
import Prerequisites from './Prerequisites';
import Select from './Select';
import ColorPicker from './ColorPicker/';
import Switch from './Switch';
import Textarea from './Textarea';

const noop = Function.prototype;

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
      return getLevel(this.activity.type);
    },
    metadata() {
      if (!this.activity) return [];
      return map(this.level.meta, it => {
        let value = get(this.activity, `data.${it.key}`);
        return { ...it, value };
      });
    }
  },
  methods: {
    ...mapActions(['remove', 'update'], 'activities'),
    focusName() {
      this.nameInput = this.activity.name;
      this.showNameInput = true;
      setTimeout(() => this.$refs.nameInput.focus(), 0);
    },
    focusoutName() {
      this.$validator.validateAll().then(() => {
        if (this.nameInput === this.activity.name) {
          this.showNameInput = false;
          return;
        }
        this.update({ _cid: this.activity._cid, name: this.nameInput });
        this.showNameInput = false;
      }, noop);
    },
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
  watch: {
    name(val) {
      this.nameInput = val;
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
  }
};
</script>

<style lang="scss" scoped>
.body {
  padding: 6px;
}

.title {
  height: 100px;
  margin: 5px 3px 5px 0;
  font-size: 17px;
  line-height: 24px;
  word-wrap: break-word;
  font-weight: normal;
  color: #333;
}

.form-control {
  font-size: 17px;
  letter-spacing: 0.1px;
}

textarea {
  margin: 5px 0;
  height: 100px;
  resize: none;
}

.help-block {
  margin-bottom: 0;
}

label {
  color: gray;
}

.row-a {
  height: 155px;
  padding: 3px 8px;

  &:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
}
</style>
