<template>
  <div class="settings-panel p-4">
    <h2 class="text-xl font-bold mb-4">Manage External Apps</h2>

    <form @submit.prevent="addApp">
      <input v-model="newApp.name" placeholder="App Name" class="input" required />
      <input v-model="newApp.url" placeholder="App URL" class="input" required />
      <input v-model="newApp.icon" placeholder="Icon URL" class="input" />
      <input v-model="newApp.category" placeholder="Category" class="input" />
      <button type="submit" class="btn">Add App</button>
    </form>

    <ul class="mt-6 space-y-2">
      <li v-for="app in apps" :key="app.id" class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <img :src="getIcon(app)" class="w-6 h-6" />
          <span>{{ app.name }}</span>
        </div>
        <div class="space-x-2">
          <button @click="editApp(app)" class="btn-sm">Edit</button>
          <button @click="deleteApp(app.id)" class="btn-sm danger">Delete</button>
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
      newApp: { name: '', url: '', icon: '', category: '' },
    };
  },
  created() {
    this.fetchApps();
  },
  methods: {
    async fetchApps() {
      try {
        const res = await axios.get('/api/apps', this.authHeader());
        this.apps = res.data;
      } catch (err) {
        console.error('Failed to fetch apps:', err);
        this.apps = []; // fallback to empty
      }
    },
    getIcon(app) {
      if (app.icon) return app.icon;
      const nameLower = app.name.toLowerCase();
      if (nameLower.includes('google meet')) return '/src/assets/icons/google-meet.jpeg';
      if (nameLower.includes('zoom')) return '/src/assets/icons/zoom.png';
      if (nameLower.includes('trello')) return '/src/assets/icons/trello.png';
      if (nameLower.includes('github')) return '/src/assets/icons/github.png';
      return '/src/assets/icons/default.png';
    },
    async addApp() {
      try {
        // ensure icon fallback
        if (!this.newApp.icon) this.newApp.icon = this.getIcon(this.newApp);
        const res = await axios.post('/api/apps', this.newApp, this.authHeader());
        this.apps.push(res.data);
        this.newApp = { name: '', url: '', icon: '', category: '' };
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
    editApp(app) {
      alert('Edit feature not implemented yet: ' + app.name);
    },
    authHeader() {
      const token = localStorage.getItem('eal_token'); // use same token as App.vue
      return { headers: { Authorization: `Bearer ${token}` } };
    },
  },
};
</script>

<style scoped>
.input {
  border: 1px solid #ccc;
  padding: 6px;
  border-radius: 4px;
  width: 100%;
  margin-bottom: 8px;
}
.btn {
  background-color: #3b82f6;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
}
.btn-sm {
  background-color: #e5e7eb;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.875rem;
}
.danger {
  background-color: #ef4444;
  color: white;
}
</style>
