<template>
  <modal :show="show">
    <div slot="header">
      <h3 class="modal-title">Clone repository</h3>
    </div>
    <div slot="body" class="modal-body">
      <circular-progress v-if="showLoader" class="loader"></circular-progress>
      <div v-else>
        <div :class="{ 'has-error': vErrors.has('name') }" class="form-group">
          <input
            v-validate="{ required: true, min: 2, max: 250 }"
            v-model="name"
            class="form-control"
            name="name"
            type="text"
            placeholder="Name"/>
          <span class="help-block">{{ vErrors.first('name') }}</span>
        </div>
        <div :class="{ 'has-error': vErrors.has('description') }" class="form-group">
          <textarea
            v-validate="{ required: true, min: 2, max: 2000 }"
            v-model="description"
            class="form-control"
            name="description"
            placeholder="Description">
          </textarea>
          <span class="help-block">{{ vErrors.first('description') }}</span>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button
        :disabled="showLoader"
        @click="close"
        class="btn btn-material btn-default"
        type="button">
        Cancel
      </button>
      <button
        :disabled="showLoader"
        @click="cloneRepository"
        class="btn btn-material btn-primary"
        type="button">
        Clone
      </button>
    </div>
  </modal>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import { mapActions } from 'vuex-module';
import Modal from 'components/common/Modal';
import pick from 'lodash/pick';
import Promise from 'bluebird';

export default {
  props: {
    show: { type: Boolean, required: true }
  },
  data() {
    return {
      showLoader: false,
      name: '',
      description: ''
    };
  },
  methods: {
    ...mapActions(['clone'], 'courses'),
    close() {
      this.$emit('close');
      this.name = '';
      this.description = '';
      this.showLoader = false;
    },
    cloneRepository() {
      this.$validator.validateAll().then(isValid => {
        if (!isValid) return;
        this.showLoader = true;
        const { courseId } = this.$route.params;
        const data = { id: courseId, ...pick(this, ['name', 'description']) };
        return Promise.join(this.clone(data), Promise.delay(500))
          .then(() => this.close());
      });
    }
  },
  watch: {
    show(val) {
      if (!val) return;
      this.vErrors.clear();
    }
  },
  components: { CircularProgress, Modal },
  inject: ['$validator']
};
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 50px;
}

.modal-body {
  min-height: 210px;
  padding-right: 0;
  padding-left: 0;
}

.loader {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}
</style>
