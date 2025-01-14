<template>
  <div class="layout">
    <Sidebar :userRole="user.role" @changeComponent="setActiveComponent" />
    <div class="dashboard-view">
      <!-- Common Components -->
      <Calendar :exam-dates="exams" v-if="activeComponent === 'calendar'" />
      
      <!-- Student and GroupLeader Specific Components -->
      <template v-if="user.role === 'Student' || user.role === 'GroupLeader'">
        <DataGrid
          v-if="activeComponent === 'calendar'"
          title="Examene"
          :data="exams"
          :headers="examHeaders"
          :showExport="true"
        />
      </template>
      
      <!-- Professor Specific Components -->
      <template v-if="user.role === 'Professor'">
        <DataGrid
          v-if="activeComponent === 'calendar'"
          title="Examene"
          :data="exams"
          :headers="professorExamHeaders"
          :actions="['edit']"
          :showExport="true"
          @edit="openEditDialog"
        />
        <Calendar :exam-dates="examRequestsPending" v-if="activeComponent === 'applications'" />
        <DataGrid
          v-if="activeComponent === 'applications'"
          title="Solicitări Examene"
          :data="requests"
          :headers="requestHeaders"
          :actions="['accept-reject']"
          @accept="openAcceptDialog"
          @reject="openRejectDialog"
        />
        <ExamEditDialog 
          v-if="showEditDialog" 
          :exam-id="selectedExam" 
          :assistant-options="assistants"
          :room-options="rooms" 
          @close="closeDialogs" 
        />
        <AcceptedRequestDialogue 
          v-if="showAcceptDialog" 
          :requestID="selectedRequestID" 
          @close="closeDialogs"
          :assistant-options="assistants" 
          :room-options="rooms" 
        />
        <RejectedRequestDialogue 
          v-if="showRejectDialog" 
          :requestID="selectedRequestID" 
          @close="closeDialogs" 
        />
      </template>

      <!-- Group Leader Specific Components -->
      <template v-if="user.role === 'GroupLeader'">
        <ExamRequestsForm 
          v-if="activeComponent === 'examScheduling'" 
          :materials="materials" 
          @request-added="handleRequestAdded"
        />
        <DataGrid
          v-if="activeComponent === 'examScheduling'"
          title="Cereri in procesare"
          :data="examRequestsPending"
          :headers="groupLeaderRequestHeaders"
        />
        <DataGrid
          v-if="activeComponent === 'rejectSchedules'"
          title="Examene Respinse"
          :data="examRequestsRejected"
          :headers="rejectedExamHeaders"
        />
      </template>

      <!-- Settings Component (Common for all roles) -->
      <ComponentSettings
        v-if="activeComponent === 'settings'"
        :username="user.username"
        :role="user.role"
        :email="user.email"
        :originalPassword="user.originalPassword"
        @saveSettings="saveUserSettings"
      />

      <!-- Error Overlay -->
      <div v-if="errorMessage" class="error-overlay">
        <div class="error-content">
          <div class="error-header">
            <div @click="errorMessage = null" class="error-close-btn">✖</div>
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
import { useRouter } from 'vue-router';
import api from '@/services/api';

// Components
import Calendar from '@/components/Calendar.vue';
import ExamEditDialog from '@/components/ExamEditDialog.vue';
import AcceptedRequestDialogue from '@/components/AcceptedRequestDialogue.vue';
import RejectedRequestDialogue from '@/components/RejectedRequestDialogue.vue';
import ExamRequestsForm from '@/components/ExamRequestsForm.vue';
import ComponentSettings from '@/components/ComponentSettings.vue';
import Sidebar from '@/components/Sidebar.vue';
import DataGrid from '@/components/DataGrid.vue';

// Router
const router = useRouter();

// Common state
const activeComponent = ref('calendar');
const errorMessage = ref(null);
const userId = ref(null);
const exams = ref([]);

