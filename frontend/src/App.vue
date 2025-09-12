<-- new -->
<template>
  <div id="app">
    <h1>External App Launcher</h1>

    <!-- Login / Register -->
    <div v-if="!token" class="auth-panel">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button @click="register">Register</button>
      <button @click="login">Login</button>
    </div>

    <!-- App Management -->
    <div v-else>
      <h2>Welcome, {{ username }}</h2>
      <button @click="sync">Sync with Server</button>
      <AddAppForm @add-app="createApp" />

      <!-- 🔥 Category-wise App List -->
      <h3>Your Apps</h3>
      <AppList
        :apps="appsWithIcons"
        @open-preview="openPreview"
        @remove="removeApp"
      />

      <h3>Suggestions</h3>
      <div v-for="s in suggestions" :key="s.name">
        <span>{{ s.name }}</span>
        <button
          @click="
            addSuggestion({ ...s, icon: s.icon || getDefaultIcon(s.name) })
          "
        >
          Add
        </button>
      </div>

      <div>
        <button @click="exportPack">Export Pack</button>
        <input type="file" @change="importPack" />
      </div>
    </div>

    <!-- Preview Overlay -->
    <PreviewOverlay
      :app="previewAppObj"
      :visible="previewVisible"
      @closed="closePreview"
      @used="onUsed"
    />
  </div>
</template>

<script>
import API, { setToken } from "./services/api";
import AddAppForm from "./components/AddAppForm.vue";
import AppItem from "./components/AppItem.vue";
import PreviewOverlay from "./components/IframePreview.vue";
import { loadLocal, saveLocal, syncToServer } from "./services/sync";
import suggestions from "./data/suggestions.json";

// 🔥 New import
import AppList from "./components/AppList.vue";

export default {
  components: { AddAppForm, AppItem, PreviewOverlay, AppList }, // 🔥 Added AppList
  data() {
    return {
      username: "",
      password: "",
      token: null,
      apps: [],
      previewAppObj: null,
      previewVisible: false,
      suggestions,
    };
  },
  computed: {
    topUsed() {
      return [...this.apps]
        .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
        .slice(0, 3);
    },
    // 🔥 This ensures all apps have a fallback icon
    appsWithIcons() {
      return this.apps.map((app) => ({
        ...app,
        icon: app.icon || this.getDefaultIcon(app.name),
      }));
    },
  },
  methods: {
    getDefaultIcon(name) {
      const n = (name || "").toLowerCase();

      if (n.includes("google meet"))
        return "/src/assets/icons/google-meet.jpeg";
      if (n.includes("zoom")) return "/src/assets/icons/zoom.png";
      if (n.includes("trello")) return "/src/assets/icons/trello.png";
      if (n.includes("github")) return "/src/assets/icons/github.png";
      return "/src/assets/icons/default.png";
    },
    async register() {
      if (!this.username || !this.password)
        return alert("Username and password are required");
      try {
        const res = await API.post("/api/auth/register", {
          username: this.username,
          password: this.password,
        });
        alert("Registered successfully");
        console.log(res.data);
      } catch (err) {
        console.error("Register failed:", err.response?.data || err.message);
        alert("Register failed: " + (err.response?.data?.error || err.message));
      }
    },
    async login() {
      if (!this.username || !this.password)
        return alert("Username and password are required");
      try {
        const res = await API.post("/api/auth/login", {
          username: this.username,
          password: this.password,
        });
        this.token = res.data.token;
        setToken(this.token);
        localStorage.setItem("eal_token", this.token);
        this.loadApps();
      } catch (err) {
        console.error("Login failed:", err.response?.data || err.message);
        alert("Login failed: " + (err.response?.data?.error || err.message));
      }
    },
    async loadApps() {
      try {
        const res = await API.get("/api/apps");
        this.apps = res.data;
        saveLocal(this.apps);
      } catch (e) {
        this.apps = loadLocal();
      }
    },
    sync() {
      syncToServer(this.apps);
    },
    async createApp(app) {
      const defaultApp = { icon: "/src/assets/icons/default.png" };
      const res = await API.post("/api/apps", { ...defaultApp, ...app });
      this.apps.push(res.data);
      saveLocal(this.apps);
    },
    async removeApp(app) {
      await API.delete(`/api/apps/${app.id}`);
      this.apps = this.apps.filter((a) => a.id !== app.id);
      saveLocal(this.apps);
    },
    openPreview(app) {
      this.previewAppObj = app;
      this.previewVisible = true;
    },
    async onUsed() {
      if (this.previewAppObj) {
        const a = this.apps.find((x) => x.id === this.previewAppObj.id);
        if (a) {
          a.useCount = (a.useCount || 0) + 1;
          a.lastOpened = Date.now();
          saveLocal(this.apps);
        }
        await API.post(`/api/apps/${this.previewAppObj.id}/usage`);
      }
    },
    closePreview() {
      this.previewAppObj = null;
      this.previewVisible = false;
    },
    addSuggestion(s) {
      this.createApp(s);
    },
    exportPack() {
      const blob = new Blob([JSON.stringify(this.apps, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "apps-pack.json";
      a.click();
    },
    importPack(e) {
      const f = e.target.files[0];
      const r = new FileReader();
      r.onload = () => {
        const pack = JSON.parse(r.result);
        pack.forEach((p) => this.createApp(p));
      };
      r.readAsText(f);
    },
  },
};
</script>

<style>
#app {
  padding: 16px;
  font-family: Arial, sans-serif;
}
.auth-panel input {
  margin: 4px;
  padding: 4px;
}
button {
  margin: 4px;
  padding: 4px 8px;
}
</style>
