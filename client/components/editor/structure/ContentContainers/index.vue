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
      :is="containerName"
      v-for="(container, index) in containerGroup"
      :key="container._cid || container.id"
      @addSubcontainer="save"
      @updateSubcontainer="update"
      @deleteSubcontainer="requestContainerDeletion"
      @saveElement="saveContentElement"
      @updateElement="updateElement"
      @reorderElement="reorderContentElements"
      @deleteElement="requestElementDeletion"
      @delete="requestContainerDeletion(container)"
      :container="container"
      :name="name"
      :position="index"
      :activities="activities"
      :tes="tes"
      v-bind="$attrs" />
    <div v-if="addBtnEnabled">
      <v-btn @click="addContainer" color="primary">
        <v-icon class="pr-2">mdi-plus</v-icon>
        Create {{ name }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import capitalize from 'lodash/capitalize';
import ContentContainer from './Container';
import EventBus from 'EventBus';
import get from 'lodash/get';
import { getContainerName } from 'tce-core/utils';
import isEmpty from 'lodash/isEmpty';
import maxBy from 'lodash/maxBy';
import throttle from 'lodash/throttle';

const appChannel = EventBus.channel('app');

export default {
  name: 'content-containers',
  inheritAttrs: false,
  inject: ['$ccRegistry'],
  props: {
    containerGroup: { type: Array, default() { return []; } },
    parentId: { type: Number, required: true },
    displayHeading: { type: Boolean, default: false },
    type: { type: String, required: true },
    label: { type: String, required: true },
    multiple: { type: Boolean, default: false },
    required: { type: Boolean, default: true }
  },
  computed: {
    ...mapState('repository/activities', { activities: 'items' }),
    ...mapState('repository/tes', { tes: 'items' }),
    containerName() {
      const { type, $ccRegistry: registry } = this;
      return registry.get(type) ? getContainerName(type) : 'content-container';
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
    ...mapActions('repository/activities', ['save', 'update', 'remove']),
    ...mapActions('repository/tes', {
      saveElement: 'save',
      updateElement: 'update',
      reorderElements: 'reorder',
      deleteElement: 'remove'
    }),
    addContainer() {
      const { type, parentId, nextPosition: position } = this;
      this.save({ type, parentId, position });
    },
    saveContentElement(element) {
      return this.saveElement(element).then(() => this.showNotification());
    },
    reorderContentElements({ newPosition, items }) {
      const element = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.reorderElements({ element, context });
    },
    requestDeletion(content, action, name) {
      appChannel.emit('showConfirmationModal', {
        title: `Delete ${name}?`,
        message: `Are you sure you want to delete ${name}?`,
        action: () => this[action](content)
      });
    },
    requestContainerDeletion(container, name = this.name) {
      this.requestDeletion(container, 'remove', name);
    },
    requestElementDeletion(element) {
      this.requestDeletion(element, 'deleteElement', 'element');
    },
    showNotification: throttle(function () {
      this.$snackbar.show('Element saved');
    }, 4000)
  },
  created() {
    if (this.required && isEmpty(this.containerGroup)) this.addContainer();
  },
  filters: {
    capitalize
  },
  components: { ContentContainer }
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