// User state
const user = ref({
  username: '',
  role: '',
  email: '',
  password: '',
  originalPassword: '',
});

// Professor specific state
const requests = ref([]);
const assistants = ref([]);
const rooms = ref([]);
const showAcceptDialog = ref(false);
const showRejectDialog = ref(false);
const selectedRequestID = ref(null);
const selectedExam = ref({});
const showEditDialog = ref(false);

// Group Leader specific state
const examRequestsPending = ref([]);
const examRequestsRejected = ref([]);
const materials = ref([]);

// Grid Headers
const examHeaders = [
  { key: 'subjectName', label: 'Materia' },
  { key: 'professorName', label: 'Profesor' },
  { key: 'assistantName', label: 'Asistent' },
  { key: 'location', label: 'Sala' },
  { key: 'date', label: 'Data' },
  { key: 'start_Time', label: 'Ora' },
  { key: 'duration', label: 'Durata' }
];

const professorExamHeaders = [
  { key: 'subjectName', label: 'Materia' },
  { key: 'group', label: 'Grupa' },
  { key: 'assistantName', label: 'Asistent' },
  { key: 'location', label: 'Sala' },
  { key: 'date', label: 'Data' },
  { key: 'start_Time', label: 'Ora' },
  { key: 'duration', label: 'Durata' }
];

const requestHeaders = [
  { key: 'subjectName', label: 'Materia' },
  { key: 'group', label: 'Grupa' },
  { key: 'date', label: 'Data' },
  { key: 'status', label: 'Stare' }
];

const groupLeaderRequestHeaders = [
  { key: 'subjectName', label: 'Materia' },
  { key: 'professorName', label: 'Profesor' },
  { key: 'date', label: 'Data' },
  { key: 'status', label: 'Status' }
];

const rejectedExamHeaders = [
  { key: 'subjectName', label: 'Materia' },
  { key: 'professorName', label: 'Profesor' },
  { key: 'date', label: 'Data' },
  { key: 'status', label: 'Status' },
  { key: 'rejectionReason', label: 'Motivul Respingerii' }
];

// Common Methods
function setActiveComponent(componentName) {
  activeComponent.value = componentName;
}

function showError(message) {
  errorMessage.value = message;
}

function getErrorMessage(error) {
  if (error.response) {
    return `Eroare de server: ${error.response.data.message || error.response.statusText}`;
  } else if (error.request) {
    return 'Eroare de rețea: Nu am putut să te conectăm la server.';
  } else {
    return ` ${error.message}`;
  }
}

// User Data Methods
async function fetchUserData() {
  try {
    const response = await api.get(`/Users/Get/${userId.value}`);
    const response2 = await api.get(`/HasRoles/Get/${userId.value}`);
    console.log('Role response:', response2.data);
    
    // Handle role as string
    const roleFromApi = response2.data.role || response2.data;
    
    user.value = {
      username: response.data.userName,
      role: typeof roleFromApi === 'string' ? roleFromApi : 'GroupLeader',
      email: response.data.email,
      originalPassword: '',
    };
    
    console.log('User data set:', user.value);
  } catch (error) {
    console.error('Error fetching user data:', error);
    showError('Eroare la preluarea datelor utilizatorului: ' + getErrorMessage(error));
  }
}

async function saveUserSettings(updatedUser) {
  try {
    const payload = {
      UserID: userId.value,
      Password: updatedUser.password,
    };
    await api.put(`/Users/PutPassword/${userId.value}`, payload);
    user.value.originalPassword = updatedUser.password;
    showError('Parola a fost schimbată cu succes!');
  } catch (error) {
    showError('Eroare la schimbarea parolei: ' + getErrorMessage(error));
  }
}

