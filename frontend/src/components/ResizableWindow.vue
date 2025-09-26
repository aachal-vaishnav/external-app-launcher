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
      <div v-if="!activated" class="overlay" @click="activated = true">
        <div class="warn">Click to activate content (sandboxed)</div>
      </div>
      <iframe
        :src="src"
        :sandbox="sandboxAttrs"
        ref="frame"
        style="width:100%;height:100%;border:0;"
      ></iframe>
    </div>
    <div class="resizer" @pointerdown="startResize"></div>
  </div>
</template>

<script>
import { ref, reactive, watch, computed } from 'vue';

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

    watch(() => props.visible, (newVal) => visibleLocal.value = newVal);

    const styleObj = computed(() => ({
      position: 'fixed',
      left: pos.x + 'px',
      top: pos.y + 'px',
      width: pos.w + 'px',
      height: pos.h + 'px',
      zIndex: 9999,
      boxShadow: '0 8px 30px rgba(0,0,0,.3)',
      background: '#fff',
      borderRadius: '10px',
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease'
    }));

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
.mini {
  animation: fadeIn 0.3s ease;
}

.hdr {
  background: #f3f4f6;
  padding: 0.6rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  cursor: move;
  user-select: none;
}

.hdr-actions button {
  margin-left: 0.5rem;
  background: #e5e7eb;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.hdr-actions button:hover {
  background-color: #d1d5db;
}

.body {
  position: relative;
  height: 100%;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  cursor: pointer;
}

.warn {
  background: #fef3c7;
  color: #92400e;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
  z-index: 1;
}

.resizer {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  background: #e5e7eb;
  cursor: nwse-resize;
  z-index: 20;
  border-top-left-radius: 4px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
