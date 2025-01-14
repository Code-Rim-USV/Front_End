<template>
  <div class="login-container">
    <div class="background">
      <div class="background-overlay">
        <div class="login-card">
          <h2>Bun venit la FIESC ePanel</h2>
          <form @submit.prevent="handleLogin">
            <BaseInput 
              label="Email" 
              type="email" 
              placeholder="prenume.nume@student.usv.ro" 
              v-model="email" 
              :error="emailError"
            />
            <BaseInput 
              label="Parola" 
              type="password" 
              placeholder="Introduceți parola" 
              v-model="password" 
              :show-toggle="true"
              :error="passwordError"
            />
            <button type="submit" class="login-button" :disabled="isLoading">
              {{ isLoading ? 'Se încarcă...' : 'Autentificare' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Error Overlay -->
    <div v-if="errorMessage" class="error-overlay">
      <div class="error-content">
        <div class="error-header">
          <div @click="clearError" class="error-close-btn">✖</div>
        </div>
        <span class="error-message">{{ errorMessage }}</span>
        <button @click="clearError" class="error-ok-btn">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/BaseInput.vue';
import api from '@/services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref(null);
const isLoading = ref(false);
const emailError = ref('');
const passwordError = ref('');

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function clearError() {
  errorMessage.value = null;
  emailError.value = '';
  passwordError.value = '';
}

function showError(message) {
  errorMessage.value = message;
}

async function handleLogin() {
  clearError();
  
  // Validate inputs
  if (!email.value.trim()) {
    emailError.value = 'Vă rugăm să introduceți un email.';
    return;
  }
  if (!validateEmail(email.value)) {
    emailError.value = 'Vă rugăm să introduceți un email valid.';
    return;
  }
  if (!password.value.trim()) {
    passwordError.value = 'Vă rugăm să introduceți o parolă.';
    return;
  }

  isLoading.value = true;

  try {
    const response = await api.put('/auth', {
      email: email.value,
      password: password.value,
    });

    const { userId, roles, token } = response.data;
    
    // Store user data
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user', JSON.stringify({ userId, roles }));

    // Redirect to dashboard
    router.push({ name: 'DashboardView' });
  } catch (error) {
    let errorMsg = 'Autentificarea a eșuat. Vă rugăm să încercați din nou.';
    
    if (error.response?.status === 401) {
      errorMsg = 'Email sau parolă incorectă.';
    } else if (error.response?.data?.message) {
      errorMsg = error.response.data.message;
    }
    
    showError(errorMsg);
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.background {
  background: url('@/assets/BackgroundLogin.jpg') center/cover no-repeat;
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
  margin-bottom: 1.5rem;
  color: black;
  font-weight: bold;
}

.login-button {
  width: 100%;
  margin-top: 24px;
  padding: 16px;
  font-size: 1rem;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
  background-color: #dc3545;
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
  transition: background-color 0.3s ease;
}

.error-close-btn:hover {
  background-color: #c82333;
}

.error-message {
  font-size: 16px;
  color: #dc3545;
  margin-bottom: 20px;
  flex-grow: 1;
}

.error-ok-btn {
  background-color: transparent;
  color: #6c757d;
  border: 2px solid #6c757d;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
}

.error-ok-btn:hover {
  background-color: #6c757d;
  color: white;
}
</style>