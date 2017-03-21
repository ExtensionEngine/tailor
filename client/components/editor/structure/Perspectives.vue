<template>
  <div class="perspectives">
    <div v-if="!perspectives.length" class="well">
      Click the button below to Create first Perspective.
    </div>
    <perspective v-for="it in perspectives" :perspective="it"></perspective>
    <create-perspective @create="add"></create-perspective>
  </div>
</template>

<script>
import { ASSET_GROUP } from 'shared/activities';
import CreatePerspective from './CreatePerspective';
import { mapActions, mapGetters } from 'vuex-module';
import Perspective from './Perspective';

export default {
  name: 'perspectives',
  computed: mapGetters(['activity', 'perspectives'], 'editor'),
  methods: {
    ...mapActions(['save'], 'activities'),
    add() {
      this.save({
        type: ASSET_GROUP,
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

<style lang="scss" scoped>
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
