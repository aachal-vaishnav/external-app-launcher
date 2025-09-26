<template>
  <div id="app">
    <h1>External App Launcher</h1>

    <!-- Authentication -->
    <div v-if="!token" class="auth-panel">
      <input v-model="username" placeholder="Username" />
      <input type="password" v-model="password" placeholder="Password" />
      <button @click="register">Register</button>
      <button @click="login">Login</button>
    </div>

    <div v-else class="app-shell">
      <!-- Sidebar Navigation -->
      <nav class="sidebar">
        <button @click="activeTab = 'workspace'" :class="{active: activeTab==='workspace'}">Workspace</button>
        <button @click="activeTab = 'add'" :class="{active: activeTab==='add'}">Add App</button>
        <button @click="activeTab = 'settings'" :class="{active: activeTab==='settings'}">Settings</button>
        <button @click="activeTab = 'usage'" :class="{active: activeTab==='usage'}">Usage</button>
        <button @click="logout">Logout</button>
      </nav>

      <!-- Main Content -->
      <main class="main-view">
        <!-- Workspace Tab -->
        <MultiAppWorkspace
          v-if="activeTab === 'workspace'"
          :apps="apps"
          @open-preview="previewApp = $event"
          @edit-app="editApp"
          @remove-app="removeApp"
        />

        <!-- Add App Tab -->
        <AddAppForm
          v-if="activeTab === 'add'"
          @add-app="onAppAdded"
        />

        <!-- Settings Tab -->
        <SettingsPanel
          v-if="activeTab === 'settings'"
          :apps="apps"
          @edit="editApp"
          @remove="removeApp"
          @start-oauth="selectedAppForOAuth = $event"
        />

        <!-- Usage Tab -->
        <UsageDashboard
          v-if="activeTab === 'usage'"
          :apps="apps"
        />
      </main>
    </div>

    <!-- Preview Overlay -->
    <IframePreview
  v-if="previewApp"
  :app="previewApp"
  @close="previewApp = null"
  @used="onUsed"
/>


    <!-- OAuth Popup -->
    <OAuthPopup
  v-if="selectedAppForOAuth"
  :appId="selectedAppForOAuth.id"
  :provider="selectedAppForOAuth.provider"
  @close="selectedAppForOAuth = null"
/>

  </div>
</template>

<script>
import AddAppForm from "./components/AddAppForm.vue";
import MultiAppWorkspace from "./components/MultiAppWorkspace.vue";
import SettingsPanel from "./components/SettingsPanel.vue";
import UsageDashboard from "./components/UsageDashboard.vue";

import IframePreview from "./components/IframePreview.vue";

import OAuthPopup from "./components/OAuthPopup.vue";
import API, { setToken } from "./services/api.js";

export default {
  name: "App",
  components: {
    AddAppForm,
    MultiAppWorkspace,
    SettingsPanel,
    UsageDashboard,
    IframePreview,
    OAuthPopup,
  },
  data() {
    return {
      username: "",
      password: "",
      token: localStorage.getItem("eal_token") || null,
      activeTab: "workspace",
      previewApp: null,
      selectedAppForOAuth: null,
      apps: [],
    };
  },
  mounted() {
    if (this.token) {
      setToken(this.token);
      this.loadApps();
    }
  },
  methods: {
    async register() {
      if (!this.username || !this.password) return alert("Username and password required");
      try {
        await API.post("/api/auth/register", {
          username: this.username,
          password: this.password,
        });
        alert("Registered successfully! Please login.");
      } catch (err) {
        alert("Register failed: " + (err.response?.data?.error || err.message));
      }
    },
    async login() {
      if (!this.username || !this.password) return alert("Username and password required");
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
        alert("Login failed: " + (err.response?.data?.error || err.message));
      }
    },
    logout() {
      this.token = null;
      localStorage.removeItem("eal_token");
      setToken(null);
      this.apps = [];
      this.activeTab = "workspace";
      this.username = "";
      this.password = "";
    },
    async loadApps() {
      try {
        const res = await API.get("/api/apps");
        this.apps = res.data;
      } catch (err) {
        // fallback: localStorage or empty list
        this.apps = JSON.parse(localStorage.getItem("eal_apps") || "[]");
      }
    },
    onAppAdded(app) {
      // Add app to list and switch to workspace
      this.apps.push(app);
      localStorage.setItem("eal_apps", JSON.stringify(this.apps));
      this.activeTab = "workspace";
    },
    onUsed() {
  if (!this.previewApp) return;
  const app = this.apps.find(a => a.id === this.previewApp.id);
  if (app) {
    app.useCount = (app.useCount || 0) + 1;
    localStorage.setItem("eal_apps", JSON.stringify(this.apps));
  }
},

    async editApp(app) {
      const newName = prompt("Edit Name:", app.name);
      const newUrl = prompt("Edit URL:", app.url);
      if (!newName || !newUrl) return;

      try {
        const res = await API.put(`/api/apps/${app.id}`, {
          ...app,
          name: newName,
          url: newUrl,
        });
        const idx = this.apps.findIndex(a => a.id === app.id);
        if (idx !== -1) this.apps.splice(idx, 1, res.data);
        localStorage.setItem("eal_apps", JSON.stringify(this.apps));
      } catch (err) {
        alert("Update failed: " + (err.response?.data?.error || err.message));
      }
    },
    async removeApp(app) {
      if (!confirm(`Are you sure you want to delete ${app.name}?`)) return;
      try {
        await API.delete(`/api/apps/${app.id}`);
        this.apps = this.apps.filter(a => a.id !== app.id);
        localStorage.setItem("eal_apps", JSON.stringify(this.apps));
      } catch (err) {
        alert("Delete failed: " + (err.response?.data?.error || err.message));
      }
    },
  },
};
</script>

<style scoped>
#app {
  max-width: 900px;
  margin: 2rem auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
  color: #333;
}

.auth-panel {
  display: grid;
  gap: 1rem;
  max-width: 400px;
  margin: 0 auto 2rem;
}

.auth-panel input {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.auth-panel button {
  background-color: #3b82f6;
  color: white;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.auth-panel button:hover {
  background-color: #2563eb;
}

.app-shell {
  display: flex;
  min-height: 600px;
  gap: 1rem;
}

.sidebar {
  flex-shrink: 0;
  width: 180px;
  background: #f3f4f6;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sidebar button {
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: #e5e7eb;
  font-weight: 600;
  transition: background 0.2s;
}

.sidebar button.active,
.sidebar button:hover {
  background: #2563eb;
  color: white;
}

.main-view {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}
</style>
