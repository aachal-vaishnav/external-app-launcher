<template>
  <div v-if="app" class="iframe-overlay">
    <div class="iframe-header">
      <span>{{ app.name }} Preview</span>
      <button @click="$emit('close')">X</button>
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
        <button @click="openNewTab">Open in New Tab</button>
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
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.iframe-header {
  background: #fff;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.iframe-body {
  flex: 1;
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
  padding: 1rem;
  text-align: center;
}
</style>
