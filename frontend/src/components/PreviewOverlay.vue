<template>
  <div class="app-window-wrapper">
    <transition name="fade-scale">
      <ResizableWindow
        v-if="visibleLocal"
        :title="app.name"
        :src="app.url"
        :visible="visibleLocal"
        @update:visible="visibleLocal = $event"
        @opened="onOpen"
        @closed="onClose"
      />
    </transition>
  </div>
</template>

<script>
import ResizableWindow from './ResizableWindow.vue';
import API from '../services/api';

export default {
  name: 'AppWindow',
  props: {
    app: { type: Object, required: true },
    visible: { type: Boolean, default: true }
  },
  components: { ResizableWindow },
  data() {
    return { visibleLocal: this.visible };
  },
  watch: {
    visible(newVal) {
      this.visibleLocal = newVal;
    }
  },
  methods: {
    async onOpen() {
      try {
        await API.post(`/api/apps/${this.app.id}/usage`);
        this.$emit('used');
      } catch (err) {
        console.error('Failed to record usage:', err);
      }
    },
    onClose() {
      this.visibleLocal = false;
      this.$emit('closed');
    }
  }
};
</script>

<style scoped>
.app-window-wrapper {
  position: relative;
  z-index: 900;
  padding: 1rem;
}

/* Optional fade-scale animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
