<template>
  <div class="add-app-form">
    <input v-model="name" placeholder="App Name" />
    <input v-model="url" placeholder="App URL" />
    <select v-model="category">
      <option>Work</option>
      <option>Tools</option>
      <option>Fun</option>
      <option>Other</option>
    </select>
    <button @click="add">Add</button>
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

        // reset inputs
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
@import "@/assets/css/nextcloud/base.css";
@import "@/assets/css/nextcloud/buttons.css";
@import "@/assets/css/nextcloud/forms.css";
@import "@/assets/css/nextcloud/cards.css";
@import "@/assets/css/nextcloud/modals.css";
@import "@/assets/css/nextcloud/workspace.css";
</style>
