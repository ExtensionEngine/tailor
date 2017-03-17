<template>
  <li>
    <div v-if="!isEditingHeader" class="accordion-header" @click="toggle">
      <span class="title">{{ item.header }}</span>
      <span @click.stop="isEditingHeader = true" class="mdi mdi-pencil"></span>
      <span @click.stop="deleteItem" class="mdi mdi-delete"></span>
    </div>
    <div v-else class="accordion-header">
      <input v-model="header" class="edit" type="text" placeholder="Header" />
      <span @click.stop="saveHeader" class="mdi mdi-content-save"></span>
      <span @click.stop="isEditingHeader = false" class="mdi mdi-close"></span>
    </div>
    <transition name="slide-fade">
      <div class="container-fluid accordion-body" v-show="isActive">
        <div class="row">
          <primitive
            v-for="element in item.body"
            :key="element.id"
            :initialElement="element"
            @save="saveBodyElement">
          </primitive>
        </div>
        <add-element
          :include="['HTML', 'IMAGE']"
          :layout="true"
          @add="addElement">
        </add-element>
      </div>
    </transition>
  </li>
</template>

<script>
import AddElement from '../../structure/AddElement';
import cloneDeep from 'lodash/cloneDeep';
import EventBus from 'EventBus';
import Primitive from '../Primitive';

const appChannel = EventBus.channel('app');

export default {
  name: 'accordion-item',
  props: ['item'],
  data() {
    return {
      header: '',
      isActive: false,
      isEditingHeader: false
    };
  },
  methods: {
    toggle() {
      this.isActive = !this.isActive;
    },
    saveHeader(event) {
      this.isEditingHeader = false;
      this.$emit('save', { ...this.item, header: this.header });
    },
    saveBodyElement(element) {
      if (this.item.body && !this.item.body[element.id]) return;
      const body = cloneDeep(this.item.body);
      body[element.id] = element;
      this.$emit('save', { ...this.item, body });
    },
    addElement(element) {
      const body = cloneDeep(this.item.body);
      body[element.id] = element;
      this.$emit('save', { ...this.item, body });
    },
    deleteItem() {
      this.$emit('delete', this.item.id);
    }
  },
  created() {
    appChannel.on('deleteElement', element => {
      if (!element.embedded) return;
      const body = cloneDeep(this.item.body);
      delete body[element.id];
      this.$emit('save', { ...this.item, body });
    });
  },
  mounted() {
    this.header = this.item.header;
  },
  components: {
    AddElement,
    Primitive
  }
};
</script>

<style lang="scss" scoped>
.accordion-header {
  text-align: justify;
  cursor: pointer;
  height: 48px;
  border-bottom: 1px solid #ddd;
  padding: 12px;
  font-size: 16px;

  &:after {
    content: '';
    display: inline-block;
    width: 100%;
  }

  .title {
    display: inline-block;
    width: 90%;
  }

  .edit {
    display: inline-block;
    outline-style: none;
    width: 90%;
  }

  .btn {
    display: inline-block;
    font-size: 11px;

    &:active {
      outline: none;
    }
  }

  .mdi {
    color: #707070;
  }
}

.accordion-body {
  max-height: 3000px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  padding: 32px 8px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  overflow: hidden;
  margin-top: 0px;
  margin-bottom: 0px;
  transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1); // "easeOutQuart"
}

.slide-fade-enter, .slide-fade-leave-to {
  max-height: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
}
</style>
