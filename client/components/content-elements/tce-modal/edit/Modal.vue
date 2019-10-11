<template>
  <transition name="modal">
    <div
      v-show="show"
      :backdrop="backdrop"
      :class="show ? 'in' : 'out'"
      class="modal"
      role="alertdialog"
      aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import focusTrap from 'focus-trap';

export default {
  props: {
    show: { type: Boolean, default: false },
    backdrop: { type: Boolean, default: true },
    focus: { type: Boolean, default: true }
  },
  watch: {
    show(isOpen) {
      toggleClass(document.body, 'modal-open', isOpen);
      const focus = isOpen && this.focus;
      this.$nextTick(() => toggleFocusTrap(this.focusTrap, focus));
    }
  },
  mounted() {
    this.focusTrap = focusTrap(this.$el, { escapeDeactivates: false });
  },
  beforeDestroy() {
    this.focusTrap = null;
  }
};

function toggleClass(el, className, condition) {
  if (condition) return el.classList.add(className);
  return el.classList.remove(className);
}

function toggleFocusTrap(focusTrap, condition) {
  if (condition) return focusTrap.activate();
  return focusTrap.deactivate();
}
</script>

<style lang="scss" scoped>
.modal {
  display: block;
}

.modal.in[backdrop] {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  height: 100%;
  margin-top: 0;
  margin-bottom: 0;
}

.modal-enter, .modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-content, .modal-leave-active .modal-content {
  transform: scale(1.1);
}
</style>

<style lang="scss">
@function headings($from: 1, $to: 6) {
  @if $from == $to {
    @return 'h#{$from}';
  }
  @else {
    @return 'h#{$from},' + headings($from + 1, $to);
  }
}

.modal-content {
  top: 96px;
  max-width: 640px;
  margin: 0 auto;
  padding: 4px;
  font: 14px $font-family-secondary;
  text-align: left;
  border: none;
  border-radius: 2px;
  box-shadow:
    0 11px 15px -7px rgba(0, 0, 0, 0.2),
    0 24px 38px 3px rgba(0, 0, 0, 0.14),
    0 9px 46px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

.modal-header {
  color: #333;
  font-size: 20px;
  font-weight: 500;
  border: none;

  #{headings()} {
    font-size: 20px;
  }
}

.modal-body {
  color: #555;
  font-weight: 400;
  overflow: hidden;

  b, strong {
    color: #363636;
  }
}

.modal-footer {
  padding: 8px;
  font-weight: 500;
  border: none;
}
</style>
