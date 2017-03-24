<template>
  <li>
    <div class="accordion-header">
      <div v-if="!isEditingHeader" @click="toggle" class="contents">
        <span class="title">{{ item.header }}</span>
        <span @click.stop="editHeader" class="mdi mdi-pencil"></span>
        <span @click.stop="deleteItem" class="mdi mdi-delete"></span>
      </div>
      <div v-else class="contents">
        <input v-model="header" class="form-control" type="text" placeholder="Header"/>
        <span @click.stop="saveHeader" class="mdi mdi-content-save"></span>
        <span @click.stop="isEditingHeader = false" class="mdi mdi-close"></span>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="isCollapsed" class="container-fluid accordion-body">
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
      header: this.item.header,
      isCollapsed: false,
      isEditingHeader: false
    };
  },
  methods: {
    toggle() {
      this.isCollapsed = !this.isCollapsed;
    },
    editHeader() {
      this.isEditingHeader = true;
      this.header = this.item.header;
    },
    saveHeader() {
      this.isEditingHeader = false;
      this.$emit('save', { ...this.item, header: this.header });
    },
    saveBodyElement(element) {
      if (this.item.body && !this.item.body[element.id]) return;
      this.addElement(element);
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
      if (!element.embedded || !this.item.body[element.id]) return;
      const body = cloneDeep(this.item.body);
      delete body[element.id];
      this.$emit('save', { ...this.item, body });
    });
  },
  components: {
    AddElement,
    Primitive
  }
};
</script>

<style lang="scss" scoped>
.accordion-header {
  height: 60px;
  padding: 12px;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  text-align: justify;
  cursor: pointer;

  .contents {
    line-height: 34px;

    &:after {
      display: inline-block;
      width: 100%;
      content: '';
    }

    span {
      display: inline-block;
      vertical-align: middle;
      line-height: 1em;
    }

    .title {
      display: inline-block;
      width: 90%;
      max-width: 90%;
      padding-top: 1px;
      color: #555555;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .form-control {
      display: inline-block;
      width: 90%;
      outline-style: none;
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

      &:hover {
        color: #444;
      }
    }
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
