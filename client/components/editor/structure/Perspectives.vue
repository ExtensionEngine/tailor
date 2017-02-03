<template>
  <div class="perspectives">
    <div class="well" v-if="!perspectives.length">
      Click the button bellow to Create first Perspective.
    </div>
    <perspective v-for="it in perspectives" :perspective="it"></perspective>
    <create-perspective @create="add"></create-perspective>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';
import Perspective from './Perspective';
import CreatePerspective from './CreatePerspective';

export default {
  name: 'perspectives',
  computed: mapGetters(['activity', 'perspectives'], 'atom'),
  methods: {
    ...mapActions(['save'], 'activity'),
    add() {
      this.save({
        name: 'perspective',
        parentId: this.activity.id,
        position: this.perspectives.length + 1
      });
    }
  },
  components: {
    CreatePerspective,
    Perspective
  }
};
</script>

<style lang="scss">
.perspectives {
  h2 {
    margin-bottom: 20px;
    font-size: 18px;
    color: #444;
  }

  .well {
    font-size: 16px;
  }
}
</style>
