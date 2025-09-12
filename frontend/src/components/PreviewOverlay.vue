<template>
  <div>
    <ResizableWindow
      v-if="visibleLocal"
      :title="app.name"
      :src="app.url"
      :visible="visibleLocal"
      @update:visible="visibleLocal = $event"
      @closed="onClose"
      @opened="onOpen"
    />
  </div>
</template>

<script>
import ResizableWindow from './ResizableWindow.vue';
import API from '../services/api';

export default {
  props: ['app', 'visible'],
  components: { ResizableWindow },
  data() {
    return {
      visibleLocal: this.visible
    };
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
      this.$emit('closed');
    }
  }
};
</script>
