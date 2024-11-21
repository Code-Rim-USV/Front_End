<template>
  <div class="layout">
    <GroupLeaderSidebar @changeComponent="setActiveComponent" />
    <div class="student-view">
      <Calendar v-if="activeComponent === 'calendar'" />
      <ExamsGrid v-if="activeComponent === 'calendar'" />
      <ExamRequestsForm v-if="activeComponent === 'examScheduling'" />
      <GroupLeaderExamRequestsGrid v-if="activeComponent === 'examScheduling'" />
      <RejectedExamsGrid v-if="activeComponent === 'rejectSchedules'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Calendar from '@/components/Calendar.vue';
import ExamsGrid from '@/components/ExamsGrid.vue';
import GroupLeaderExamRequestsGrid from '@/components/GroupLeaderExamRequestsGrid.vue';
import RejectedExamsGrid from '@/components/RejectedExamsGrid.vue';
import GroupLeaderSidebar from '@/components/GroupLeaderSidebar.vue';
import ExamRequestsForm from '@/components/ExamRequestsForm.vue';

const activeComponent = ref('calendar');

function setActiveComponent(componentName) {
  activeComponent.value = componentName;
}
</script>

<style scoped>
#app {
  height: 100vh;
  width: 100%;
}

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
  row-gap: 1px;
}

.student-view>*+* {
  margin-top: 0.5rem;
}
</style>
