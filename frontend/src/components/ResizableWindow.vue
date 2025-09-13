<template>
  <div v-if="visibleLocal" class="mini" :style="styleObj" @pointerdown.stop>
    <div class="hdr" @pointerdown="startDrag" role="toolbar" aria-label="Window header">
      <span>{{ title }}</span>
      <div class="hdr-actions">
        <button @click="openNewTab">Open</button>
        <button @click="close">X</button>
      </div>
    </div>
    <div class="body">
      <div v-if="!activated" class="overlay" @click="activated=true">
        <div class="warn">Click to activate content (sandboxed)</div>
      </div>
      <iframe :src="src" :sandbox="sandboxAttrs" ref="frame" style="width:100%;height:100%;border:0;"></iframe>
    </div>
    <div class="resizer" @pointerdown="startResize"></div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue';

export default {
  props: ['title', 'src', 'visible', 'x', 'y', 'w', 'h'],
  emits: ['update:visible', 'opened', 'closed', 'moved'],
  setup(props, { emit }) {
    const pos = reactive({
      x: props.x || 100,
      y: props.y || 100,
      w: props.w || 640,
      h: props.h || 480
    });

    const visibleLocal = ref(props.visible);
    const dragging = ref(false);
    const resizing = ref(false);
    let start = {};
    const activated = ref(false);

    // sync with parent prop
    watch(() => props.visible, (newVal) => visibleLocal.value = newVal);

    const styleObj = () => ({
      position: 'fixed',
      left: pos.x + 'px',
      top: pos.y + 'px',
      width: pos.w + 'px',
      height: pos.h + 'px',
      zIndex: 9999,
      boxShadow: '0 8px 30px rgba(0,0,0,.3)',
      background: '#fff',
      borderRadius: '8px',
      overflow: 'hidden'
    });

    function startDrag(e) {
      dragging.value = true;
      start = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
      window.addEventListener('pointermove', onDrag);
      window.addEventListener('pointerup', stopDrag);
    }

    function onDrag(e) {
      if (!dragging.value) return;
      pos.x = start.ox + (e.clientX - start.sx);
      pos.y = start.oy + (e.clientY - start.sy);
      emit('moved', { x: pos.x, y: pos.y });
    }

    function stopDrag() {
      dragging.value = false;
      window.removeEventListener('pointermove', onDrag);
      window.removeEventListener('pointerup', stopDrag);
    }

    function startResize(e) {
      resizing.value = true;
      start = { sx: e.clientX, sy: e.clientY, ow: pos.w, oh: pos.h };
      window.addEventListener('pointermove', onResize);
      window.addEventListener('pointerup', stopResize);
    }

    function onResize(e) {
      if (!resizing.value) return;
      pos.w = Math.max(300, start.ow + (e.clientX - start.sx));
      pos.h = Math.max(200, start.oh + (e.clientY - start.sy));
    }

    function stopResize() {
      resizing.value = false;
      window.removeEventListener('pointermove', onResize);
      window.removeEventListener('pointerup', stopResize);
    }

    function openNewTab() {
      window.open(props.src, '_blank');
      emit('opened');
    }

    function close() {
      visibleLocal.value = false;
      emit('update:visible', false);
      emit('closed');
    }

    const sandboxAttrs = 'allow-scripts allow-forms';

    return {
      pos,
      visibleLocal,
      styleObj,
      startDrag,
      startResize,
      openNewTab,
      close,
      sandboxAttrs,
      activated
    };
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
