<!-- ==============================================
  new
  App Usage Dashboard
  
============================================== -->
<template>
  <div class="usage-dashboard">
    <h2>App Usage Analytics</h2>

    <h3>Top 5 Most Used Apps</h3>
    <ul>
      <li v-for="app in topApps" :key="app.id">
        {{ app.name }} - {{ app.useCount || 0 }} opens
      </li>
    </ul>

    <h3>Last 5 Opened Apps</h3>
    <ul>
      <li v-for="app in recentApps" :key="app.id">
        {{ app.name }} - Last opened: {{ formatTime(app.lastOpened) }}
      </li>
    </ul>
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
    formatTime(ts) {
      if (!ts) return "Never";
      return new Date(ts).toLocaleString();
    },
  },
  mounted() {
    this.fetchApps();
  },
};
</script>

<style scoped>
.usage-dashboard {
  background: var(--bg-color);
  color: var(--text-color);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: left;
}
.usage-dashboard ul {
  padding-left: 1.2rem;
}
</style>
