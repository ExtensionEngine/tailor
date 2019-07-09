<template>
  <div class="content-containers">
    <h2 v-if="displayHeading">{{ name | capitalize }}</h2>
    <v-alert
      :value="!containerGroup.length"
      color="white"
      icon="mdi-information-variant">
      Click the button below to create first {{ name | capitalize }}.
    </v-alert>
    <component
      v-for="(container, index) in containerGroup"
      :key="container._cid || container.id"
      :is="containerName"
      v-bind="$attrs"
      :container="container"
      :name="name"
      :position="index"
      @delete="deleteContainer(container)"/>
    <div v-if="addBtnEnabled">
      <v-btn @click="addContainer" color="primary">
        <v-icon class="pr-2">mdi-plus</v-icon>
        Create {{ name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize';
import ContentContainer from './Container';
import EventBus from 'EventBus';
import Exam from '../Exam';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { mapActions } from 'vuex';
import maxBy from 'lodash/maxBy';
import toCase from 'to-case';

const appChannel = EventBus.channel('app');

export default {
  name: 'content-containers',
  inheritAttrs: false,
  props: {
    containerGroup: { type: Array, default() { return []; } },
    parentId: { type: Number, required: true },
    displayHeading: { type: Boolean, default: false },
    type: { type: String, required: true },
    label: { type: String, required: true },
    multiple: { type: Boolean, default: false },
    unique: { type: Boolean, default: false }
  },
  computed: {
    containerName() {
      if (this.unique) return toCase.slug(this.type);
      return 'content-container';
    },
    name() {
      return this.label.toLowerCase();
    },
    addBtnEnabled() {
      return !(!this.multiple && this.containerGroup.length);
    },
    nextPosition() {
      const last = get(maxBy(this.containerGroup, 'position'), 'position', 0);
      return last + 1;
    }
  },
  methods: {
    ...mapActions('activities', ['save', 'remove']),
    addContainer() {
      const { type, parentId, nextPosition: position } = this;
      this.save({ type, parentId, position });
    },
    deleteContainer(container) {
      appChannel.emit('showConfirmationModal', {
        title: `Delete ${this.name}?`,
        message: `Are you sure you want to delete ${this.name}?`,
        action: () => this.remove(container)
      });
    }
  },
  created() {
    if (isEmpty(this.containerGroup)) this.addContainer();
  },
  filters: {
    capitalize(val) {
      return capitalize(val);
    }
  },
  components: { ContentContainer, Exam }
};
</script>

<style lang="scss" scoped>
.content-containers {
  margin: 70px 0;

  > .v-alert {
    margin: 30px 0;
    color: #555;
  }
}

h2 {
  margin: 50px 0 20px;
  padding: 0;
  color: #444;
  font-size: 18px;
  text-align: left;
}

.content-container {
  width: 100%;
  min-height: 245px;
  margin: 25px 0;
  padding: 20px 40px;
  background-color: #fff;
}
</style>
