<!--NEW -->
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
          <AppItem v-for="app in apps" :key="app.url" :app="app" />
        </div>
      </details>
    </div>
  </div>
</template>

<script>
import AppItem from "./AppItem.vue";
import { groupByCategory } from "../data/groupedApps";

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
.category-group {
  margin-bottom: 16px;
}
.category-title {
  font-weight: bold;
  cursor: pointer;
}
.apps-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}
</style>
