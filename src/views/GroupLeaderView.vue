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
      />
      <GroupLeaderExamRequestsGrid :exams="examRequestsPending"  v-if="activeComponent === 'examScheduling'" />

      <!-- Rejected Exam grid -->
      <RejectedExamsGrid :rejectedExams="examRequestsRejected" v-if="activeComponent === 'rejectSchedules'" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Calendar from '@/components/Calendar.vue';
import ExamsGrid from '@/components/ExamsGrid.vue';
import GroupLeaderExamRequestsGrid from '@/components/GroupLeaderExamRequestsGrid.vue';
import RejectedExamsGrid from '@/components/RejectedExamsGrid.vue';
import GroupLeaderSidebar from '@/components/GroupLeaderSidebar.vue';
import ExamRequestsForm from '@/components/ExamRequestsForm.vue';
import api from '@/services/api';

const activeComponent = ref('calendar');
const exams = ref([]);
const examRequestsPending = ref([]);
const examRequestsRejected = ref([]);
const userId = ref(null);
const materials = ref([]);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    userId.value = user.userId;
    fetchExams();
    fetchMaterials();
    fetchExamRequests();
    fetchExamRequestsRejected();  
  } else {
    router.push({ name: 'LoginView' });
  }
});

function setActiveComponent(componentName) {
  activeComponent.value = componentName;
}

async function fetchExams() {
  try {
    const response = await api.get(`/exams/GetByUserID${userId.value}`);
    exams.value = response.data;
  } catch (error) {
    console.error('Error fetching exams: ', error);
  }
}

async function fetchExamRequests() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Pending`);
    examRequestsPending.value = response.data;
  } catch (error) {
    console.error('Error fetching exams: ', error);
  }
}

async function fetchExamRequestsRejected() {
  try {
    const response = await api.get(`/Requests/GetByUserID/${userId.value}/Rejected`);
    examRequestsRejected.value = response.data;
  } catch (error) {
    console.error('Error fetching exams: ', error);
  }
}

async function fetchMaterials() {
  try {
    const response = await api.get('/Subjects/Get');
    materials.value = response.data.map(subject => ({
      text: subject.subjectName, 
      value: subject.subjectID,  
    }));
    console.log(materials.value);
  } catch (error) {
    console.error('Error fetching materials: ', error);
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
</style>