// Professor Methods
function openEditDialog(examId) {
  selectedExam.value = examId;
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

// Data Fetching Methods
async function fetchExams() {
  try {
    const response = await api.get(`/exams/GetByUserID${userId.value}`);
    exams.value = response.data;
  } catch (error) {
    showError('Eroare la preluarea examenelor: ' + getErrorMessage(error));
  }
}

async function fetchRequests() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Pending`);
    requests.value = response.data;
  } catch (error) {
    showError('Eroare la preluarea cererilor: ' + getErrorMessage(error));
  }
}

async function fetchAssistants() {
  try {
    const response = await api.get('/Users/GetByRole/Assistant');
    assistants.value = response.data.map(assistant => ({
      value: assistant.userID,
      text: assistant.userName,
    }));
  } catch (error) {
    showError('Eroare la preluarea asistenților: ' + getErrorMessage(error));
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
    showError('Eroare la preluarea sălilor: ' + getErrorMessage(error));
  }
}

async function fetchExamRequests() {
  try {
    console.log('Fetching exam requests for user:', userId.value);
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Pending`);
    console.log('API Response:', response);
    examRequestsPending.value = response.data;
    console.log('Pending Requests after update:', examRequestsPending.value);
  } catch (error) {
    console.error('Error fetching exam requests:', error);
    showError('Eroare la preluarea cererilor de examen: ' + getErrorMessage(error));
  }
}

async function fetchExamRequestsRejected() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Rejected`);
    examRequestsRejected.value = response.data;
    console.log('Rejected Requests:', examRequestsRejected.value); // Debug için log
  } catch (error) {
    showError('Eroare la preluarea cererilor respinse: ' + getErrorMessage(error));
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
    showError('Eroare la preluarea materiilor: ' + getErrorMessage(error));
  }
}

// Polling
let pollingInterval = null;

// Polling Functions
function startPolling() {
  stopPolling();
  pollingInterval = setInterval(() => {
    if (activeComponent.value === 'calendar') {
      fetchExams();
    } else if (activeComponent.value === 'applications' && user.value.role === 'Professor') {
      fetchRequests();
    } else if (activeComponent.value === 'examScheduling' && user.value.role === 'GroupLeader') {
      fetchExamRequests();
    } else if (activeComponent.value === 'rejectSchedules' && user.value.role === 'GroupLeader') {
      fetchExamRequestsRejected();
    }
  }, 120000); // 2 dakika
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

// Lifecycle Hooks
onMounted(() => {
  const userFromStorage = JSON.parse(localStorage.getItem('user'));
  console.log('User from storage:', userFromStorage);
  if (userFromStorage) {
    userId.value = userFromStorage.userId;
    fetchUserData().then(() => {
      console.log('Current user role:', user.value.role);
      fetchExams();
      if (user.value.role === 'Professor') {
        fetchRequests();
        fetchAssistants();
        fetchRooms();
      } else if (user.value.role === 'GroupLeader') {
        console.log('Fetching GroupLeader specific data');
        fetchMaterials();
        fetchExamRequests();
        fetchExamRequestsRejected();
      }
      startPolling();
    });
  } else {
    router.push({ name: 'LoginView' });
  }
});

onUnmounted(() => {
  stopPolling();
});

// Watchers
watch(activeComponent, () => {
  startPolling();
});

// Group Leader Methods
const handleRequestAdded = () => {
  if (activeComponent.value === 'examScheduling') {
    fetchExamRequests();
  }
};
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
  --color-text: #000000;
}

.dashboard-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  margin-left: 1rem;
  overflow-y: auto;
  height: 100%;
}

.dashboard-view > * {
  flex: 1 1 auto;
  width: 100%;
  max-height: calc(100vh - 100px);
  min-height: 150px;
}

.dashboard-view > * + * {
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

.exam-grid {
  color: #000000;
  font-size: 14px;
}

.exam-grid :deep(th) {
  color: #000000;
  font-weight: 600;
}

.exam-grid :deep(td) {
  color: #000000;
}

.no-data-message {
  text-align: center;
  color: var(--color-text);
  font-size: 16px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
}
</style> 