<template>
  <div class="workspace">
    <section class="section">
      <h3 class="section-title">⭐ Favorites</h3>
      <div class="app-grid">
        <AppItem
          v-for="app in favoriteApps"
          :key="app.id"
          :app="app"
          @open-preview="openApp"
          @edit="$emit('edit-app', $event)"
          @remove="$emit('remove-app', $event)"
        />
      </div>
    </section>

    <section class="section">
      <h3 class="section-title">🕒 Recent</h3>
      <div class="app-grid">
        <AppItem
          v-for="app in recentApps"
          :key="app.id"
          :app="app"
          @open-preview="openApp"
          @edit="$emit('edit-app', $event)"
          @remove="$emit('remove-app', $event)"
        />
      </div>
    </section>

    <transition-group name="fade" tag="div">
      <ResizableWindow
        v-for="win in openWindows"
        :key="win.id"
        :title="win.name"
        :src="win.url"
        :x="win.x"
        :y="win.y"
        :w="win.w"
        :h="win.h"
        :visible="true" 
        @update:visible="closeWindow(win)"
        @moved="onMove(win, $event)"
        @closed="closeWindow(win)"
      />
    </transition-group>
  </div>
</template>

<script>
import AppItem from "./AppItem.vue";
import ResizableWindow from "./ResizableWindow.vue";

export default {
  name: "MultiAppWorkspace",
  components: { AppItem, ResizableWindow },
  props: {
    apps: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
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
    openApp(app) {
      if (!this.openWindows.find(w => w.id === app.id)) {
        this.openWindows.push({ ...app, x: 100, y: 100, w: 640, h: 480 });
      }
    },
    closeWindow(win) {
      this.openWindows = this.openWindows.filter(w => w.id !== win.id);
    },
    onMove(win, pos) {
      if (pos.x < 20) win.x = 0;
      if (pos.y < 20) win.y = 0;
      const sw = window.innerWidth, sh = window.innerHeight;
      if (pos.x + win.w > sw - 20) win.x = sw - win.w;
      if (pos.y + win.h > sh - 20) win.y = sh - win.h;

      localStorage.setItem("workspace_windows", JSON.stringify(this.openWindows));
    }
  },
  mounted() {
    this.openWindows = JSON.parse(localStorage.getItem("workspace_windows") || "[]");
  }
};
</script>

<style scoped>
.workspace {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #333;
}

.app-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
