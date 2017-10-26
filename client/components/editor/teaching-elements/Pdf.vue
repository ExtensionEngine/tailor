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
      <div id="pdfcontainer">
        <loader v-show="!showError" class="loader"></loader>
        <div v-if="showViewer" id="pdf">
          <object
            :data="source.src"
            :type="source.type"
            id="doc">
          </object>
          <div class="new-window">
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
import isSafari from 'is-safari';
import Loader from '../../common/Loader';

export default {
  name: 'te-pdf',
  props: ['element', 'isFocused'],
  data() {
    return {
      showError: false,
      showViewer: true
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
    },
    safari() {
      return isSafari;
    }
  },
  watch: {
    source: {
      immediate: true,
      handler() {
        this.showViewer = true;
        this.showError = false;
        setTimeout(() => (this.showError = true), 1500);
      }
    }
  },
  components: {
    Loader
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
  top: 0;
  left: 0;
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

#pdfcontainer {
  width: 100%;
  height: 360px;
  position: relative;
}

#pdf {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: none;
  z-index: 10;
  padding-bottom: 30px;

  #doc {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.loader {
  position: relative;
  top: 50%;
}

.new-window {
  background: white;
  width: 100%;

  a {
    font-size: 22px;
    color: #444;

    &:hover {
      color: #42b983;
    }
  }
}

</style>
