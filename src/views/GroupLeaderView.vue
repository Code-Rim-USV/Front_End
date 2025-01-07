<template>
  <div class="layout">
    <GroupLeaderSidebar @changeComponent="setActiveComponent" />
    <div class="student-view">
      <!-- Calendar component -->
      <Calendar :exam-dates="exams" v-if="activeComponent === 'calendar'" />
      <ExamsGrid :exams="exams" v-if="activeComponent === 'calendar'" />

      <!-- Exam Scheduling components -->
      <ExamRequestsForm 
        v-if="activeComponent === 'examScheduling'" 
        :materials="materials" 
        @refresh-grid="fetchExamRequests"
      />
      <GroupLeaderExamRequestsGrid :exams="examRequestsPending" v-if="activeComponent === 'examScheduling'" />

      <!-- Rejected Exam grid -->
      <RejectedExamsGrid :rejectedExams="examRequestsRejected" v-if="activeComponent === 'rejectSchedules'" />

      <ComponentSettings v-if="activeComponent === 'settings'" />

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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Calendar from '@/components/Calendar.vue';
import ExamsGrid from '@/components/ExamsGrid.vue';
import GroupLeaderExamRequestsGrid from '@/components/GroupLeaderExamRequestsGrid.vue';
import RejectedExamsGrid from '@/components/RejectedExamsGrid.vue';
import GroupLeaderSidebar from '@/components/GroupLeaderSidebar.vue';
import ComponentSettings from '@/components/ComponentSettings.vue';
import ExamRequestsForm from '@/components/ExamRequestsForm.vue';
import api from '@/services/api';

const activeComponent = ref('calendar');
const exams = ref([]);
const examRequestsPending = ref([]);
const examRequestsRejected = ref([]);
const userId = ref(null);
const materials = ref([]);
const errorMessage = ref(null);

let pollingInterval = null;

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userId.value = user.userId;
    fetchExams();
    fetchMaterials();
    fetchExamRequests();
    fetchExamRequestsRejected();

    startPolling();
  } else {
    router.push({ name: 'LoginView' });
  }
});

onUnmounted(() => {
  stopPolling();
});

function setActiveComponent(componentName) {
  activeComponent.value = componentName;
}

function showError(message) {
  errorMessage.value = message;
}

function startPolling() {
  stopPolling(); 
  pollingInterval = setInterval(() => {
    if (activeComponent.value === 'calendar') {
      fetchExams();
    } else if (activeComponent.value === 'examScheduling') {
      fetchExamRequests();
    }else if(activeComponent.value ==='rejectSchedules'){
      fetchExamRequestsRejected();
    }
  }, 180000 ); 
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

watch(activeComponent, () => {
  startPolling(); 
});

async function fetchExams() {
  try {
    const response = await api.get(`/exams/GetByUserID${userId.value}`);
    exams.value = response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(`Eroare la preluarea examenelor: ${errorMessage}`);
  }
}

async function fetchExamRequests() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Pending`);
    examRequestsPending.value = response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(`Eroare la preluarea cererilor de examen: ${errorMessage}`);
  }
}

async function fetchExamRequestsRejected() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Rejected`);
    examRequestsRejected.value = response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(`Eroare la preluarea cererilor respinse: ${errorMessage}`);
  }
}

async function fetchMaterials() {
  try {
    const response = await api.get('/Subjects/Get');
    materials.value = response.data.map(subject => ({
      text: subject.subjectName,
      value: subject.subjectID,
    }));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(`Eroare la preluarea materiilor: ${errorMessage}`);
  }
}

function getErrorMessage(error) {
  if (error.response && error.response.data) {
    // Handle structured error response
    if (error.response.data.message) {
      return error.response.data.message;
    }
    // Handle validation errors array
    if (Array.isArray(error.response.data.errors)) {
      return error.response.data.errors.join(', ');
    }
    // Handle simple error message
    if (typeof error.response.data === 'string') {
      return error.response.data;
    }
    return `Eroare de server (${error.response.status})`;
  } else if (error.request) {
    return 'Nu s-a putut stabili conexiunea cu serverul. Verificați conexiunea la internet.';
  } else {
    return error.message || 'A apărut o eroare neașteptată.';
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

.student-view > * + * {
  margin-top: 1.5rem;
}

.student-view > * {
  flex: 1 1 auto;
  width: 100%;
  max-height: 100vh;
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