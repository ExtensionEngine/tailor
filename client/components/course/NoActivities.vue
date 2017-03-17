<template>
  <div class="well">
    <div class="row">
      <div class="col-md-10">
        <span
          :class="{ 'has-error': vErrors.has('name') }"
          class="form-group">
          <input
            v-model="name"
            v-validate="{ rules: { required: true, min: 2, max: 250 } }"
            class="form-control"
            type="text"
            name="name"
            autofocus=""
            placeholder="Create your first activity">
          <span v-show="vErrors.has('name')" class="help-block">
            {{ vErrors.first('name') }}
          </span>
        </span>
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
const noop = Function.prototype;

export default {
  data() {
    return {
      name: ''
    };
  },
  computed: mapGetters(['course'], 'course'),
  methods: {
    ...mapActions(['save'], 'activities'),
    create() {
      this.$validator.validateAll().then(() => {
        this.save({
          name: this.name,
          courseId: this.course.id,
          position: 1
        });
      }, noop);
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
