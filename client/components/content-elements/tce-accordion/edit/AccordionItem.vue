<template>
  <v-expansion-panel>
    <v-expansion-panel-header color="blue-grey lighten-4">
      <v-text-field
        v-if="isEditingHeader"
        v-model="header"
        @click.stop
        @keyup.space.prevent
        hide-details filled dense />
      <div v-else class="pl-3">{{ item.header }}</div>
      <div v-if="isEditingHeader" class="actions">
        <v-btn @click.stop="saveHeader" color="green darken-2" icon>
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn @click.stop="isEditingHeader = false" icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div v-else class="actions">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click.stop="editHeader" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit heading</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click.stop="deleteItem" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete item</span>
        </v-tooltip>
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content color="blue-grey lighten-5">
      <v-alert
        v-if="!hasElements"
        color="blue-grey darken-2"
        icon="mdi-information-variant"
        text prominent
        class="mt-6">
        Click the button below to add content element.
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
import EventBus from 'EventBus';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

const appChannel = EventBus.channel('app');

export default {
  name: 'accordion-item',
  props: {
    item: { type: Object, required: true },
    embeds: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      header: this.item.header,
      isEditingHeader: false
    };
  },
  computed: {
    hasElements: vm => !isEmpty(vm.embeds)
  },
  methods: {
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
      appChannel.emit('showConfirmationModal', {
        title: 'Delete accordion item',
        message: 'Are you sure you want to delete selected item?',
        action: () => this.$emit('delete', this.item.id)
      });
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
.actions {
  width: 5.5rem;
  max-width: 5.5rem;
  padding-left: 0.5rem;
}
</style>
