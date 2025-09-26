<template>
  <div
    class="app-item"
    tabindex="0"
    @keydown.enter="$emit('open-preview', app)"
  >
    <div class="details">
      <div class="title">
        {{ app.name }}
        <span v-if="app.favorite" class="star">⭐</span>
      </div>
      <div class="meta">
        {{ app.category || 'Other' }} • {{ app.useCount || 0 }} opens
      </div>
    </div>
    <div class="actions">
      <button class="btn preview" @click="$emit('open-preview', app)">Preview</button>
      <a class="btn open" :href="app.url" target="_blank" rel="noopener noreferrer">Open</a>
      <button class="btn edit" @click="$emit('edit', app)">Edit</button>
      <button class="btn remove" @click="$emit('remove', app)">Remove</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['app']
};
</script>

<style scoped>
.app-item {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s ease;
}

.app-item:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.app-item:focus {
  outline: 2px solid #3b82f6;
}

.details {
  flex: 1;
}

.title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.star {
  color: #facc15;
  font-size: 1.2rem;
}

.meta {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.2rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.preview {
  background-color: #3b82f6;
  color: white;
}

.preview:hover {
  background-color: #2563eb;
}

.open {
  background-color: #10b981;
  color: white;
}

.open:hover {
  background-color: #059669;
}

.edit {
  background-color: #fbbf24;
  color: #333;
}

.edit:hover {
  background-color: #f59e0b;
}

.remove {
  background-color: #ef4444;
  color: white;
}

.remove:hover {
  background-color: #dc2626;
}
</style>
