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
import { ASSET_GROUP } from 'shared/activities';
import CreatePerspective from './CreatePerspective';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Perspective from './Perspective';
import modalBus from '../../common/deletionModal/eventBus';

export default {
  name: 'perspectives',
  computed: mapGetters(['activity', 'perspectives'], 'atom'),
  methods: {
    ...mapActions({ removeActivity: 'remove', save: 'save' }, 'activity'),
    ...mapActions({ removeAsset: 'remove' }, 'assets'),
    ...mapMutations(['setToolbarContext'], 'atom'),
    add() {
      this.save({
        type: ASSET_GROUP,
        parentId: this.activity.id,
        position: this.perspectives.length + 1
      });
    }
  },
  created() {
    modalBus.$on('perspective/delete', this.removeActivity);
    modalBus.$on('asset/delete', (asset) => {
      this.removeAsset(asset);
      this.setToolbarContext();
    });
  },
  destroyed() {
    modalBus.$off('perspective/delete');
    modalBus.$off('asset/delete');
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
