<template>
  <div class="assessment hotspot">
    <div class="label label-primary assessment-type">Hotspot</div>
    <div v-show="page === 1" class="hotspot-input">
      <div :class="['info', !isUploaded ? 'bg-info clearfix' : '']">
        <div v-show="!isUploaded">
          <span class="fa fa-info-circle"></span>
          <div class="message">Please upload an image to continue</div>
        </div>
      </div>
      <div class="form-group question-input">
        <span class="form-label">Question</span>
          <input
            v-model="question"
            :disabled="isEditing"
            class="form-control"
            type="text">
      </div>

      <div class="img-input">
        <span class="form-label">Image</span>
        <div v-show="!isUploaded" class="file">
          <label>
            <input @change="imageInput" type="file"/>
            <span class="btn btn-success btn-sm">
              <span class="fa fa-upload"></span> Upload image
            </span>
          </label>
        </div>
        <div v-show="isUploaded" class="preview">
          <img :src="image">
          <span @click="imageRemove" class="fa fa-times fa-lg"></span>
        </div>
      </div>

      <div class="form-group hint-input">
        <span class="form-label">Hint</span>
        <input
          v-model="hint"
          :disabled="isEditing"
          class="form-control"
          type="text">
      </div>
    </div>

    <div v-show="page === 2" class="img-editor">
      <div class="info bg-info clearfix">
        <span class="fa fa-info-circle"></span>
        <div class="message">{{ infoMessage }}</div>
      </div>
      <div class="controllers">
        <button
          v-tooltip.bottom-center="'Undo'"
          @click="undo"
          :disabled="!drawing"
          class="btn btn-default"
          type="button">
            <span class="fa fa-undo"></span>
        </button>
        <button
          v-tooltip.bottom-center="'Redo'"
          @click="redo"
          :disabled="!drawing"
          class="btn btn-default"
          type="button">
            <span class="fa fa-repeat"></span>
        </button>
        <button
          v-tooltip.bottom-center="drawing ? 'Finish Drawing' : 'Start Drawing'"
          @click="toggleDrawing"
          :class="['btn btn-default btn-draw', drawing ? 'btn-success' : 'btn-primary']"
          type="button">
            <span :class="['fa', drawing ? 'fa-check' : 'fa-pencil']"></span>
        </button>
        <button
          v-show="drawing"
          v-tooltip.bottom-center="'Create Shape'"
          @click="finishDrawing"
          type="button"
          class="btn btn-default btn-area">
            <span class="fa fa-plus"></span>
        </button>
      </div>
      <div class="canvas-wrapper">
        <canvas ref="canvas" @mousedown="saveArea"></canvas>
      </div>
    </div>

    <div v-show="page === 3" class="area-picker">
      <div class="info bg-info clearfix">
        <span class="fa fa-info-circle"></span>
        <div class="message">Select correct areas</div>
      </div>
      <div class="picker">
        <img ref="img" :src="image">
        <svg ref="svg">
          <polygon
            v-for="(element, index) in areas"
            @click="select(index, $event)"
            :points="parsePoints(element)"/>
        </svg>
      </div>
    </div>

    <div class="page-nav">
      <button
        @click="previous"
        :disabled="page < 2"
        class="btn btn-default"
        type="button">
          <span class="fa fa-chevron-left"></span>
      </button>
      <button
        @click="next"
        :disabled="!isUploaded || page > 2"
        class="btn btn-default"
        type="button">
          <span class="fa fa-chevron-right"></span>
      </button>
      <span class="controls" v-if="!isEditing">
        <button @click="save" class="btn btn-default" type="button">
          Save
        </button>
        <button @click="close" class="btn btn-default" type="button">
          Cancel
        </button>
      </span>
      <span v-else class="controls">
        <button @click="close" class="btn btn-default" type="button">
          Close
        </button>
        <button @click="edit" class="btn btn-default" type="button">
          Edit
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import yup from 'yup';
import VTooltip from 'v-tooltip';
import zoomCanvas from '../../../utils/zoomCanvas';

Vue.use(VTooltip);

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  correct: yup.array().of((yup.string().trim().min(1).required()))
});

const defaultAssessment = {
  question: '',
  hint: '',
  image: '',
  correct: [],
  areas: [],
  width: 0,
  actions: [[]]
};

