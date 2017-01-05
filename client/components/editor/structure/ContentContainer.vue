<template>
  <div class="content-container">
    <transition name="fade">
      <draggable>
        <content-row v-for="it in assets">
          <div v-if="it.type === 'text'">
            <text-editor v-model="content"></text-editor>
          </div>
        </content-row>
      </draggable>
    </transition>
    <btn-add-content></btn-add-content>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Draggable from 'vuedraggable';
import ContentRow from './ContentRow';
import BtnAddContent from './BtnAddContent';
import TextEditor from '../assets/Text';

export default {
  name: 'content-container',
  computed: mapGetters(['assets']),
  components: {
    ContentRow,
    Draggable,
    BtnAddContent,
    TextEditor
  }
};
</script>

<style lang="scss">
.content-container {
  min-height: 600px;
  padding: 30px 40px;
  border: 1px solid transparent;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
}
</style>
