<template>
  <div class="login-container">
    <div class="background">
      <div class="background-overlay">
        <div class="login-card">
          <h2>Bun venit la FIESC ePanel</h2>
          <form @submit.prevent="handleLogin">
            <BaseInput label="Email" type="email" placeholder="prenume.nume@student.usv.ro" v-model="email" />
            <BaseInput label="Parola" type="password" placeholder="Enter your password" v-model="password" :show-toggle="true" />
            <button type="submit" class="login-button">Autentificare</button>
          </form>
        </div>
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
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await api.put('/auth', {
          email: this.email,
          password: this.password,
        });

        const { userId, roles } = response.data;

        localStorage.setItem('user', JSON.stringify({ userId, roles }));

        if (roles.includes('Student')) {
          this.$router.push({ name: 'SimpleStudentView' });
        } else if (roles.includes('GroupLeader')) {
          this.$router.push({ name: 'GroupLeaderView' });
        } else if (roles.includes('Professor')) {
          this.$router.push({ name: 'ProfessorView' });
        } else {
          alert('Rolul nu a fost identificat.');
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Autentificarea a eșuat. Vă rugam să încercați din nou.');
      }
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
</style>