export default {
  props: { assessment: Object },
  data() {
    return {
      ...cloneDeep(defaultAssessment),
      ...cloneDeep(this.assessment),
      img: new Image(), //  eslint-disable-line
      errors: [],
      isEditing: !!this.assessment.question,
      drawing: false,
      page: 1
    };
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    page: function(val, oldVal) {
      // Reset drawing mode
      this.drawing = false;

      if (this.page === 2) {
        this.updateCanvas();
      }
      if (this.page === 3) {
        this.$nextTick(() => {
          const imgWidth = this.img.naturalWidth;
          const imgHeight = this.img.naturalHeight;
          const svgWidth = this.$refs.svg.clientWidth;
          const svgWrapperWidth = this.$refs.svg.parentElement.clientWidth;
          const svgWrapperHeight = this.$refs.svg.parentElement.clientHeight;

          if (svgWrapperWidth - 10 > imgWidth) {
            let height = imgHeight / (imgWidth / this.width);
            this.$refs.svg.setAttribute('height', `${height}px`);
            this.$refs.svg.setAttribute('width', `${this.width}px`);
            this.$refs.svg.style.left = `${(Math.abs(svgWrapperWidth - this.width) / 2)}px`;
            this.$refs.img.style['max-width'] = imgWidth;
            this.$refs.img.style['max-height'] = imgHeight;
            this.$refs.img.style.removeProperty('height');
            this.$refs.img.style.removeProperty('width');
            this.width = svgWidth;
          } else {
            this.$refs.svg.style.left = '5px';
            this.$refs.img.style.height = '100%';
            this.$refs.img.style.width = '100%';
            this.$refs.svg.setAttribute('width', svgWrapperWidth - 10);
            this.$refs.svg.setAttribute('height', svgWrapperHeight - 10);
          }
        });
      }
    },
    drawing: function(val, oldVal) {
      // Enable zoom only if canvas is in drawing mode
      this.updateCanvas();
    }
  },
  computed: {
    infoMessage() {
      const initMessage = `Click on the pencil button to enter drawing mode.
        When finished go to the next page to select correct areas.`;

      const drawMessage = `Use the scroll on image to zoom in or out. After
        drawing click on the Plus button to create a new shape. Use undo and
        redo buttons for corrections. Click on Check button to exit draw mode
        and return to normal mode.`;

      return this.drawing ? drawMessage : initMessage;
    },
    isUploaded() {
      return !isEmpty(this.image);
    }
  },
  methods: {
    edit() {
      this.isEditing = false;
    },
    close() {
      this.$emit('selected');
    },
    save() {
      let canvas = this.$refs.canvas;
      let question = {
        _cid: this.assessment._cid,
        type: this.type,
        question: this.question,
        correct: this.correct,
        image: this.image,
        surfaceImage: canvas.toDataURL(),
        hint: this.hint
      };

      // TODO: New way of handling errors. To be continued...
      this.validate(question)
        .then(() => {
          this.$emit('save', question);
          this.isEditing = true;
        })
        .catch(err => err.inner.forEach(item => this.errors.push(item.path)));
    },
    validate(question) {
      const options = { recursive: true, abortEarly: false };
      return schema.validate(question, options);
    },
    handleResize() {
      if (this.page === 2) {
        this.updateCanvas();
      }
      if (this.page === 3) {
        this.$nextTick(() => {
          const imgWidth = this.img.naturalWidth;
          const imgHeight = this.img.naturalHeight;
          const svgWrapperWidth = this.$refs.svg.parentElement.clientWidth;
          const svgWrapperHeight = this.$refs.svg.parentElement.clientHeight;

          if ((svgWrapperWidth - 10) > imgWidth) {
            let height = imgHeight / (imgWidth / imgWidth);
            this.$refs.svg.setAttribute('height', height);
            this.$refs.svg.setAttribute('width', imgWidth);
            this.$refs.svg.style.left = `${(Math.abs(svgWrapperWidth - imgWidth) / 2)}px`;
            this.$refs.img.style.removeProperty('height');
            this.$refs.img.style.removeProperty('width');
            this.$refs.img.style['max-width'] = imgWidth;
            this.$refs.img.style['max-height'] = imgHeight;
            this.updateSvg(imgWidth / this.width);
            this.width = imgWidth;
          } else {
            this.$refs.svg.style.left = '5px';
            this.$refs.img.style.height = '100%';
            this.$refs.img.style.width = '100%';
            this.$refs.svg.setAttribute('width', svgWrapperWidth - 10);
            this.$refs.svg.setAttribute('height', svgWrapperHeight - 10);
            this.updateSvg((svgWrapperWidth - 10) / this.width);
            this.width = svgWrapperWidth - 10;
          }
        });
      }
    },
    updateSvg(resizeScale) {
      if (isEmpty(this.areas)) return;
      this.areas.forEach(outerItem => {
        outerItem.forEach(innerItem => {
          innerItem.x *= resizeScale;
          innerItem.y *= resizeScale;
        });
      });
      resizeScale = 1;
    },
    parsePoints(element) {
      return element.map(item => {
        return `${item.x},${item.y}`;
      });
    },
    updateCanvas(resizeScale = 1) {
      zoomCanvas(this, resizeScale);
    },
    select(index, event) {
      if (this.correct.includes(index)) {
        this.correct.splice(this.correct.indexOf(index), 1);
        event.target.style.removeProperty('opacity');
        return;
      }
      event.target.style.opacity = 0.5;
      this.correct.push(index);
    },
    toggleDrawing() {
      this.drawing = !this.drawing;
      if (this.drawing) this.startDrawing();
    },
    startDrawing() {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      if (isEmpty(this.areas)) this.areas.push([]);
      ctx.beginPath();
    },
    finishDrawing() {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      let lastItem = last(this.areas);
      if (isEmpty(lastItem)) {
        this.areas.pop();
        return;
      }
      ctx.lineTo(lastItem[0].x, lastItem[0].y);
      ctx.stroke();
      lastItem.push({ x: lastItem[0].x, y: lastItem[0].y });
    },
    saveArea(event) {
      if (!this.drawing) return;
      this.actions = [[]];
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      let pos = this.getXY(event);
      let lastArea = last(this.areas);

      if (!isEmpty(lastArea) &&
        lastArea.length > 1 &&
        last(lastArea).x === lastArea[0].x &&
        last(lastArea).y === lastArea[0].y
      ) {
        lastArea = [];
        this.areas.push(lastArea);
      }

      if (isEmpty(lastArea)) {
        ctx.moveTo(pos.x, pos.y);
        lastArea.push(pos);
      } else {
        ctx.moveTo(last(lastArea).x, last(lastArea).y);
        lastArea.push(pos);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      }
    },
    undo() {
      if (isEmpty(this.areas)) return;
      let lastArea = last(this.areas);

      if (isEmpty(lastArea)) {
        this.areas.pop();

        if (isEmpty(this.areas)) return;
        lastArea = last(this.areas);
        this.actions.push([]);
      }

      let lastRedone = last(this.actions);
      if (lastArea.length === 2) {
        lastRedone.push(lastArea.pop());
        lastRedone.push(lastArea.pop());
      } else {
        lastRedone.push(lastArea.pop());
      }

      this.updateCanvas();
      if (isArray(this.areas[0]) && isEmpty(this.areas[0])) this.areas.pop();
    },
    redo() {
      if (isEmpty(this.actions[0])) return;
      let lastArea = last(this.areas);
      let lastRedone = last(this.actions);

      if (isEmpty(this.areas)) {
        lastArea = [];
        this.areas.push(lastArea);
      }

      if (isEmpty(lastRedone)) {
        this.actions.pop();
        if (isEmpty(this.actions)) return;

        lastArea = [];
        this.areas.push(lastArea);

        lastRedone = last(this.actions);
        lastArea.push(lastRedone.pop());
        lastArea.push(lastRedone.pop());
        this.updateCanvas();

        if (isEmpty(this.actions)) this.actions.push([]);
        return;
      }

      if (lastRedone.length !== 1 &&
        last(lastRedone).x === lastRedone[0].x &&
        last(lastRedone).y === lastRedone[0].y
      ) {
        lastArea.push(lastRedone.pop());
        lastArea.push(lastRedone.pop());
      } else {
        lastArea.push(lastRedone.pop());
      }
      this.updateCanvas();
    },
    imageRemove() {
      this.image = '';
    },
    imageInput(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (isEmpty(files)) {
        return;
      }
      this.createImage(files[0]);
      e.target.value = '';
      this.areas = [];
    },
    createImage(file) {
      let reader = new FileReader();  //  eslint-disable-line
      let vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
        vm.img.src = vm.image;
        this.$nextTick(() => this.next());
      };

      reader.readAsDataURL(file);
    },
    getXY(event) {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      let lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
      let lastY = event.offsetY || (event.pageY - canvas.offsetTop);
      let pos = ctx.transformedPoint(lastX, lastY);
      return { x: pos.x, y: pos.y };
    },
    previous() {
      this.page--;
    },
    next() {
      this.page++;
    }
  }
};
</script>

