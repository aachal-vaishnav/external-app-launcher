<template>
  <div class="app-item" tabindex="0" @keydown.enter="$emit('open-preview', app)">
    <div class="details">
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
  props: ['app']
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
