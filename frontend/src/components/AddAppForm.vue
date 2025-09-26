<template>
  <div class="add-app-form">
    <h2>Add New App</h2>
    <div class="form-group">
      <label>App Name</label>
      <input v-model="name" placeholder="Enter app name" />
    </div>
    <div class="form-group">
      <label>App URL</label>
      <input v-model="url" placeholder="https://example.com" />
    </div>
    <div class="form-group">
      <label>Category</label>
      <select v-model="category">
        <option>Work</option>
        <option>Tools</option>
        <option>Fun</option>
        <option>Other</option>
      </select>
    </div>
    <button class="add-btn" @click="add">➕ Add App</button>
  </div>
</template>

<script>
import API from '../services/api.js';

export default {
  data() {
    return {
      name: '',
      url: '',
      category: 'Work'
    };
  },
  methods: {
    isValidUrl(u) {
      try {
        const p = new URL(u);
        return p.protocol === 'https:';
      } catch {
        return false;
      }
    },
    async add() {
      if (!this.name || !this.url) return alert('Name & URL are required');
      if (!this.isValidUrl(this.url)) return alert('Use a valid HTTPS URL');

      const appData = {
        name: this.name,
        url: this.url,
        category: this.category
      };

      try {
        const res = await API.post('/api/apps', appData);
        this.$emit('add-app', res.data);

        this.name = '';
        this.url = '';
        this.category = 'Work';
      } catch (err) {
        console.error(err);
        alert('Failed to add app. Check console.');
      }
    }
  }
};
</script>

<style scoped>
.add-app-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  max-width: 500px;
  margin: 2rem auto;
  transition: all 0.3s ease;
}

.add-app-form h2 {
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #555;
}

input,
select {
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus,
select:focus {
  border-color: #3b82f6;
  outline: none;
}

.add-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 1rem;
}

.add-btn:hover {
  background-color: #2563eb;
}
</style>