<style lang="scss">
.assessment.hotspot {
  background-color: #fff;
  min-height: 400px;
  margin: 0 auto;
  overflow: hidden;
  padding: 10px 30px 30px 30px;
  position: relative;
  text-align: left;

  .assessment-type {
    background-color: grey;
    font-size: 13px;
    position: absolute;
    right: 30px;
    top: 10px;
  }

  .info {
    font-size: 18px;
    font-weight: 400;
    min-height: 40px;
    padding: 9px 5px;
    position: relative;

    .fa {
      font-size: 20px;
      left: 10px;
      position: absolute;
      top: 10px;
    }

    .message {
      padding: 0 20px 0 30px;;
    }
  }

  .hotspot-input,
  .img-editor,
  .area-picker {
    padding: 30px 0;
  }


  .page-nav {
    padding: 20px;
    text-align: left;

    .controls {
      overflow: hidden;
      padding: 10px;

      button {
        font-weight: 500;
      }
    }
  }
}

.hotspot-input {
  .form-label {
    font-size: 18px;
    font-weight: 500;
  }

  .form-group {
    margin: 0;

    .form-control {
      padding-left: 10px !important;
    }
  }

  .question-input {
    padding: 20px 0 30px;
  }

  .img-input {
    min-height: 250px;
    padding: 20px 0 30px;
    position: relative;

    input[type="file"] {
      display: none;
    }

    .file {
      bottom: 30px;
      left: 0;
      position: absolute;
    }

    .preview {
      max-width: 250px;
      position: relative;

      img {
        max-width: 100%;
        max-height: 100%;
      }

      span {
        color: #000;
        cursor: pointer;
        opacity: 0;
        position: absolute;
        right: 5px;
        top: 5px;
        transition: opacity .15s;
      }

      &:hover {
        span {
          transition: opacity .15s;
          opacity: 1;
        }
      }
    }
  }

  .hint-input {
    padding: 20px 0 10px;
  }
}

