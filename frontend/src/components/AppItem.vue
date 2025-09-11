<template>
  <div class="app-item" tabindex="0" @keydown.enter="$emit('open-preview',app)">
    <img :src="app.icon" width="40" height="40" />
    <div>
      <div class="title">{{ app.name }} <span v-if="app.favorite">⭐</span></div>
      <div class="meta">{{ app.category }} • {{ app.useCount || 0 }} opens</div>
    </div>
    <div class="actions">
      <button @click="$emit('open-preview', app)">Preview</button>
      <a :href="app.url" target="_blank" rel="noopener noreferrer">Open</a>
      <button @click="$emit('edit', app)">Edit</button>
      <button @click="$emit('remove')">Remove</button>
    </div>
  </div>
</template>
<script>
export default { props:['app'] }
</script>
<style scoped>
.app-item{ display:flex; align-items:center; gap:10px; padding:8px; border-radius:6px; background:#fff; }
.actions{ margin-left:auto; display:flex; gap:6px; }
</style>
