<template>
  <div class="oauth-connect">
    <button class="connect-btn" @click="start">
      🔗 Connect with {{ provider }}
    </button>
  </div>
</template>

<script>
import API from '../services/api';

export default {
  props: ['appId', 'provider'],
  methods: {
    async start() {
      try {
        const res = await API.get(`/api/oauth/${this.provider}/start`, {
          params: { appId: this.appId }
        });
        const url = res.data.url;
        const win = window.open(url, 'oauth', 'width=800,height=700');

        if (!win) {
          return alert('Popup blocked. Please allow popups for this site.');
        }

        const handler = async (ev) => {
          if (ev.data?.type === 'oauth-token' && ev.data.appId === this.appId) {
            const token = ev.data.token;

            try {
              await API.post(`/api/apps/${this.appId}/credentials`, { secret: token });
              alert('Connected successfully');
            } catch (apiErr) {
              console.error('Failed to save credentials:', apiErr);
              alert('Failed to save credentials');
            }

            window.removeEventListener('message', handler);
            win.close();
          }
        };

        window.addEventListener('message', handler);
      } catch (err) {
        console.error('OAuth start failed:', err);
        alert('Failed to start OAuth flow');
      }
    }
  }
};
</script>

<style scoped>
.oauth-connect {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.connect-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.7rem 1.4rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.connect-btn:hover {
  background-color: #2563eb;
  transform: scale(1.02);
}

.connect-btn:active {
  background-color: #1d4ed8;
  transform: scale(0.98);
}
</style>
