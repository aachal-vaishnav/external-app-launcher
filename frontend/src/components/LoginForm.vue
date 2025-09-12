<template>
  <div class="login-form">
    <h3>Login</h3>
    <input v-model="username" placeholder="Username" />
    <input type="password" v-model="password" placeholder="Password" />
    <button @click="login">Login</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        return alert('Username and password are required');
      }

      try {
        // Optional auto-register if user doesn't exist
        try {
          await axios.post('http://localhost:5000/api/auth/register', {
            username: this.username,
            password: this.password
          });
        } catch (registerErr) {
          if (registerErr.response?.data?.error !== 'exists') {
            throw registerErr;
          }
          // user already exists, ignore
        }

        // Login
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
          username: this.username,
          password: this.password
        });

        // Emit token to parent component
        this.$emit('login', loginRes.data.token);
      } catch (err) {
        alert('Login failed: ' + (err.response?.data?.error || err.message));
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 300px;
}
.login-form input {
  padding: 6px;
}
.login-form button {
  padding: 6px 12px;
}
</style>
