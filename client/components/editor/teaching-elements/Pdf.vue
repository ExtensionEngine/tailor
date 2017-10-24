<template>
  <div class="te-pdf">
    <div v-if="showPlaceholder">
      <div class="well pdf-placeholder">
        <div class="message">
          <span class="heading">Pdf placeholder</span>
          <span v-if="!isFocused">Select to edit</span>
          <span v-else>Please use toolbar to enter url</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="!isFocused" class="overlay">
        <div class="message">Click to preview</div>
      </div>
      <div v-if="showError" class="error">
        <div class="message">
          <span class="icon mdi mdi-alert"></span>
          <p>Error loading PDF file!</p>
        </div>
      </div>
      <div class="pdf">
        <object
          :data="source.src"
          :type="source.type"
          @error="onError"
          @load="onLoad"
          id="doc">
        </object>
        <a :href="source.src" class="new-window" target="_blank">
          <span class="mdi mdi-open-in-new"></span>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get';
const isFirefox = typeof navigator !== 'undefined' && /^(?!.*Seamonkey)(?=.*Firefox).*/i.test(navigator.userAgent);
// const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
// const isIe = /MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf('Trident/') > -1;
// const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export default {
  name: 'te-pdf',
  props: ['element', 'isFocused'],
  data() {
    return {
      showError: false
    };
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
    }
  },
  mounted() {
    this.setupLoader(this.source);
  },
  methods: {
    onError() {
      this.showError = true;
    },
    onLoad() {
      this.showError = false;
    },
    setupLoader({ src } = {}) {
      if (this.loader) this.loader.parentNode.removeChild(this.loader);
      if (!src) return;
      if (isFirefox) return;
      const loader = document.createElement('link');
      loader.rel = 'stylesheet';
      loader.href = src;
      loader.onerror = this.onError;
      loader.onload = this.onLoad;
      this.loader = loader;
      this.$el.appendChild(loader);
    }
  },
  watch: {
    source(val) {
      this.setupLoader(val);
    }
  }
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
  z-index: 98;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.9);
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

.pdf {
  #doc {
    width: 100%;
    height: 360px;
    display: block;
  }
}

.new-window {
  font-size: 22px;
  color: #444;

  &:hover {
    color: #42b983;
  }
}

</style>
