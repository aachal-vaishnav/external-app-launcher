<template>
  <div>
    <ResizableWindow
      v-if="visibleLocal"
      :title="app.name"
      :src="app.url"
      :visible="visibleLocal"
      @update:visible="visibleLocal = $event"
      @opened="onOpen"
      @closed="onClose"
    />
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
        // Increment usage count on backend
        await API.post(`/api/apps/${this.app.id}/usage`);
        this.$emit('used'); // notify parent workspace
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
@import "@/assets/css/nextcloud/base.css";
@import "@/assets/css/nextcloud/buttons.css";
@import "@/assets/css/nextcloud/forms.css";
@import "@/assets/css/nextcloud/cards.css";
@import "@/assets/css/nextcloud/modals.css";
@import "@/assets/css/nextcloud/workspace.css";
</style>
