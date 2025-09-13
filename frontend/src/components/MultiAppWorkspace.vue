<template>
  <div class="workspace">
    <h3>Favorites</h3>
    <AppItem
      v-for="app in favoriteApps"
      :key="app.id"
      :app="app"
      @open-preview="openApp"
      @edit="$emit('edit-app', $event)"
      @remove="$emit('remove-app', $event)"
    />

    <h3>Recent</h3>
    <AppItem
      v-for="app in recentApps"
      :key="app.id"
      :app="app"
      @open-preview="openApp"
      @edit="$emit('edit-app', $event)"
      @remove="$emit('remove-app', $event)"
    />

    <!-- Render open windows -->
    <ResizableWindow
      v-for="win in openWindows"
      :key="win.id"
      :title="win.name"
      :src="win.url"
      :x="win.x"
      :y="win.y"
      :w="win.w"
      :h="win.h"
      @update:visible="closeWindow(win)"
      @moved="onMove(win, $event)"
      @closed="closeWindow(win)"
    />
  </div>
</template>

<script>
import AppItem from "./AppItem.vue";
import ResizableWindow from "./ResizableWindow.vue";
import API from "../services/api";

export default {
  name: "MultiAppWorkspace",
  components: { AppItem, ResizableWindow },
  data() {
    return {
      apps: [],
      openWindows: [],
    };
  },
  computed: {
    favoriteApps() {
      return this.apps.filter(a => a.favorite);
    },
    recentApps() {
      return [...this.apps]
        .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
        .slice(0, 5);
    },
  },
  methods: {
    authHeader() {
      const token = localStorage.getItem("eal_token");
      return { headers: { Authorization: `Bearer ${token}` } };
    },
    async fetchApps() {
      try {
        const res = await API.get("/api/apps", this.authHeader());
        this.apps = res.data;
      } catch (err) {
        console.error("Failed to fetch apps:", err);
      }
    },
    openApp(app) {
      if (!this.openWindows.find(w => w.id === app.id)) {
        this.openWindows.push({ ...app, x: 100, y: 100, w: 640, h: 480 });
      }
    },
    closeWindow(win) {
      this.openWindows = this.openWindows.filter(w => w.id !== win.id);
    },
    async onMove(win, pos) {
      // Snap edges
      if (pos.x < 20) win.x = 0;
      if (pos.y < 20) win.y = 0;
      const sw = window.innerWidth, sh = window.innerHeight;
      if (pos.x + win.w > sw - 20) win.x = sw - win.w;
      if (pos.y + win.h > sh - 20) win.y = sh - win.h;

      // Save positions
      localStorage.setItem("workspace_windows", JSON.stringify(this.openWindows));

      // Track usage
      try {
        await API.post(`/api/apps/${win.id}/usage`, null, this.authHeader());
      } catch (err) {
        console.error("Failed to record usage:", err);
      }
    }
  },
  mounted() {
    this.fetchApps();
    this.openWindows = JSON.parse(localStorage.getItem("workspace_windows") || "[]");
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
