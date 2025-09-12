<template>
  <div class="app-item" tabindex="0" @keydown.enter="$emit('open-preview', app)">
    <img :src="app.icon || defaultIcon" width="40" height="40" alt="App Icon" />
    <div>
      <div class="title">
        {{ app.name }}
        <span v-if="app.favorite">⭐</span>
      </div>
      <div class="meta">{{ app.category || 'Other' }} • {{ app.useCount || 0 }} opens</div>
    </div>
    <div class="actions">
      <button @click="$emit('open-preview', app)">Preview</button>
      <a :href="app.url" target="_blank" rel="noopener noreferrer">Open</a>
      <button @click="$emit('edit', app)">Edit</button>
      <button @click="$emit('remove', app)">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['app'],
  computed: {
    defaultIcon() {
      // fallback icon if app.icon is missing
      return '/src/assets/icons/default.png';
    }
  }
};
</script>

<style scoped>
.app-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 6px;
  background: #fff;
}
.actions {
  margin-left: auto;
  display: flex;
  gap: 6px;
}
.title {
  font-weight: bold;
}
.meta {
  font-size: 12px;
  color: #555;
}
</style>
