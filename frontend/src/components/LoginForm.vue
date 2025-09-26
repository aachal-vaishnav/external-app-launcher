<template>
  <div class="login-form">
    <h3>{{ isRegister ? "Create Account" : "Welcome Back" }}</h3>

    <div class="form-group">
      <label>Username</label>
      <input v-model="username" placeholder="Enter your username" />
    </div>

    <div class="form-group">
      <label>Password</label>
      <input type="password" v-model="password" placeholder="Enter your password" />
    </div>

    <button class="login-btn" @click="handleSubmit">
      {{ isRegister ? "📝 Register" : "🔐 Login" }}
    </button>

    <p class="toggle-text">
      {{ isRegister ? "Already have an account?" : "Don't have an account?" }}
      <span class="toggle-link" @click="isRegister = !isRegister">
        {{ isRegister ? "Login" : "Register" }}
      </span>
    </p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      isRegister: false, // toggle between login/register
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.username || !this.password) {
        return alert("Username and password are required");
      }

      try {
        if (this.isRegister) {
          // Register flow
          await axios.post("http://localhost:5000/api/auth/register", {
            username: this.username,
            password: this.password,
          });
          alert("✅ Registered successfully! Please login now.");
          this.isRegister = false;
        } else {
          // Login flow
          const loginRes = await axios.post(
            "http://localhost:5000/api/auth/login",
            {
              username: this.username,
              password: this.password,
            }
          );
          this.$emit("login", loginRes.data.token);
        }
      } catch (err) {
        alert(
          "❌ Failed: " + (err.response?.data?.error || err.message)
        );
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.login-form {
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  max-width: 400px;
  margin: 3rem auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.login-form h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: #555;
}

input {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

input:focus {
  border-color: #3b82f6;
  outline: none;
}

.login-btn {
  background-color: #3b82f6;
  color: white;
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  margin-top: 1rem;
}

.login-btn:hover {
  background-color: #2563eb;
}

.toggle-text {
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #555;
}

.toggle-link {
  color: #3b82f6;
  cursor: pointer;
  font-weight: 600;
  margin-left: 4px;
}

.toggle-link:hover {
  text-decoration: underline;
}
</style>
