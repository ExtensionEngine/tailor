<template>
  <div class="assessment hotspot">
    <div class="label label-primary assessment-type">Hotspot</div>
    <div v-show="page === 1">
      <div class="form-group">
        <span class="form-label">Question</span>
        <span :class="{ 'has-error': errors.includes('question') }">
          <input
            v-model="question"
            :disabled="isEditing"
            class="form-control"
            type="text"
            placeholder="Question">
        </span>
      </div>
      <div class="img-load">
        <h2>Image</h2>
        <input type="file" @change="imageInput">
        <div class="img-preview">
          <img :src="image">
        </div>
      </div>
      <div class="form-group">
        <span class="form-label">Hint</span>
        <input
          v-model="hint"
          :disabled="isEditing"
          class="form-control"
          type="text"
          placeholder="Optional hint">
      </div>
    </div>
    <div v-show="page === 2" class="img-container">
      <div class="controllers">
        <button
          v-show="!drawing"
          @click="startDrawing"
          class="btn btn-default"
          type="button">
            <span class="fa fa-pencil"></span>
        </button>
        <button
          v-show="drawing"
          @click="finishDrawing"
          class="btn btn-default"
          type="button">
            <span class="fa fa-check"></span>
        </button>
        <button
          @click="undo"
          class="btn btn-default"
          type="button">
            <span class="fa fa-undo"></span>
        </button>
        <button
          @click="redo"
          class="btn btn-default"
          type="button">
            <span class="fa fa-repeat"></span>
        </button>
      </div>
      <div class="canvas">
        <canvas ref="canvas" @mousedown="saveArea"></canvas>
      </div>
    </div>
    <div v-show="image && page === 3" class="svg-container">
      <div class="form-group">
        <span class="form-label">Select correct areas:</span>
      </div>
      <div class="svg">
        <img ref="img" :src="image">
        <svg ref="svg">
          <polygon
            v-for="(element, index) in areas"
            @click="select(index, $event)"
            :points="parsePoints(element)"/>
        </svg>
      </div>
    </div>
    <div class="nav-control">
      <button
        @click="previous"
        :disabled="page < 2"
        class="btn btn-default"
        type="button">
          <span class="fa fa-chevron-left"></span>
      </button>
      <button
        @click="next"
        :disabled="page > 2"
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
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import yup from 'yup';
import zoomCanvas from './zoomCanvas';

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
      img: new Image, //  eslint-disable-line
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
      if (this.page === 2) {
        this.updateCanvas(1);
      }
      if (this.page === 3) {
        this.$nextTick(() => {
          if (this.$refs.svg.parentElement.clientWidth - 10 > this.img.naturalWidth) {
            let height = this.img.naturalHeight / (this.img.naturalWidth / this.width);
            this.$refs.svg.setAttribute('height', `${height}px`);
            this.$refs.svg.setAttribute('width', `${this.width}px`);
            this.$refs.svg.style.left = `${(Math.abs(this.$refs.svg.parentElement.clientWidth - this.width) / 2)}px`;
            this.$refs.img.style['max-width'] = this.img.naturalWidth;
            this.$refs.img.style['max-height'] = this.img.naturalHeight;
            this.$refs.img.style.removeProperty('height');
            this.$refs.img.style.removeProperty('width');
            this.width = this.$refs.svg.clientWidth;
          } else {
            this.$refs.svg.style.left = '5px';
            this.$refs.img.style.height = '100%';
            this.$refs.img.style.width = '100%';
            this.$refs.svg.setAttribute('width', this.$refs.svg.parentElement.clientWidth - 10);
            this.$refs.svg.setAttribute('height', this.$refs.svg.parentElement.clientHeight - 10);
          }
        });
      }
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
      this.errors = [];
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
        this.updateCanvas(1);
      }
      if (this.page === 3) {
        this.$nextTick(() => {
          if ((this.$refs.svg.parentElement.clientWidth - 10) > this.img.naturalWidth) {
            let height = this.img.naturalHeight / (this.img.naturalWidth / this.img.naturalWidth);
            this.$refs.svg.setAttribute('height', height);
            this.$refs.svg.setAttribute('width', this.img.naturalWidth);
            this.$refs.svg.style.left = `${(Math.abs(this.$refs.svg.parentElement.clientWidth - this.img.naturalWidth) / 2)}px`;
            this.$refs.img.style.removeProperty('height');
            this.$refs.img.style.removeProperty('width');
            this.$refs.img.style['max-width'] = this.img.naturalWidth;
            this.$refs.img.style['max-height'] = this.img.naturalHeight;
            this.updateSvg(this.img.naturalWidth / this.width);
            this.width = this.img.naturalWidth;
          } else {
            this.$refs.svg.style.left = '5px';
            this.$refs.img.style.height = '100%';
            this.$refs.img.style.width = '100%';
            this.$refs.svg.setAttribute('width', this.$refs.svg.parentElement.clientWidth - 10);
            this.$refs.svg.setAttribute('height', this.$refs.svg.parentElement.clientHeight - 10);
            this.updateSvg((this.$refs.svg.parentElement.clientWidth - 10) / this.width);
            this.width = this.$refs.svg.parentElement.clientWidth - 10;
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
    updateCanvas(resizeScale) {
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
    startDrawing() {
      this.drawing = true;
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      if (isEmpty(this.areas)) this.areas.push([]);
      ctx.beginPath();
    },
    finishDrawing() {
      this.drawing = false;
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

      this.updateCanvas(1);
      if (isArray(this.areas[0]) && isEmpty(this.areas[0])) this.areas.pop();
    },
    test() {
      if (this.areas.length === 0) return;
      let lastAreasItem = this.areas[this.areas.length - 1];

      if (lastAreasItem.length === 0) {
        this.areas.splice(this.areas.length - 1, 1);

        if (this.areas.length === 0) return;
        lastAreasItem = this.areas[this.areas.length - 1];
        this.redo.push([]);
      }
      let lastRedoItem = this.redo[this.redo.length - 1];
      if (lastAreasItem.length === 2) {
        lastRedoItem.push(lastAreasItem.pop());
        lastRedoItem.push(lastAreasItem.pop());
      } else lastRedoItem.push(lastAreasItem.pop());
      this.updateCanvas(1);
      if (this.areas[0] && this.areas[0].length === 0) {
        this.areas.pop();
      }
    },
    redo() {
      if (this.actions[0].length === 0) return;
      let lastAreasItem;
      if (this.areas.length === 0) {
        this.areas.push([]);
        lastAreasItem = this.areas[this.areas.length - 1];
      } else {
        lastAreasItem = this.areas[this.areas.length - 1];
      }
      let lastRedoItem = this.actions[this.actions.length - 1];
      if (lastRedoItem.length === 0) {
        this.actions.splice(this.actions.length - 1, 1);
        if (this.actions.length === 0) return;
        this.areas.push([]);
        lastAreasItem = this.areas[this.areas.length - 1];
        lastRedoItem = this.actions[this.actions.length - 1];
        lastAreasItem.push(lastRedoItem.pop());
        lastAreasItem.push(lastRedoItem.pop());
        this.updateCanvas(1);
        if (this.actions.length === 0) this.actions.push([]);
        return;
      }
      if (lastRedoItem.length !== 1 && lastRedoItem[lastRedoItem.length - 1].x === lastRedoItem[0].x && lastRedoItem[lastRedoItem.length - 1].y === lastRedoItem[0].y) {
        lastAreasItem.push(lastRedoItem.pop());
        lastAreasItem.push(lastRedoItem.pop());
      } else lastAreasItem.push(lastRedoItem.pop());
      this.updateCanvas(1);
    },
    imageInput(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
      this.areas = [];
    },
    createImage(file) {
      let reader = new FileReader();  //  eslint-disable-line
      let vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
        vm.img.src = vm.image;
      };

      reader.readAsDataURL(file);
    },
    getXY(event) {
      let canvas = this.$refs.canvas;
      let ctx = canvas.getContext('2d');
      let lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
      let lastY = event.offsetY || (event.pageY - canvas.offsetTop);
      let pos = ctx.transformedPoint(lastX, lastY);
      return {x: pos.x, y: pos.y};
    },
    previous() {
      this.page -= 1;
    },
    next() {
      this.page += 1;
    }
  }
};
</script>

<style lang="scss">
.assessment.hotspot {
  min-height: 400px;
  margin: 10px auto;
  padding: 10px 30px 30px 30px;
  background-color: white;
  overflow: hidden;

  .assessment-type {
    font-size: 13px;
    float: right;
    background-color: grey;
    margin: 15px 15px 50px 0;
  }

  .form-label {
    font-size: 20px;
  }

  .controls {
    overflow: hidden;
    padding: 10px;
  }

  .form-group,
  .img-load,
  .img-container,
  .nav-control,
  .svg-container {
    text-align: left;
    margin: 0 auto;
    padding: 25px 20px 15px 20px;
    width: 100%;
    overflow: hidden;

    h2 {
      margin: 30px 0;
    }
  }

  .nav-control {
    text-align: center;
  }

  .img-preview {
    margin: 10px 0;
    max-width: 150px;
    max-height: 150px;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  .form-control {
    padding-left: 10px !important;
  }

  .img-container {
    .controllers {
      margin: 10px 0;

      input {
        max-width: 100px;
        display: inline-block;
      }
    }

    .canvas {
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

  .svg-container {
    .svg {
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

}
</style>
