<template>
  <div class="te-wrapper">
    <slot/>
    <contained-content
      v-bind="$attrs"
      :element="element"
      :isDragged="dragged"
      :isDisabled="disabled"
      :style="elementStyle"
      @add="add"
      @save="save"
      @delete="remove"/>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import ActiveUsers from 'components/common/ActiveUsers';
import cloneDeep from 'lodash/cloneDeep';
import { ContainedContent } from 'tce-core';
import EventBus from 'EventBus';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';

export default {
  name: 'teaching-element',
  inheritAttrs: false,
  props: {
    element: { type: Object, required: true },
    disabled: { type: Boolean, default: false },
    dragged: { type: Boolean, default: false },
    elementStyle: { type: Object, default: () => null }
  },
  data() {
    return {
      isFocused: false
    };
  },
  computed: {
    ...mapState('activeUsers', ['sseId'])
  },
  methods: {
    ...mapActions('activeUsers', {
      addActiveUserContext: 'add',
      removeActiveUserContext: 'remove'
    }),
    ...mapActions('tes', { saveElement: 'save', removeElement: 'remove' }),
    ...mapMutations('tes', { addElement: 'add' }),
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
      this.$snackbar.show('Element saved');
    }, 4000),
    remove() {
      this.removeElement(this.element).then(() => {
        this.$nextTick(() => EventBus.emit('element:focus'));
      });
    },
    getContext() {
      const { courseId, activityId, contentId: elementId } = this.element;
      const { sseId } = this;
      const created = new Date();
      return { courseId, activityId, elementId, sseId, created };
    }
  },
  watch: {
    isFocused() {
      if (this.isFocused) {
        this.addActiveUserContext(this.getContext());
        return;
      }
      this.removeActiveUserContext(this.getContext());
    }
  },
  created() {
    EventBus.on('element:focus', element => {
      this.isFocused = !!element && (element.id === this.element.id);
    });
  },
  beforeDestroy() {
    this.removeActiveUserContext(omit(this.getContext(), 'created'));
  },
  components: { ActiveUsers, ContainedContent }
};
</script>
