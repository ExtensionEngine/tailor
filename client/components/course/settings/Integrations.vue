<template>
  <div class="integrations">
    <h2>Knewton</h2>
    <button
      @click.stop="downloadContentInventory"
      type="button"
      class="btn btn-primary">
      <span class="mdi mdi-download"></span>
      Export content inventory
    </button>
  </div>
</template>

<script>
import api from '../../../api/course';
import JSZip from 'jszip';
import saveAs from 'save-as';

export default {
  methods: {
    downloadContentInventory() {
      api.getContentInventory(this.$route.params.courseId)
        .then(response => JSZip.loadAsync(response))
        .then(zip => zip.generateAsync({ type: 'blob' }))
        .then(file => saveAs(file, 'Content Inventory.xlsx'));
    }
  }
};
</script>

<style lang="scss" scoped>
.integrations {
  min-height: 540px;
  padding: 30px 30px 10px;
  text-align: left;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
  background-color: white;
}

h2 {
  margin: 15px 0 30px;
  font-size: 18px;
  font-weight: normal;
  color: #444;
}
</style>
