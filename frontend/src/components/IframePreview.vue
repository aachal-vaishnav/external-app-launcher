<template>
  <div v-if="app" class="iframe-overlay">
    <div class="iframe-modal">
      <div class="iframe-header">
        <span class="app-title">{{ app.name }} Preview</span>
        <button class="close-btn" @click="$emit('close')">✖</button>
      </div>

      <div class="iframe-body">
        <iframe
          ref="frame"
          :src="app.url"
          sandbox="allow-scripts allow-same-origin allow-forms"
          @load="onLoad"
          @error="onError"
        ></iframe>

        <div v-if="blocked" class="blocked">
          ⚠️ Cannot preview this URL due to browser security.
          <div class="blocked-actions">
            <button class="btn open-btn" @click="openNewTab">Open in New Tab</button>
            <button class="btn close-btn" @click="$emit('close')">Close Preview</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["app"],
  data() {
    return {
      blocked: false,
    };
  },
  methods: {
    onLoad() {
      const iframe = this.$refs.frame;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || doc.body.innerHTML === "") this.blocked = true;
      } catch {
        this.blocked = true;
      }
    },
    onError() {
      this.blocked = true;
    },
    openNewTab() {
      window.open(this.app.url, "_blank");
    },
  },
};
</script>

<style scoped>
.iframe-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(6px);
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out;
}

.iframe-modal {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.iframe-header {
  background: #f5f5f5;
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
}

.app-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #666;
}

.iframe-body {
  flex: 1;
  position: relative;
}

iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.blocked {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 80%;
  max-width: 400px;
}

.blocked-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: none;
}

.open-btn {
  background-color: #3b82f6;
  color: white;
}

.close-btn {
  background-color: #eee;
  color: #333;
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
