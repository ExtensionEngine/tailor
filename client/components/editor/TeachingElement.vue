<template>
  <div>
    <div v-if="activeUsers.length" class="active-users-wrapper">
      <active-users :users="activeUsers" theme="light" size="26"/>
    </div>
    <contained-content
      v-bind="$attrs"
      :element="element"
      :isDragged="dragged"
      :isDisabled="disabled"
      @add="add"
      @save="save"
      @delete="remove"/>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex-module';
import ActiveUsers from 'components/common/ActiveUsers';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import EventBus from 'EventBus';
import throttle from 'lodash/throttle';

export default {
  name: 'teaching-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false }
  },
  computed: {
    activeUsers() {
      return [
        { id: 2, email: 'toma@e.com' },
        { id: 1, email: 'ilija@e.com' }
      ];
    }
  },
  methods: {
    ...mapActions({ saveElement: 'save', removeElement: 'remove' }, 'tes'),
    ...mapMutations({ addElement: 'add' }, 'tes'),
    add(element) {
      this.addElement({ ...this.element, ...cloneDeep(element) });
    },
    save(data) {
      const element = cloneDeep(this.element);
      Object.assign(element.data, data);
      if (element.embedded) return this.$emit('save', element);
      return this.saveElement(element)
        .then(() => this.showNotification());
    },
    showNotification: throttle(function () {
      const opts = { color: 'primary', right: true };
      this.$snackbar.show('Element saved', opts);
    }, 4000),
    remove() {
      this.removeElement(this.element).then(() => {
        this.$nextTick(() => EventBus.emit('element:focus'));
      });
    }
  },
  components: { ActiveUsers, ContainedContent }
};
</script>

<style lang="scss">
.active-users-wrapper {
  display: flex;
  justify-content: flex-end;
  height: 30px;
  margin-bottom: -2px;
}
</style>
