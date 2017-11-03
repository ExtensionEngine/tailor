<template>
  <div class="te-pdf">
    <div v-show="showPlaceholder">
      <div class="well pdf-placeholder">
        <div class="message">
          <span class="heading">Pdf placeholder</span>
          <span v-if="!isFocused">Select to edit</span>
          <span v-else>Please use toolbar to enter url</span>
        </div>
      </div>
    </div>
    <div v-show="!showPlaceholder">
      <div v-if="!isFocused" class="overlay">
        <div class="message">Click to preview</div>
      </div>
      <div class="loader-outer">
        <div class="loader-inner">
          <circular-progress v-show="!showError"></circular-progress>
        </div>
      </div>
      <div class="pdf-container">
        <div
          v-show="showViewer"
          class="pdf"
          ref="pdf">
          <div v-if="source" class="new-window">
            <a :href="source.src" target="_blank">
              <span class="mdi mdi-open-in-new"></span>
            </a>
          </div>
        </div>
        <img
          v-if="safari"
          v-show="false"
          :src="source.src"
          @error="showViewer = false">
        <div v-show="showError" class="error">
          <div class="message">
            <span class="icon mdi mdi-alert"></span>
            <p>Error loading PDF file!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
import isIexplorer from 'is-iexplorer';
import isSafari from 'is-safari';
import CircularProgress from 'components/common/CircularProgress';

if (isIexplorer) document.body.classList.add('ie');

export default {
  name: 'te-pdf',
  props: ['element', 'isFocused'],
  data() {
    return {
      showError: false,
      showViewer: true
    };
  },
  mounted() {
    this.embedPdf();
  },
  methods: {
    embedPdf() {
      if (!this.source) return;
      if (this.pdfObject) this.pdfObject.remove();
      const pdfObject = document.createElement('object');
      pdfObject.data = this.source.src;
      pdfObject.type = this.source.type;
      this.$refs.pdf.appendChild(pdfObject);
      this.pdfObject = pdfObject;
      setTimeout(() => (this.showError = true), 2500);
    }
  },
  computed: {
    source() {
      const src = get(this.element, 'data.url');
      if (!src) return;
      const type = 'application/pdf';
      return { type, src };
    },
    showPlaceholder() {
      return !this.source;
    },
    safari() {
      return isSafari;
    },
    ie() {
      return isIexplorer;
    },
    showElement() {
      return !this.ie || this.isFocused;
    }
  },
  beforeDestroy() {
    this.pdfObject = null;
  },
  watch: {
    source() {
      this.showViewer = true;
      this.showError = false;
      this.embedPdf();
    }
  },
  components: { CircularProgress }
};
</script>

<style lang="scss" scoped>
.te-pdf {
  position: relative;
}

.pdf-placeholder {
  .message {
    padding: 100px;

    .heading {
      font-size: 24px;
    }

    span {
      display: block;
      font-size: 18px;
    }
  }
}

.overlay {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background-color: #333;
  opacity: 0.9;

  .message {
    position: relative;
    top: 45%;
    color: green;
    font-size: 22px;
  }
}

.error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.9);
  z-index: 1;
}

.error .message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;

  .icon { font-size: 42px; }
}

.well {
  margin: 0;
}

.pdf-container {
  position: relative;
  width: 100%;
  height: 360px;

  .wrapper {
    width: 100%;
    height: 100%;
  }
}

.pdf {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 30px;
  z-index: 2;

  .ie & {
    background: #585858;
  }

  /deep/ object {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.loader-outer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .loader-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.new-window {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #fff;

  a {
    color: #444;
    font-size: 22px;

    &:hover {
      color: #42b983;
    }
  }
}
</style>
