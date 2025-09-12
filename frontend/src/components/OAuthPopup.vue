<template>
  <div>
    <button @click="start">Connect</button>
  </div>
</template>

<script>
import API from '../services/api';

export default {
  props: ['appId', 'provider'],
  methods: {
    async start() {
      try {
        // Start OAuth flow
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
              // Save token securely via API
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
