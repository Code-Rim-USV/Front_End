<template>
    <div class="layout">
      <!-- Sidebar -->
      <StudentSidebar />
    
      <!-- Main content area -->
      <div class="student-view">
        <Calendar :exam-dates="exams" />
        <ExamsGrid :exams="exams" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'; 
  import api from '@/services/api'; 
  import Calendar from '@/components/Calendar.vue';
  import ExamsGrid from '@/components/ExamsGrid.vue';
  import StudentSidebar from '@/components/StudentSidebar.vue';
  import { useRouter } from 'vue-router';
  
  const exams = ref([]);
  const userId = ref(null);
  const router = useRouter();
  
  onMounted(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      userId.value = user.userId;
      fetchExams();
    } else {
      router.push({ name: 'LoginView' });
    }
  });
  
  async function fetchExams() {
    try {
      const response = await api.get(`/exams/GetByUserID${userId.value}`);
      exams.value = response.data; 
    } catch (error) {
      console.error('Eroare la preluarea examenelor: ', error);
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
    max-height: calc(100vh - 100px); 
    min-height: 150px;  
  }
  
  </style>
  