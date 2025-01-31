<template>
  <div class="login-container">
    <div class="background">
      <div class="background-overlay">
        <div class="login-card">
          <h2>Bun venit la FIESC ePanel</h2>
          <form @submit.prevent="handleLogin">
            <BaseInput label="Email" type="email" placeholder="prenume.nume@student.usv.ro" v-model="email" />
            <BaseInput label="Parola" type="password" placeholder="Introduceti parola" v-model="password" :show-toggle="true" />
            <button type="submit" class="login-button">Autentificare</button>
          </form>
        </div>
      </div>
    </div>

    <!-- Error Overlay -->
    <div v-if="errorMessage" class="error-overlay">
      <div class="error-content">
        <div class="error-header">
          <div @click="errorMessage = null" class="error-close-btn">
            ✖
          </div>
        </div>
        <span class="error-message">{{ errorMessage }}</span>
        <button @click="errorMessage = null" class="error-ok-btn">OK</button>
      </div>
    </div>
  </div>
</template>


<script>
import BaseInput from '@/components/BaseInput.vue';
import api from '@/services/api';

export default {
  name: 'LoginView',
  components: {
    BaseInput,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: null, // Add errorMessage to control the overlay visibility
    };
  },
  methods: {
    async handleLogin() {
      // Validate that both email and password are provided
      if (!this.email.trim()) {
        this.showError('Vă rugăm să introduceți un email.');
        return;
      }
      if (!this.password.trim()) {
        this.showError('Vă rugăm să introduceți o parolă.');
        return;
      }

      try {
        const response = await api.put('/auth', {
          email: this.email,
          password: this.password,
        });

        const { userId, roles, token } = response.data;
        
        // Store the JWT token
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user', JSON.stringify({ userId, roles }));

        if (roles.includes('Student')) {
          this.$router.push({ name: 'SimpleStudentView' });
        } else if (roles.includes('GroupLeader')) {
          this.$router.push({ name: 'GroupLeaderView' });
        } else if (roles.includes('Professor')) {
          this.$router.push({ name: 'ProfessorView' });
        } else {
          this.showError('Rolul nu a fost identificat.');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Autentificarea a eșuat. Vă rugam să încercați din nou.';
        this.showError(errorMessage);
      }
    },

    // Show error message by setting it to the state
    showError(message) {
      this.errorMessage = message;
    },
  },
};
</script>


<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.background {
  background: url('/src/assets/BackgroundLogin.jpg') center/cover no-repeat;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background-overlay {
  background-color: rgba(255, 255, 255, 0.8);
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  background-color: white;
  padding: 48px 72px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 540px;
  width: 100%;
  max-height: 412px;
  height: 100%;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: black;
  font-style: bold;
  font-weight: bold;
}

.login-button {
  width: 100%;
  margin-top: 18px;
  padding: 16px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

.error-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.error-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-header {
  position: relative;
  width: 100%;
  margin-top: 30px;
}

.error-close-btn {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.error-message {
  font-size: 16px;
  color: red;
  margin-bottom: 20px;
  flex-grow: 1;
}

.error-ok-btn {
  background-color: transparent;
  color: grey;
  border: 2px solid grey;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
}

.error-ok-btn:hover {
  background-color: #f0f0f0;
}
</style>