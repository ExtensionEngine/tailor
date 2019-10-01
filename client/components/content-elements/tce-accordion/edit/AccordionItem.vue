<template>
  <v-expansion-panel>
    <v-expansion-panel-header disable-icon-rotate>
      <div v-if="!isEditingHeader" class="header">{{ item.header }}</div>
      <v-text-field
        v-else
        v-model="header"
        @keydown.stop.enter="saveHeader"
        @keyup.space.prevent
        @click.stop
        hide-details
        single-line
        placeholder="Header" />
      <template v-if="!isEditingHeader" v-slot:actions>
        <v-btn @click.stop="editHeader" small text icon>
          <v-icon small>mdi-pencil</v-icon>
        </v-btn>
        <v-btn @click.stop="deleteItem" small text icon>
          <v-icon small>mdi-delete</v-icon>
        </v-btn>
      </template>
      <template v-else v-slot:actions>
        <v-btn @click.stop="saveHeader" small text icon>
          <v-icon small>mdi-content-save</v-icon>
        </v-btn>
        <v-btn @click.stop="isEditingHeader = false" small text icon>
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-alert v-if="!hasElements" class="placeholder">
        Click the button below to Create your first teaching element.
      </v-alert>
      <embedded-container
        @save="({ embeds }) => save(item, embeds)"
        @delete="deleteEmbed($event)"
        :container="{ embeds }" />
    </v-expansion-panel-content>
  </v-expansion-panel>
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
.header {
  font-size: 16px;
}

.v-input {
  margin-top: 0;
  padding: 0;
}

::v-deep .v-text-field input {
  padding: 0;
}

.v-expansion-panel {
  border: 1px solid lightgray;

  + .v-expansion-panel {
    border-top: none;
  }

  &::before {
    box-shadow: none;
  }

  &::after {
    border: none;
  }
}

.v-expansion-panel--active .v-expansion-panel-header {
  min-height: 48px;
}

.placeholder {
  margin: 0;
  background: #f5f5f5;
}
</style>
