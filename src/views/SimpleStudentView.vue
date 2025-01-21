<template>
  <div class="layout">
    <!-- Sidebar -->
    <StudentSidebar @changeComponent="setActiveComponent" />

    <!-- Main content area -->
    <div class="student-view">
      <Calendar :exam-dates="exams" v-if="activeComponent === 'calendar'" />
      <ExamsGrid :exams="exams" v-if="activeComponent === 'calendar'" />
      <ComponentSettings v-if="activeComponent === 'settings'" :username="user.username" :role="user.role"
        :email="user.email" :userId="userId" />
      <!-- Error overlay -->
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import Calendar from '@/components/Calendar.vue';
import ExamsGrid from '@/components/ExamsGrid.vue';
import ComponentSettings from '@/components/ComponentSettings.vue'
import StudentSidebar from '@/components/StudentSidebar.vue';
import { useRouter } from 'vue-router';

const activeComponent = ref('calendar');
const exams = ref([]);
const userId = ref(null);
const router = useRouter();
const errorMessage = ref(null);
const user = ref({
  username: '',
  role: '',
  email: '',
});

async function fetchUserData() {
  try {
    const response = await api.get(`/Users/Get/${userId.value}`);
    const response2 = await api.get(`/HasRoles/Get/${userId.value}`);
    user.value = {
      username: response.data.userName,
      role: response2.data.role,
      email: response.data.email,
    };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError('Eroare la preluarea datelor utilizatorului: ' + errorMessage);
  }
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userId.value = user.userId;
    fetchExams();
    fetchUserData();
  } else {
    router.push({ name: 'LoginView' });
  }
});

function setActiveComponent(componentName) {
  activeComponent.value = componentName;
}

function showError(message) {
  errorMessage.value = message;
}

async function fetchExams() {
  try {
    const response = await api.get(`/exams/GetByUserID${userId.value}`);
    exams.value = response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError('Eroare la preluarea examenelor: ' + errorMessage);
  }
}

function getErrorMessage(error) {
  if (error.response) {
    return error.response.data.message || error.response.statusText;
  } else if (error.request) {
    return 'Eroare de rețea: Nu am putut să te conectăm la server.';
  } else {
    return ` ${error.message}`;
  }
}
</script>
<style scoped>
.layout {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  background-color: #EAEAEA;
  overflow: hidden;
}

.student-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  margin-left: 1rem;
  overflow-y: auto;
  height: 100%;
}


.student-view>* {
  flex: 1 1 auto;
  width: 100%;
  max-height: calc(100vh - 100px);
  min-height: 150px;
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
