<template>
  <v-card v-if="course" class="settings">
    <div class="actions">
      <v-btn
        @click="publish"
        :loading="publishing"
        outlined
        small
        class="pull-right">
        Publish info
      </v-btn>
    </div>
    <meta-input
      v-for="it in requiredData"
      :key="it.key"
      @update="updateKey"
      :meta="it"
      class="meta-input" />
    <meta-input
      v-for="it in metadata"
      :key="it.key"
      @update="updateKey"
      :meta="it"
      class="meta-input" />
  </v-card>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import api from '@/api/course';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import { getRepositoryMeta } from 'shared/activities';
import Meta from 'components/common/Meta';
import set from 'lodash/set';

export default {
  data() {
    return { publishing: false };
  },
  computed: {
    ...mapGetters('course', ['course']),
    requiredData() {
      return [{
        key: 'name',
        value: this.course.name,
        type: 'TEXTAREA',
        label: 'Name',
        validate: { required: true, min: 2, max: 250 }
      }, {
        key: 'description',
        value: this.course.description,
        type: 'TEXTAREA',
        label: 'Description',
        validate: { required: true, min: 2, max: 2000 }
      }];
    },
    metadata() {
      return getRepositoryMeta(this.course);
    }
  },
  methods: {
    ...mapActions('courses', ['update']),
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
  padding: 30px;
  text-align: left;

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
  ::v-deep .actions {
    margin: 20px 0 0;
    text-align: left;
  }
}
</style>
