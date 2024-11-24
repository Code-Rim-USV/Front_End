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
      console.error('Error fetching exams: ', error);
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
  
  .student-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 20px;
    margin-left: 1rem;
  }
  
  .student-view > * + * {
    margin-top: 1.5rem;
  }
  
  .sidebar {
    width: 250px;
    background-color: #fff;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  