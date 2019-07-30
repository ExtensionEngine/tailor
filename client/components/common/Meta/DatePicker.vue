<template>
  <div class="datepicker control">
    <span class="title">{{ meta.label }}</span>
    <div class="formatted-date mt-3">
      <div v-if="!showPicker">
        {{ formattedDate }}
        <v-icon @click="showPicker = true" size="22" class="ml-2" color="primary">
          mdi-pencil-outline
        </v-icon>
      </div>
      <v-date-picker
        v-else
        v-model="value"
        @change="update"
        width="100%"
        :type="type" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      value: new Date(this.meta.value).toISOString().substr(0, 10),
      showPicker: false
    };
  },
  computed: {
    formattedDate() {
      return new Date(this.value).toDateString();
    },
    type() {
      return this.meta.type.toLowerCase();
    }
  },
  methods: {
    update(value) {
      this.$emit('update', this.meta.key, value);
      this.showPicker = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.control {
  padding: 7px 8px;
}

.formatted-date {
  font-size: 16px;
}
</style>
