<template>
  <div
    @mousedown.prevent="() => {}"
    id="quillToolbar"
    class="tce-html-toolbar">
    <span class="ql-formats">
      <button class="ql-undo"><span class="icon mdi mdi-undo"></span></button>
      <button class="ql-redo"><span class="icon mdi mdi-redo"></span></button>
    </span>
    <span class="ql-formats">
      <select class="ql-font"></select>
      <select class="ql-header"></select>
    </span>
    <span class="ql-formats">
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <button class="ql-strike"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-blockquote"></button>
      <button class="ql-code-block"></button>
    </span>
    <span class="ql-formats">
      <button class="ql-script" value="sub"></button>
      <button class="ql-script" value="super"></button>
    </span>
    <span class="ql-formats">
      <select class="ql-color">
        <option value="rgb(0, 0, 0)"/>
        <option value="rgb(230, 0, 0)"/>
        <option value="rgb(255, 153, 0)"/>
        <option value="rgb(255, 255, 0)"/>
        <option value="rgb(0, 138, 0)"/>
        <option value="rgb(0, 102, 204)"/>
        <option value="rgb(153, 51, 255)"/>
        <option value="rgb(255, 255, 255)"/>
        <option value="rgb(250, 204, 204)"/>
        <option value="rgb(255, 235, 204)"/>
        <option value="rgb(204, 224, 245)"/>
        <option value="rgb(235, 214, 255)"/>
        <option value="rgb(187, 187, 187)"/>
        <option value="rgb(102, 185, 102)"/>
      </select>
      <select class="ql-background">
        <option value="rgb(0, 0, 0)"/>
        <option value="rgb(230, 0, 0)"/>
        <option value="rgb(255, 153, 0)"/>
        <option value="rgb(255, 255, 0)"/>
        <option value="rgb(0, 138, 0)"/>
        <option value="rgb(0, 102, 204)"/>
        <option value="rgb(153, 51, 255)"/>
        <option value="rgb(255, 255, 255)"/>
        <option value="rgb(250, 204, 204)"/>
        <option value="rgb(255, 235, 204)"/>
        <option value="rgb(204, 224, 245)"/>
        <option value="rgb(235, 214, 255)"/>
        <option value="rgb(187, 187, 187)"/>
        <option value="rgb(102, 185, 102)"/>
      </select>
    </span>
    <span class="ql-formats">
      <button class="ql-link" type="button"></button>
      <button class="ql-image" type="button"></button>
      <!-- <button class="ql-video" type="button"></button> -->
    </span>
    <span class="ql-formats">
      <button class="ql-list" value="ordered" type="button"></button>
      <button class="ql-list" value="bullet" type="button"></button>
      <select class="ql-align">
        <option selected=""></option>
        <option value="center"></option>
        <option value="right"></option>
        <option value="justify"></option>
      </select>
    </span>
    <span class="ql-formats">
      <button type="button" class="ql-indent" value="-1"></button>
      <button type="button" class="ql-indent" value="+1"></button>
    </span>
    <span class="ql-formats">
      <button type="button" class="ql-direction" value="rtl"></button>
    </span>
  </div>
</template>

<script>
export default {
  name: 'tce-html-toolbar'
};
</script>

<style lang="scss">
.tce-html-toolbar {
  display: none;
  position: relative;
  z-index: 999;
  width: 100%;
  height: 45px;
  text-align: left;

  .icon {
    display: inline-block;
    font-size: 16px;
    line-height: 16px;
    vertical-align: middle;
  }
}

.tce-html-toolbar.ql-toolbar {
  display: block;
}

.tce-html-toolbar.ql-toolbar.ql-snow {
  border: none;
}
</style>
