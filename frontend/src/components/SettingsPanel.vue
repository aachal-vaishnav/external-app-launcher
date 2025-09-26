<template>
  <div class="settings-panel">
    <h2>Manage External Apps</h2>

    <form @submit.prevent="addApp" class="form">
      <div class="form-group">
        <label>App Name</label>
        <input v-model="newApp.name" placeholder="App Name" required />
      </div>
      <div class="form-group">
        <label>App URL</label>
        <input v-model="newApp.url" placeholder="App URL" required />
      </div>
      <div class="form-group">
        <label>Category</label>
        <input v-model="newApp.category" placeholder="Category" />
      </div>
      <button type="submit" class="btn">➕ Add App</button>
    </form>

    <ul class="app-list">
      <li v-for="app in apps" :key="app.id" class="app-item">
        <span class="app-info">{{ app.name }} ({{ app.category || 'Other' }})</span>
        <div class="actions">
          <button @click="editApp(app)" class="btn-sm">Edit</button>
          <button @click="deleteApp(app.id)" class="btn-sm danger">Delete</button>
          <button @click="connectOAuth(app)" class="btn-sm">Connect</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import API from '../services/api'; // Make sure path is correct

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
        const res = await API.get('/api/apps', this.authHeader());
        console.log('Fetched apps:', res.data);
        this.apps = res.data || [];
      } catch (err) {
        console.error('Failed to fetch apps:', err);
        this.apps = [];
      }
    },
    async addApp() {
      try {
        const res = await API.post('/api/apps', this.newApp, this.authHeader());
        console.log('Added app response:', res.data);
        if (!res.data.id) {
          alert('Warning: Added app has no ID from server!');
        }
        this.apps.push(res.data);
        this.newApp = { name: '', url: '', category: '' };
      } catch (err) {
        alert('Failed to add app');
        console.error(err);
      }
    },
    async deleteApp(id) {
      if (!id) {
        alert('Invalid app id for deletion.');
        return;
      }
      try {
        await API.delete(`/api/apps/${id}`, this.authHeader());
        this.apps = this.apps.filter(a => a.id !== id);
      } catch (err) {
        alert('Failed to delete app');
        console.error(err);
      }
    },
    async editApp(app) {
      console.log('Edit app called:', app);
      if (!app || !app.id) {
        alert('Invalid app or missing app ID.');
        return;
      }

      const newName = prompt('Edit App Name:', app.name);
      const newUrl = prompt('Edit App URL:', app.url);
      const newCategory = prompt('Edit Category:', app.category);

      if (!newName || !newUrl) {
        alert('Name and URL are required');
        return;
      }

      try {
        const payload = { name: newName, url: newUrl, category: newCategory };
        const res = await API.put(`/api/apps/${app.id}`, payload, this.authHeader());
        console.log('Edited app response:', res.data);
        const idx = this.apps.findIndex(a => a.id === app.id);
        if (idx !== -1) this.apps.splice(idx, 1, res.data);
      } catch (err) {
        alert('Failed to edit app');
        console.error(err);
      }
    },
    connectOAuth(app) {
      this.$emit('start-oauth', app);
    }
  }
};
</script>

<style scoped>
.settings-panel {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 700px;
  margin: 2rem auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.settings-panel h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.form {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #555;
}

input {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #3b82f6;
  outline: none;
}

.btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #2563eb;
}

.app-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-info {
  font-weight: 500;
  color: #333;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  background-color: #e5e7eb;
  color: #333;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-sm:hover {
  background-color: #d1d5db;
}

.btn-sm.danger {
  background-color: #ef4444;
  color: white;
}

.btn-sm.danger:hover {
  background-color: #dc2626;
}
</style>
