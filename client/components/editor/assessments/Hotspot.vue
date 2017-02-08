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
        <input type="file" @change="onFileChange">
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
      <div class="controlers">
        <button @click="removeImage" class="btn btn-default" type="button">Remove image</button>
        <button @click="starDrawing" class="btn btn-default" type="button" v-show="!start"><span class="fa fa-pencil"></span></button>
        <button @click="finishDrawing" class="btn btn-default" type="button"v-show="start"><span class="fa fa-check"></span></button>
        <button @click="undo" class="btn btn-default" type="button"><span class="fa fa-undo"></span></button>
        <button @click="redo" class="btn btn-default" type="button"><span class="fa fa-repeat"></span></button>
        <input type="range" name="points" min="0" max="1" @change="changeOpacity($event)" step="0.1">
      </div>
      <div class="canvas">
        <canvas ref="canvas" @mousedown="onmousedown"></canvas>
      </div>
    </div>
    <div v-show="image && page === 3" class="svg-container">
      <div class="form-group">
        <span class="form-label">Select correct areas:</span>
      </div>
      <div class="svg">
        <img :src="image">
        <svg ref="svg">
          <polygon v-for="(element, index) in surface.areas" @click="select(index, $event)" :points="parsePoints(element)"/>
        </svg>
      </div>
    </div>
    <div class="nav-control">
      <button @click="previous" :disabled="page < 2" class="btn btn-default" type="button">
        <span class="fa fa-chevron-left"></span>
      </button>
      <button @click="next" :disabled="page > 2"class="btn btn-default" type="button">
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
import clone from 'lodash/clone';
import yup from 'yup';

const schema = yup.object().shape({
  question: yup.string().trim().min(1).required(),
  correct: yup.array().of((yup.string().trim().min(1).required()))
});

