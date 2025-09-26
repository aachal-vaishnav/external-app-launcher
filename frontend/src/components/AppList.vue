<template>
  <div class="app-list">
    <div
      v-for="(apps, category) in groupedApps"
      :key="category"
      class="category-group"
    >
      <details open class="category-card">
        <summary class="category-title">{{ category }}</summary>
        <div class="apps-grid">
          <AppItem
            v-for="app in apps"
            :key="app.id"
            :app="app"
            @open-preview="$emit('open-preview', $event)"
            @edit="$emit('edit', $event)"
            @remove="$emit('remove', $event)"
          />
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import AppItem from "./AppItem.vue";

export function groupByCategory(apps) {
  return apps.reduce((acc, app) => {
    const cat = app.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(app);
    return acc;
  }, {});
}

export default {
  name: "AppList",
  components: { AppItem },
  props: {
    apps: { type: Array, required: true },
  },
  computed: {
    groupedApps() {
      return groupByCategory(this.apps);
    },
  },
};
</script>

<style scoped>
.app-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-group {
  border-radius: 12px;
  background: #f9fafb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.category-group:hover {
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
}

.category-card {
  border: none;
  padding: 0;
}

.category-title {
  font-size: 1.2rem;
  font-weight: 600;
  padding: 1rem;
  background: #e5e7eb;
  cursor: pointer;
  user-select: none;
  border-bottom: 1px solid #d1d5db;
  transition: background-color 0.2s ease;
}

.category-title:hover {
  background-color: #dbeafe;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  padding: 1rem;
}
</style>
