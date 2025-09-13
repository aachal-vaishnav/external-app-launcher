<template>
  <div class="app-list">
    <div
      v-for="(apps, category) in groupedApps"
      :key="category"
      class="category-group"
    >
      <details open>
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

// helper to group apps by category
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
@import "@/assets/css/nextcloud/base.css";
@import "@/assets/css/nextcloud/buttons.css";
@import "@/assets/css/nextcloud/forms.css";
@import "@/assets/css/nextcloud/cards.css";
@import "@/assets/css/nextcloud/modals.css";
@import "@/assets/css/nextcloud/workspace.css";
</style>
