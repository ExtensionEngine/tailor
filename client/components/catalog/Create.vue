<template>
  <div class="create-course">
    <button type="button" class="btn btn-primary" @click="show">
      Create course
    </button>
    <modal :show="showModal" effect="fade">
      <div slot="modal-header" class="modal-header">
        <h4 class="modal-title">Create course</h4>
      </div>
      <div slot="modal-body" class="modal-body">
        <div v-if="error" class="error">{{ error }}</div>
        <cube-grid v-if="loader"></cube-grid>
        <div v-if="!loader">
          <div class="form-group">
            <input v-model="name" type="text" class="form-control" placeholder="Name"/>
          </div>
          <div class="form-group">
            <textarea v-model="description" class="form-control" placeholder="Description"></textarea>
          </div>
        </div>
      </div>
      <div slot="modal-footer" class="modal-footer">
        <button type="button" @click="hide" class="btn btn-default">Cancel</button>
        <button type="button" @click="create" class="btn btn-primary">Create</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';
import { modal } from 'vue-strap';
import CubeGrid from '../loaders/CubeGrid';

export default {
  name: 'create-course',
  data() {
    return {
      name: '',
      description: '',
      error: '',
      loader: false,
      showModal: false
    };
  },
  components: {
    modal,
    CubeGrid
  },
  methods: {
    ...mapActions(['save'], 'catalog'),
    create() {
      // TODO: Add validation
      this.loader = true;
      const course = { name: this.name, description: this.description };
      this.save(course).then(() => {
        this.loader = false;
        this.hide();
      });
    },
    show() {
      this.showModal = true;
    },
    hide() {
      this.showModal = false;
      this.name = '';
      this.description = '';
    }
  }
};
</script>

<style lang="scss">
.create-course {
  textarea {
    resize: none;
  }

  .modal-content {
    padding: 10px;
    border-radius: 0;
  }

  .modal-header {
    border: 0;
    text-align: left;
  }

  .modal-footer {
    border: 0;
  }

  .error {
    margin: 0 auto;
    padding: 15px 20px 0 20px;
    color: #dd4b39;
    font-size: 16px;
    font-weight: 600;
    min-height: 40px;
  }
}
</style>
