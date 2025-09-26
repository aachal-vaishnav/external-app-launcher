<template>
  <div class="usage-dashboard">
    <h2>📊 App Usage Analytics</h2>

    <section class="usage-section">
      <h3>🔥 Top 5 Most Used Apps</h3>
      <ul class="usage-list">
        <li v-for="app in topApps" :key="app.id">
          <span class="app-name">{{ app.name }}</span>
          <span class="app-meta">{{ app.useCount || 0 }} opens</span>
        </li>
      </ul>
    </section>

    <section class="usage-section">
      <h3>🕒 Last 5 Opened Apps</h3>
      <ul class="usage-list">
        <li v-for="app in recentApps" :key="app.id">
          <span class="app-name">{{ app.name }}</span>
          <span class="app-meta">Last opened: {{ formatTime(app.lastOpened) }}</span>
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
.usage-dashboard {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 700px;
  margin: 2rem auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.usage-dashboard h2 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
  text-align: center;
}

.usage-section {
  margin-bottom: 2rem;
}

.usage-section h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #444;
}

.usage-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.usage-list li {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-name {
  font-weight: 500;
  color: #333;
}

.app-meta {
  font-size: 0.9rem;
  color: #666;
}
</style>
