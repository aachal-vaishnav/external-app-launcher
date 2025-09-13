<template>
  <div class="usage-dashboard">
    <h2>App Usage Analytics</h2>

    <section>
      <h3>Top 5 Most Used Apps</h3>
      <ul>
        <li v-for="app in topApps" :key="app.id">
          {{ app.name }} - {{ app.useCount || 0 }} opens
        </li>
      </ul>
    </section>

    <section class="mt-4">
      <h3>Last 5 Opened Apps</h3>
      <ul>
        <li v-for="app in recentApps" :key="app.id">
          {{ app.name }} - Last opened: {{ formatTime(app.lastOpened) }}
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import API from "../services/api";

export default {
  name: "UsageDashboard",
  data() {
    return {
      apps: [],
    };
  },
  computed: {
    topApps() {
      return [...this.apps]
        .sort((a, b) => (b.useCount || 0) - (a.useCount || 0))
        .slice(0, 5);
    },
    recentApps() {
      return [...this.apps]
        .sort((a, b) => (b.lastOpened || 0) - (a.lastOpened || 0))
        .slice(0, 5);
    },
  },
  methods: {
    async fetchApps() {
      try {
        const res = await API.get("/api/apps", this.authHeader());
        this.apps = res.data;
      } catch (err) {
        console.error("Failed to fetch apps:", err);
      }
    },
    authHeader() {
      const token = localStorage.getItem("eal_token");
      return { headers: { Authorization: `Bearer ${token}` } };
    },
    formatTime(timestamp) {
      if (!timestamp) return "Never";
      return new Date(timestamp).toLocaleString();
    },
  },
  mounted() {
    this.fetchApps();
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

