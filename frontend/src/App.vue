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

      <!-- Draggable App List -->
      <draggable v-model="apps" item-key="id">
        <template #item="{element: app}">
          <div class="app-item">
            <span>{{ app.name }}</span>
            <button @click="editApp(app)">Edit</button>
            <button @click="removeApp(app)">Remove</button>
            <button @click="openPreview(app)">Open</button>
          </div>
        </template>
      </draggable>

      <!-- Suggestions -->
      <h3>Suggestions</h3>
      <div v-for="s in suggestions" :key="s.name">
        <span>{{ s.name }}</span>
        <button @click="addSuggestion(s)">Add</button>
      </div>

      <!-- Export / Import -->
      <div style="margin-top: 1rem;">
        <button @click="exportPack">Export Pack</button>
        <input type="file" @change="importPack" />
      </div>
    </div>

    <!-- Preview Overlay -->
    <IframePreview
      v-if="previewAppObj"
      :app="previewAppObj"
      @closed="closePreview"
      @used="onUsed"
    />
  </div>
</template>

<script>
import AddAppForm from "./components/AddAppForm.vue";
import IframePreview from "./components/IframePreview.vue";
import API, { setToken } from "./services/api";
import suggestions from "./data/suggestions.json";
import { saveLocal, loadLocal, syncToServer } from "./services/sync";
import draggable from "vuedraggable";

export default {
  name: "App",
  components: { AddAppForm, IframePreview, draggable },
  data() {
    return {
      username: "",
      password: "",
      token: null,
      apps: [],
      previewAppObj: null,
      suggestions,
    };
  },
  methods: {
    async register() {
      if (!this.username || !this.password) return alert("Username and password required");
      try {
        await API.post("/api/auth/register", { username: this.username, password: this.password });
        alert("Registered successfully!");
      } catch (err) {
        alert("Register failed: " + (err.response?.data?.error || err.message));
      }
    },
    async login() {
      if (!this.username || !this.password) return alert("Username and password required");
      try {
        const res = await API.post("/api/auth/login", { username: this.username, password: this.password });
        this.token = res.data.token;
        setToken(this.token);
        localStorage.setItem("eal_token", this.token);
        this.loadApps();
      } catch (err) {
        alert("Login failed: " + (err.response?.data?.error || err.message));
      }
    },

    async loadApps() {
      try {
        const res = await API.get("/api/apps");
        this.apps = res.data;
        saveLocal(this.apps);
      } catch {
        this.apps = loadLocal();
      }
    },
    sync() {
      syncToServer(this.apps);
    },
    async createApp(app) {
      const res = await API.post("/api/apps", app);
      this.apps.push(res.data);
      saveLocal(this.apps);
    },
    async removeApp(app) {
      await API.delete(`/api/apps/${app.id}`);
      this.apps = this.apps.filter(a => a.id !== app.id);
      saveLocal(this.apps);
    },
    async editApp(app) {
      const newName = prompt("Edit Name:", app.name);
      const newUrl = prompt("Edit URL:", app.url);
      if (!newName || !newUrl) return;
      const payload = { ...app, name: newName, url: newUrl };
      const res = await API.put(`/api/apps/${app.id}`, payload);
      const idx = this.apps.findIndex(a => a.id === app.id);
      if (idx !== -1) this.apps[idx] = res.data;
      saveLocal(this.apps);
    },
    openPreview(app) {
      this.previewAppObj = app;
      setTimeout(() => {
        window.open(app.url, "_blank");
        this.closePreview();
      }, 100);
    },
    closePreview() {
      this.previewAppObj = null;
    },
    onUsed() {
      if (!this.previewAppObj) return;
      const app = this.apps.find(a => a.id === this.previewAppObj.id);
      if (app) {
        app.useCount = (app.useCount || 0) + 1;
        saveLocal(this.apps);
      }
    },
    addSuggestion(s) {
      this.createApp(s);
    },
    exportPack() {
      const blob = new Blob([JSON.stringify(this.apps, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "apps-pack.json";
      a.click();
    },
    importPack(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const pack = JSON.parse(reader.result);
        pack.forEach(app => this.createApp(app));
      };
      reader.readAsText(file);
    },
  },
  mounted() {
    const storedToken = localStorage.getItem("eal_token");
    if (storedToken) {
      this.token = storedToken;
      setToken(storedToken);
      this.loadApps();
    }
  },
};
</script>

<style>
@import "@/assets/css/nextcloud/base.css";
@import "@/assets/css/nextcloud/buttons.css";
@import "@/assets/css/nextcloud/forms.css";
@import "@/assets/css/nextcloud/cards.css";
@import "@/assets/css/nextcloud/modals.css";
@import "@/assets/css/nextcloud/workspace.css";
</style>

