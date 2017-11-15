<template>
  <div class="content-containers">
    <h2 v-if="displayHeading">{{ heading }}</h2>
    <div v-if="!activities.length" class="well">
      Click the button below to create first {{ heading }}.
    </div>
    <content-container
      v-for="activity in activities"
      :key="activity.id"
      :activity="activity"
      :types="types"
      :class="`${name}-container`"
      @delete="deleteContainer(activity)"
      class="content-container">
    </content-container>
    <div v-if="addBtnEnabled">
      <button @click="addContainer" class="add-btn btn btn-primary">
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
import { mapActions } from 'vuex-module';
import reduce from 'lodash/reduce';

const appChannel = EventBus.channel('app');

export default {
  name: 'content-containers',
  props: {
    activities: { type: Array, default() { return []; } },
    parentId: { type: Number, required: true },
    types: { type: Array, required: false },
    displayHeading: { type: Number, default: false },
    type: { type: String, required: true },
    label: { type: String, required: true },
    single: { type: Boolean, default: false }
  },
  computed: {
    heading() {
      return capitalize(this.label);
    },
    name() {
      return this.label.toLowerCase();
    },
    addBtnEnabled() {
      return !(this.single && this.activities.length);
    },
    nextPosition() {
      const max = reduce(this.activities, (max, { position }) => {
        return position > max ? position : max;
      }, 0);
      return max + 1;
    }
  },
  methods: {
    ...mapActions(['save', 'remove'], 'activities'),
    addContainer() {
      const { type, parentId, nextPosition: position } = this;
      this.save({ type, parentId, position });
    },
    deleteContainer(activity) {
      appChannel.emit('showConfirmationModal', {
        type: this.name,
        item: activity,
        action: () => this.remove(activity)
      });
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
  margin: 30px 0 0;
  padding: 10px 15px;
  font-size: 16px;
  line-height: 16px;
}

.add-icon {
  padding-right: 3px;
}
</style>
