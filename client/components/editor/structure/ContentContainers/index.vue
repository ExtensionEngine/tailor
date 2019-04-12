<template>
  <div class="content-containers">
    <h2 v-if="displayHeading">{{ name | capitalize }}</h2>
    <div v-if="!containerGroup.length" class="well">
      Click the button below to create first {{ name | capitalize }}.
    </div>
    <content-container
      v-for="container in containerGroup"
      :key="container._cid || container.id"
      :container="container"
      :types="types"
      :name="name"
      :layout="layout"
      :class="`${name}-container`"
      @delete="deleteContainer(container)"
      class="content-container">
    </content-container>
    <div v-if="addBtnEnabled">
      <button @click="addContainer" class="add-btn btn btn-primary btn-material">
        <span class="add-icon mdi mdi-plus"></span>
        Create {{ name }}
      </button>
    </div>
  </div>
</template>

<script>
import capitalize from 'lodash/capitalize';
import ContentContainer from './Container';
import EventBus from 'EventBus';
import get from 'lodash/get';
import { mapActions } from 'vuex-module';
import maxBy from 'lodash/maxBy';

const appChannel = EventBus.channel('app');

export default {
  name: 'content-containers',
  props: {
    containerGroup: { type: Array, default() { return []; } },
    parentId: { type: Number, required: true },
    types: { type: Array, default: null },
    displayHeading: { type: Boolean, default: false },
    type: { type: String, required: true },
    label: { type: String, required: true },
    multiple: { type: Boolean, default: false },
    layout: { type: Boolean, default: true }
  },
  computed: {
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
    ...mapActions(['save', 'remove'], 'activities'),
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
  filters: {
    capitalize(val) {
      return capitalize(val);
    }
  },
  components: { ContentContainer }
};
</script>

<style lang="scss" scoped>
.content-containers {
  margin: 70px 0;
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
  box-shadow: 0 1px 4px rgba(0,0,0,0.3);
}

.add-btn {
  min-width: 300px;
  margin: 30px 0 0;
}

.add-icon {
  padding-right: 3px;
}
</style>
