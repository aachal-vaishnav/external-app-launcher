<template>
  <div class="settings-panel p-4">
    <h2 class="text-xl font-bold mb-4">Manage External Apps</h2>

    <form @submit.prevent="addApp">
      <input v-model="newApp.name" placeholder="App Name" class="input" required />
      <input v-model="newApp.url" placeholder="App URL" class="input" required />
      <input v-model="newApp.category" placeholder="Category" class="input" />
      <button type="submit" class="btn">Add App</button>
    </form>

    <ul class="mt-6 space-y-2">
      <li v-for="app in apps" :key="app.id" class="flex items-center justify-between">
        <span>{{ app.name }} ({{ app.category || 'Other' }})</span>
        <div class="space-x-2">
          <button @click="editApp(app)" class="btn-sm">Edit</button>
          <button @click="deleteApp(app.id)" class="btn-sm danger">Delete</button>
          <button @click="connectOAuth(app)" class="btn-sm">Connect</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SettingsPanel',
  data() {
    return {
      apps: [],
      newApp: { name: '', url: '', category: '' },
    };
  },
  created() {
    this.fetchApps();
  },
  methods: {
    authHeader() {
      const token = localStorage.getItem('eal_token');
      return { headers: { Authorization: `Bearer ${token}` } };
    },
    async fetchApps() {
      try {
        const res = await axios.get('/api/apps', this.authHeader());
        this.apps = res.data;
      } catch (err) {
        console.error('Failed to fetch apps:', err);
        this.apps = [];
      }
    },
    async addApp() {
      try {
        const res = await axios.post('/api/apps', this.newApp, this.authHeader());
        this.apps.push(res.data);
        this.newApp = { name: '', url: '', category: '' };
      } catch (err) {
        alert('Failed to add app');
        console.error(err);
      }
    },
    async deleteApp(id) {
      try {
        await axios.delete(`/api/apps/${id}`, this.authHeader());
        this.apps = this.apps.filter(a => a.id !== id);
      } catch (err) {
        alert('Failed to delete app');
        console.error(err);
      }
    },
    async editApp(app) {
      const newName = prompt('Edit App Name:', app.name);
      const newUrl = prompt('Edit App URL:', app.url);
      const newCategory = prompt('Edit Category:', app.category);

      if (!newName || !newUrl) return;

      try {
        const payload = { name: newName, url: newUrl, category: newCategory };
        const res = await axios.put(`/api/apps/${app.id}`, payload, this.authHeader());
        const idx = this.apps.findIndex(a => a.id === app.id);
        if (idx !== -1) this.apps[idx] = res.data;
      } catch (err) {
        alert('Failed to edit app');
        console.error(err);
      }
    },
    connectOAuth(app) {
      // emit to parent or handle OAuth flow via existing OAuth component
      this.$emit('start-oauth', app);
    }
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
