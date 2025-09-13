<!-- ==============================================
  new
  Multi-App Workspace Feature
============================================== -->
<template>
  <div class="workspace">
    <h3>Favorites</h3>
    <AppItem
      v-for="app in favoriteApps"
      :key="app.id"
      :app="app"
      @open-preview="openApp"
    />

    <h3>Recent</h3>
    <AppItem
      v-for="app in recentApps"
      :key="app.id"
      :app="app"
      @open-preview="openApp"
    />

    <!-- Render all open windows -->
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
      return this.apps.filter((a) => a.favorite);
    },
    recentApps() {
      return [...this.apps]
        .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
        .slice(0, 5);
    },
  },
  methods: {
    async fetchApps() {
      try {
        const res = await API.get("/api/apps", this.authHeader());
        this.apps = res.data;
      } catch (err) {
        console.error("Failed to fetch apps:", err);
      }
    },
    authHeader() {
      const token = localStorage.getItem("eal_token");
      return { headers: { Authorization: `Bearer ${token}` } };
    },
    openApp(app) {
      if (!this.openWindows.find((w) => w.id === app.id)) {
        this.openWindows.push({
          ...app,
          x: 100,
          y: 100,
          w: 640,
          h: 480,
        });
      }
    },
    closeWindow(win) {
      this.openWindows = this.openWindows.filter((w) => w.id !== win.id);
    },
    async onMove(win, pos) {
      // Snap to edges
      if (pos.x < 20) win.x = 0;
      if (pos.y < 20) win.y = 0;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      if (pos.x + win.w > screenWidth - 20) win.x = screenWidth - win.w;
      if (pos.y + win.h > screenHeight - 20) win.y = screenHeight - win.h;

      // Save open windows to localStorage
      localStorage.setItem(
        "workspace_windows",
        JSON.stringify(this.openWindows)
      );

      // Track usage
      try {
        await API.post(`/api/apps/${win.id}/usage`);
      } catch (err) {
        console.error("Failed to record usage:", err);
      }
    },
  },
  mounted() {
    this.fetchApps();
    const saved = JSON.parse(localStorage.getItem("workspace_windows") || "[]");
    this.openWindows = saved;
  },
};
</script>

<style scoped>
.workspace {
  padding: 16px;
}
</style>
