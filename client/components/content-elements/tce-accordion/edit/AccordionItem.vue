<template>
  <li>
    <div class="accordion-header">
      <div v-if="!isEditingHeader" @click="toggle" class="contents">
        <span class="title">{{ item.header }}</span>
        <span @click.stop="editHeader" class="mdi mdi-pencil edit-header"></span>
        <span @click.stop="deleteItem" class="mdi mdi-delete delete-item"></span>
      </div>
      <div v-else class="contents">
        <input v-model="header" class="form-control" type="text" placeholder="Header">
        <span @click.stop="saveHeader" class="mdi mdi-content-save"></span>
        <span @click.stop="isEditingHeader = false" class="mdi mdi-close"></span>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-show="!isCollapsed" class="container-fluid accordion-body">
        <div v-if="!hasElements" class="well">
          Click the button below to Add your first content element.
        </div>
        <embedded-container
          @save="({ embeds }) => save(item, embeds)"
          @delete="deleteEmbed($event)"
          :container="{ embeds }" />
      </div>
    </transition>
  </li>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from 'tce-core';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'accordion-item',
  props: {
    item: { type: Object, required: true },
    embeds: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      header: this.item.header,
      isCollapsed: true,
      isEditingHeader: false
    };
  },
  computed: {
    hasElements() {
      return !isEmpty(this.embeds);
    }
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
      this.save({ ...this.item, header: this.header }, this.embeds);
    },
    save(item, embeds = {}) {
      item = cloneDeep(item);
      forEach(embeds, it => (item.body[it.id] = true));
      this.$emit('save', { item, embeds });
    },
    deleteItem() {
      this.$emit('delete', this.item.id);
    },
    deleteEmbed(embed) {
      const embeds = cloneDeep(this.embeds);
      const item = cloneDeep(this.item);
      delete embeds[embed.id];
      delete item.body[embed.id];
      this.$emit('save', { item, embeds });
    }
  },
  components: { EmbeddedContainer }
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

    &::after {
      content: '';
      display: inline-block;
      width: 100%;
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
      color: #555;
      font-size: 16px !important;
      font-weight: normal;
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
  height: auto;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  padding: 32px 8px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1); // "easeOutQuart"
}

.slide-fade-enter, .slide-fade-leave-to {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.disabled {
  .accordion-header {
    .edit-header, .delete-item {
      display: none;
    }
  }

  .add-element {
    display: none;
  }
}
</style>
