<template>
  <div class="layout">
    <ProfessorSidebar @changeComponent="setActiveComponent" />
    <div class="professor-view">
      <!-- Calendar component -->
      <Calendar :exam-dates="exams" v-if="activeComponent != 'settings'"/>
      <ProfessorExamGrid :exams="exams" v-if="activeComponent === 'calendar'" @edit="openEditDialog" />
      <ExamRequestsGrid :requests="requests" v-if="activeComponent === 'applications'" @accept="openAcceptDialog"
        @reject="openRejectDialog" />
        
      <ExamEditDialog v-if="showEditDialog" :examID="selectedExam.examID" :examData="selectedExam"
        :assistant-options="assistants" :room-options="rooms" @close="closeDialogs" />

      <AcceptedRequestDialogue v-if="showAcceptDialog" :requestID="selectedRequestID" @close="closeDialogs"
        :assistant-options="assistants" :room-options="rooms" />
      <RejectedRequestDialogue v-if="showRejectDialog" :requestID="selectedRequestID" @close="closeDialogs" />

      <!-- Component Settings Page -->
      <ComponentSettings v-if="activeComponent === 'settings'" />

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
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Calendar from '@/components/Calendar.vue';
import ProfessorExamGrid from '@/components/ProfessorExamsGrid.vue';
import ProfessorSidebar from '@/components/ProfessorSidebar.vue';
import ExamRequestsGrid from '@/components/ExamRequestsGrid.vue';
import ExamEditDialog from '@/components/ExamEditDialog.vue';
import AcceptedRequestDialogue from '@/components/AcceptedRequestDialogue.vue';
import RejectedRequestDialogue from '@/components/RejectedRequestDialogue.vue';
import ComponentSettings from '@/components/ComponentSettings.vue';  // Importing the ComponentSettings component
import api from '@/services/api';

const activeComponent = ref('calendar');
const exams = ref([]);
const requests = ref([]);
const assistants = ref([]);
const rooms = ref([]);
const userId = ref(null);
const showAcceptDialog = ref(false);
const showRejectDialog = ref(false);
const selectedRequestID = ref(null);
const selectedExam = ref({});
const showEditDialog = ref(false);

const errorMessage = ref(null);

let pollingInterval = null;

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userId.value = user.userId;
    fetchExams();
    fetchRequests();
    fetchAssistants();
    fetchRooms();

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
    } else if (activeComponent.value === 'applications') {
      fetchRequests();
      fetchExams();
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

function openEditDialog(exam) {
  selectedExam.value = exam;
  showEditDialog.value = true;
}

function openAcceptDialog(requestID) {
  selectedRequestID.value = requestID;
  showAcceptDialog.value = true;
}

function openRejectDialog(requestID) {
  selectedRequestID.value = requestID;
  showRejectDialog.value = true;
}

function closeDialogs() {
  showAcceptDialog.value = false;
  showRejectDialog.value = false;
  showEditDialog.value = false;
  selectedRequestID.value = null;
}

async function fetchExams() {
  try {
    const response = await api.get(`/exams/GetByUserID${userId.value}`);
    exams.value = response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(errorMessage);
  }
}

async function fetchRequests() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Pending`);
    requests.value = response.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(errorMessage);
  }
}

async function fetchAssistants() {
  try {
    const response = await api.get('/Users/GetByRole/Assistant');
    assistants.value = response.data.map(assistant => ({
      value: assistant.userID,
      text: `${assistant.userName}`,
    }));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(errorMessage);
  }
}

async function fetchRooms() {
  try {
    const response = await api.get('/Locations/Get');
    rooms.value = response.data.map(room => ({
      value: room.locationID,
      text: room.locationName,
    }));
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showError(errorMessage);
  }
}

function getErrorMessage(error) {
  if (error.response) {
    return error.response.data.message || error.response.statusText;
  } else if (error.request) {
    return 'Eroare de rețea: Nu am putut să te conectăm la server.';
  } else {
    return `Eroare necunoscută: ${error.message}`;
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
  align-items: center;
  justify-content: center;
  background-color: #EAEAEA;
  overflow: hidden;
}

.professor-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  margin-left: 1rem;
  overflow-y: auto;
  height: 100%;
}

.professor-view > *:not(.dialogue-overlay):not(.error-overlay) { 
  flex: 1 1 auto;
  width: 100%;
  max-height: 100vh;
  min-height: 150px;
  margin-top: 1.5rem;
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
