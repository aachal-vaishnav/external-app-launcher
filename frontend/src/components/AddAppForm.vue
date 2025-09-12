<template>
  <div class="add-app-form">
    <input v-model="name" placeholder="App Name" />
    <input v-model="url" placeholder="App URL" />
    <input v-model="icon" placeholder="Icon URL (optional)" />
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
export default {
  data() {
    return {
      name: '',
      url: '',
      icon: '',
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
    getDefaultIcon(name) {
      const n = (name || '').toLowerCase();
      if (n.includes('google meet')) return '/src/assets/icons/google-meet.jpeg';
      if (n.includes('zoom')) return '/src/assets/icons/zoom.png';
      if (n.includes('trello')) return '/src/assets/icons/trello.png';
      if (n.includes('github')) return '/src/assets/icons/github.png';
      return '/src/assets/icons/default.png';
    },
    add() {
      if (!this.name || !this.url) return alert('Name & URL are required');
      if (!this.isValidUrl(this.url)) return alert('Use a valid HTTPS URL');

      const appData = {
        name: this.name,
        url: this.url,
        icon: this.icon?.trim() || this.getDefaultIcon(this.name),
        category: this.category
      };

      this.$emit('add-app', appData);

      // reset inputs
      this.name = '';
      this.url = '';
      this.icon = '';
    }
  }
};
</script>

<style scoped>
.add-app-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.add-app-form input,
.add-app-form select,
.add-app-form button {
  padding: 6px 8px;
  font-size: 14px;
}
</style>