.img-editor {
  text-align: left;

  .controllers {
    padding: 15px 0;

    input {
      max-width: 100px;
      display: inline-block;
    }

    .btn {
      width: 40px;
    }

    .btn-area {
      background-color: rgb(236, 64, 122);
      color: #fff;
      font-weight: 500;
    }
  }

  .canvas-wrapper {
    canvas {
      display: block;
      margin: 0 auto;
      padding: 4px;
      line-height: 1.42857143;
      background-color: #fff;
      border: 1px solid grey;
      border-radius: 4px;
      -webkit-transition: all .2s ease-in-out;
      -o-transition: all .2s ease-in-out;
      transition: all .2s ease-in-out;
    }
  }
}

.area-picker {
  margin: 0 auto;
  width: 100%;
  overflow: hidden;

  .picker {
    padding-top: 10px;
    position: relative;

    img {
      margin: 0 auto;
      display: block;
      padding: 4px;
      line-height: 1.42857143;
      background-color: #fff;
      border: 1px solid grey;
      border-radius: 4px;
      -webkit-transition: all .2s ease-in-out;
      -o-transition: all .2s ease-in-out;
      transition: all .2s ease-in-out;
      z-index: 1;
    }
    svg {
      position: absolute;
      top: 5px;
      z-index: 2;

      polygon {
        position: absolute;
        opacity: 0;
        fill: white;
        stroke: green;
        stroke-width: 5px;
      }

      polygon:hover {
        opacity: 0.5;
      }
    }
  }
}

.tooltip {
  display: none;
  opacity: 0;
  transition: opacity .15s;
  pointer-events: none;
  padding: 8px;
  z-index: 10000;

  .tooltip-content {
    background: #828080;
    color: #fff;
    padding: 5px 10px 4px;
  }

  &.tooltip-open-transitionend {
    display: block;
  }

  &.tooltip-after-open {
    opacity: 1;
  }
}
</style>