const defaultAssessment = {
  question: '',
  hint: '',
  image: '',
  correct: [],
  surface: {
    positions: [],
    lastPosition: null,
    areas: [],
    scale: 0,
    width: 0,
    states: {
      undo: [],
      redo: []
    }
  }
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
      start: false,
      lastX: null,
      lastY: null,
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
        this.updateCanvas();
      }
    },
    'surface.width': function() {
      if (this.page === 2) this.updateCanvas(this.surface.scale);
      if (this.page === 3) this.updateSvg(this.surface.scale);
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
      let canvas = this.$refs.canvas1;
      let question = {
        _cid: this.assessment._cid,
        type: this.type,
        question: this.question,
        correct: this.correct,
        image: this.image,
        surfaceImage: canvas.toDataURL(),
        surface: this.surface,
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
      // check if canvas has been created
      if (this.page === 2) {
        this.updateCanvas();
      } else if (this.page === 3) {
        this.updateCanvas();
      }
    },
    changeOpacity(event) {
      this.$refs.canvas.style.opacity = event.target.value;
    },
    updateSvg(scale) {
      [].concat(...this.surface.areas).forEach(item => {
        item.x *= (scale || 1);
        item.y *= (scale || 1);
      });
    },
    parsePoints(element) {
      return element.map(item => {
        return item.x + ',' + item.y;
      });
    },
    updateCanvas() {
      var canvas = this.$refs.canvas;
      let ratio;
      var self = this;
      this.$nextTick(() => {
        if (this.img.naturalWidth > this.$refs.canvas.parentElement.clientWidth) {
          ratio = this.img.naturalWidth / this.$refs.canvas.parentElement.clientWidth;
          canvas.width = this.$refs.canvas.parentElement.clientWidth;
          canvas.height = this.img.naturalHeight / ratio;
          redraw();
        }
      });
      var ctx = canvas.getContext('2d');
      trackTransforms(ctx);
      function redraw() {
      // Clear the entire canvas
        var p1 = ctx.transformedPoint(0, 0);
        var p2 = ctx.transformedPoint(canvas.width, canvas.height);
        ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
        ctx.drawImage(self.img, 0, 0, canvas.width, canvas.height);
        if (self.surface.areas.length === 0) return;
        var tempArray = [];
        var scale = ctx.getTransform().a;

        tempArray = clone(self.surface.areas);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'butt';
        tempArray.forEach(outerItem => {
          ctx.beginPath();
          outerItem.forEach((innerItem, index) => {
            innerItem = {
              x: ctx.transformedPoint(innerItem.x, innerItem.y).x * scale + ctx.getTransform().e,
              y: ctx.transformedPoint(innerItem.x, innerItem.y).y * scale + ctx.getTransform().f
            };
            if (index === 0 || index / 2 === 0) {
              ctx.moveTo(innerItem.x, innerItem.y);
            } else {
              ctx.lineTo(innerItem.x, innerItem.y);
              ctx.stroke();
            }
          });
        });
      }

      redraw();
      self.lastX = canvas.width / 2;
      self.lastY = canvas.height / 2;

      var dragStart, dragged;

      canvas.addEventListener('mousedown', function(evt) {
        if (self.start) return;
        document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
        self.lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        self.lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragStart = ctx.transformedPoint(self.lastX, self.lastY);
        dragged = false;
      }, false);

      canvas.addEventListener('mousemove', function(evt) {
        if (self.start) return;
        self.lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
        self.lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
        dragged = true;

        if (dragStart) {
          var pt = ctx.transformedPoint(self.lastX, self.lastY);
          var scale = ctx.getTransform().a;
          ctx.save();
          ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
          var XLeft = ctx.getTransform().e;
          var YTop = ctx.getTransform().f;
          var XRight = XLeft + scale * canvas.width;
          var YBottom = YTop + scale * canvas.height;
          if (XLeft > 0 || XRight < canvas.width || YTop > 0 || YBottom < canvas.height) {
            ctx.restore();
          } else redraw();
        }
      }, false);

      canvas.addEventListener('mouseup', function(evt) {
        if (self.start) return;
        dragStart = null;
        if (!dragged) return;
      }, false);

      var zoomPoint = null;
      var scaleFactor = 1.1;
      function checkBoundaries(pt) {
        var scale = ctx.getTransform().a;
        var XLeft = ctx.getTransform().e;
        var YTop = ctx.getTransform().f;
        var XRight = XLeft + scale * canvas.width;
        var YBottom = YTop + scale * canvas.height;

        if (XLeft > 0 || XRight < canvas.width || YTop > 0 || YBottom < canvas.height) {
          zoomPoint = pt;
          if (XLeft > 0) {
            zoomPoint.x = 0;
          } else if (YTop > 0) {
            zoomPoint.y = 0;
          } else if (XRight < canvas.width) {
            zoomPoint.x = canvas.width;
          } else if (YBottom < canvas.height) {
            zoomPoint.y = canvas.height;
          }
          return false;
        }
        return true;
      }

      function drawLoop(pt, scale, factor) {
        if (scale !== 1 && scale < 1.0001) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          redraw();
          return;
        }
        if (checkBoundaries(pt)) {
          redraw();
        } else {
          ctx.restore();
          ctx.save();
          ctx.translate(zoomPoint.x, zoomPoint.y);
          ctx.scale(factor, factor);
          ctx.translate(-zoomPoint.x, -zoomPoint.y);
          if (drawLoop(pt, factor)) {
            zoomPoint = null;
            return true;
          }
        }
      }
      var zoom = (clicks) => {
        var factor = Math.pow(scaleFactor, clicks);
        var pt = ctx.transformedPoint(self.lastX, self.lastY);
        var scale = ctx.getTransform().a;
        if (scale > 8 && clicks > 0) return;
        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.scale(factor, factor);
        ctx.translate(-pt.x, -pt.y);
        drawLoop(pt, scale, factor);
      };

      var handleScroll = function(evt) {
        var delta = evt.wheelDelta ? evt.wheelDelta / 200 : evt.detail ? -evt.detail : 0;
        if (delta) {
          for (let i = Math.abs(delta); i >= 0; i -= 0.2) {
            if (delta < 0) zoom(-0.2);
            if (delta > 0) zoom(0.2);
          }
        }
        return evt.preventDefault() && false;
      };

      canvas.addEventListener('DOMMouseScroll', handleScroll, false);
      canvas.addEventListener('mousewheel', handleScroll, false);

      // Adds ctx.getTransform() - returns an SVGMatrix
      // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
      function trackTransforms(ctx) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        var xform = svg.createSVGMatrix();
        ctx.getTransform = function() { return xform; };

        var savedTransforms = [];
        var save = ctx.save;
        ctx.save = function() {
          savedTransforms.push(xform.translate(0, 0));
          return save.call(ctx);
        };

        var restore = ctx.restore;
        ctx.restore = function() {
          xform = savedTransforms.pop();
          return restore.call(ctx);
        };

        var scale = ctx.scale;
        ctx.scale = function(sx, sy) {
          xform = xform.scaleNonUniform(sx, sy);
          return scale.call(ctx, sx, sy);
        };

        var rotate = ctx.rotate;
        ctx.rotate = function(radians) {
          xform = xform.rotate(radians * 180 / Math.PI);
          return rotate.call(ctx, radians);
        };

        var translate = ctx.translate;
        ctx.translate = function(dx, dy) {
          xform = xform.translate(dx, dy);
          return translate.call(ctx, dx, dy);
        };

        var transform = ctx.transform;
        ctx.transform = function(a, b, c, d, e, f) {
          var m2 = svg.createSVGMatrix();
          m2.a = a; m2.b = b; m2.c = c; m2.d = d; m2.e = e; m2.f = f;
          xform = xform.multiply(m2);
          return transform.call(ctx, a, b, c, d, e, f);
        };

        var setTransform = ctx.setTransform;
        ctx.setTransform = function(a, b, c, d, e, f) {
          xform.a = a;
          xform.b = b;
          xform.c = c;
          xform.d = d;
          xform.e = e;
          xform.f = f;
          return setTransform.call(ctx, a, b, c, d, e, f);
        };

        var pt = svg.createSVGPoint();
        ctx.transformedPoint = function(x, y) {
          pt.x = x; pt.y = y;
          return pt.matrixTransform(xform.inverse());
        };
      }
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
    starDrawing() {
      this.start = true;
    },
    finishDrawing() {
      this.start = false;
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext('2d');
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'white';
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(this.surface.lastPosition.x, this.surface.lastPosition.y);
      ctx.lineTo(this.surface.positions[0].x, this.surface.positions[0].y);
      ctx.stroke();
      this.surface.positions.push(this.surface.positions[0]);
      this.surface.areas.push(
        this.surface.positions.map(item => {
          return {x: item.x, y: item.y};
        })
      );
      this.surface.positions = [];
    },
    undo() {
      if (this.surface.states.undo.length === 0) return;
      this.surface.states.redo.push({
        shape: this.surface.areas[this.surface.areas.length - 1]
      });
      this.surface.areas.pop();
      this.updateCanvas();
    },
    redo() {
      if (this.surface.states.redo.length === 0) return;
      let obj = this.surface.states.redo.pop();
      this.surface.areas.push(obj.shape);
    },
    onmousedown(event) {
      if (!this.start) return;
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext('2d');
      this.lastX = event.offsetX || (event.pageX - canvas.offsetLeft);
      this.lastY = event.offsetY || (event.pageY - canvas.offsetTop);
      if (this.surface.positions.length === 0) {
        let pos = this.getXY(event);
        this.surface.lastPosition = pos;
        this.surface.positions.push(pos);
      } else {
        let pos = this.getXY(event);
        this.surface.positions.push(pos);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.lineCap = 'butt';
        ctx.beginPath();
        ctx.moveTo(this.surface.lastPosition.x, this.surface.lastPosition.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        this.surface.lastPosition = pos;
      }
    },
    onFileChange(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      }
      this.createImage(files[0]);
    },
    createImage(file) {
      var reader = new FileReader();  //  eslint-disable-line
      var vm = this;

      reader.onload = (e) => {
        vm.image = e.target.result;
        vm.img.src = vm.image;
      };

      reader.readAsDataURL(file);
    },
    removeImage: function (e) {
      this.image = '';
    },
    getXY(event) {
      var canvas = this.$refs.canvas;
      var ctx = canvas.getContext('2d');
      var pos = ctx.transformedPoint(this.lastX, this.lastY);
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

    .controlers {
      margin: 10px 0;

      input {
        max-width: 100px;
        display: inline-block;
      }
    }

    .canvas {

      canvas {
        display: block;
      }

      .coveringCanvas1:hover {
        cursor: crosshair;
      }

      img {
      width: 100%;
      height: 100%;
      max-width: 1008px;
      z-index: 1;
      opacity: 1;
      }

      .coveringCanvas1 {
        position: absolute;
        z-index: 2;
      }

      .select-region {
        position: absolute;
        width: 100px;
        height: 100px;
        z-index: 3;
        border: 1px solid white;
      }
    }
  }

  .svg-container {
    .svg {
      position: relative;

      img {
        width: 100%;
        height: 100%;
        max-width: 1008px;
        z-index: 1;
      }
      svg {
        position: absolute;
        width: 100%;
        height: 100%;
        max-width: 1008px;
        top: 0px;
        right: 0px;
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
