<template>
  <div class="well">
    <div class="row">
      <div class="col-md-10">
        <input
          v-model="name"
          class="form-control"
          type="text"
          autofocus=""
          placeholder="Create your first activity">
      </div>
      <div class="col-lg-2">
        <button
          @click.stop="create"
          class="btn btn-block btn-primary">
          Add
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';

export default {
  data() {
    return {
      name: ''
    };
  },
  computed: mapGetters(['course'], 'editor'),
  methods: {
    ...mapActions(['save'], 'activity'),
    create() {
      this.save({
        name: this.name,
        courseId: this.course.id,
        position: 1
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.well {
  background-color: white;
  border: 1px solid #ccc;

  input {
    padding-left: 5px;
  }
}
</style>
