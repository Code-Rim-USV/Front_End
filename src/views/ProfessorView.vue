<template>
  <div class="layout">
    <ProfessorSidebar @changeComponent="setActiveComponent" />
    <div class="professor-view">
      <!-- Calendar component -->
      <Calendar :exam-dates="exams" />
      <ProfessorExamGrid v-if="activeComponent === 'calendar'" />
      <ExamRequestsGrid :requests="requests" v-if="activeComponent === 'applications'" @accept="openAcceptDialog"
        @reject="openRejectDialog" />

      <AcceptedRequestDialogue v-if="showAcceptDialog" :requestID="selectedRequestID" @close="closeDialogs"
        :assistant-options="assistants" />
      <RejectedRequestDialogue v-if="showRejectDialog" :requestID="selectedRequestID" @close="closeDialogs" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Calendar from '@/components/Calendar.vue';
import ProfessorExamGrid from '@/components/ProfessorExamsGrid.vue';
import ProfessorSidebar from '@/components/ProfessorSidebar.vue';
import ExamRequestsGrid from '@/components/ExamRequestsGrid.vue';
import AcceptedRequestDialogue from '@/components/AcceptedRequestDialogue.vue';
import RejectedRequestDialogue from '@/components/RejectedRequestDialogue.vue';
import api from '@/services/api';

const activeComponent = ref('calendar');
const exams = ref([]);
const requests = ref([]);
const assistants = ref([]); 
const userId = ref(null);
const showAcceptDialog = ref(false);
const showRejectDialog = ref(false);
const selectedRequestID = ref(null);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userId.value = user.userId;
    fetchExams();
    fetchRequests();
    fetchAssistants(); 
  } else {
    router.push({ name: 'LoginView' });
  }
});

function setActiveComponent(componentName) {
  activeComponent.value = componentName;
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
  selectedRequestID.value = null;
}

async function fetchExams() {
  try {
    const response = await api.get(`/exams/GetByUserID${userId.value}`);
    exams.value = response.data;
  } catch (error) {
    console.error('Error fetching exams: ', error);
  }
}

async function fetchRequests() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Pending`);
    requests.value = response.data;
  } catch (error) {
    console.error('Error fetching requests: ', error);
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
    console.error('Error fetching assistants: ', error);
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
}

.professor-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  margin-left: 1rem;
}

.professor-view>*+* {
  margin-top: 1.5rem;
}
</style>