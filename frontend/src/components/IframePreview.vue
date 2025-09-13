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
  props: ['app'],
  data() {
    return {
      blocked: false,
    };
  },
  methods: {
    onLoad() {
      // Some browsers may not trigger error; check for blank content
      const iframe = this.$refs.frame;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc || doc.body.innerHTML === '') this.blocked = true;
      } catch {
        this.blocked = true;
      }
    },
    onError() {
      this.blocked = true;
    },
    openNewTab() {
      window.open(this.app.url, '_blank');
    },
  },
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
