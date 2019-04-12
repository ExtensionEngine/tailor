<template>
  <div v-if="course" class="settings">
    <div class="actions">
      <button
        :disabled="publishing"
        @click="publish"
        class="btn btn-primary btn-material btn-sm pull-right">
        <span class="mdi mdi-publish"></span> Publish info
      </button>
    </div>
    <meta-input
      v-for="it in requiredData"
      :meta="it"
      :key="it.key"
      @update="updateKey"
      class="meta-input">
    </meta-input>
    <meta-input
      v-for="it in metadata"
      :meta="it"
      :key="it.key"
      @update="updateKey"
      class="meta-input">
    </meta-input>
  </div>
</template>

<script>
import { getRepositoryMeta } from 'shared/activities';
import { mapActions, mapGetters } from 'vuex-module';
import api from '../../../api/course';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import Meta from 'components/common/Meta';
import set from 'lodash/set';

export default {
  data() {
    return { publishing: false };
  },
  computed: {
    ...mapGetters(['course'], 'course'),
    requiredData() {
      return [{
        key: 'name',
        value: this.course.name,
        type: 'TEXTAREA',
        label: 'Name',
        validate: { rules: { required: true, min: 2, max: 250 } }
      }, {
        key: 'description',
        value: this.course.description,
        type: 'TEXTAREA',
        label: 'Description',
        validate: { rules: { required: true, min: 2, max: 2000 } }
      }];
    },
    metadata() {
      return getRepositoryMeta(this.course);
    }
  },
  methods: {
    ...mapActions(['update'], 'courses'),
    updateKey(key, value) {
      if (find(this.metadata, { key })) key = `data.${key}`;
      const data = cloneDeep(this.course);
      this.update(set(data, key, value));
    },
    publish() {
      this.publishing = true;
      return api.publishRepositoryMeta(this.$route.params.courseId)
        .then(() => (this.publishing = false));
    }
  },
  components: { MetaInput: Meta }
};
</script>

<style lang="scss" scoped>
.settings {
  padding: 30px 30px 10px;
  text-align: left;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  .meta-input {
    margin: 20px 0;
  }
}

.actions {
  min-height: 36px;

  .btn {
    padding: 8px 12px;
  }
}

.picker {
  /deep/ .actions {
    margin: 20px 0 0;
    text-align: left;
  }
}
</style>
