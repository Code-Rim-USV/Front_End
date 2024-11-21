<template>
    <div class="layout">
        
        <ProfessorSidebar @changeComponent="setActiveComponent" />
        <div class="professor-view">
            <Calendar />
            <ProfessorExamGrid v-if="activeComponent === 'calendar'" />
            <ExamRequestsGrid v-if="activeComponent === 'applications'" @accept="openAcceptDialog"
                              @reject="openRejectDialog" />
        </div>
        <AcceptedRequestDialogue v-if="showAcceptDialog" :examId="selectedExamId" @close="closeDialogs" />
        <RejectedRequestDialogue v-if="showRejectDialog" :examId="selectedExamId" @close="closeDialogs" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Calendar from '@/components/Calendar.vue';
import ProfessorExamGrid from '@/components/ProfessorExamsGrid.vue';
import ProfessorSidebar from '@/components/ProfessorSidebar.vue';
import ExamRequestsGrid from '@/components/ExamRequestsGrid.vue';
import AcceptedRequestDialogue from '@/components/AcceptedRequestDialogue.vue';
import RejectedRequestDialogue from '@/components/RejectedRequestDialogue.vue';

const activeComponent = ref('calendar');
const showAcceptDialog = ref(false);
const showRejectDialog = ref(false);
const selectedExamId = ref(null);

function setActiveComponent(componentName) {
  activeComponent.value = componentName;
}

function openAcceptDialog(examId) {
  selectedExamId.value = examId;
  showAcceptDialog.value = true;
}

function openRejectDialog(examId) {
  selectedExamId.value = examId;
  showRejectDialog.value = true;
}

function closeDialogs() {
  showAcceptDialog.value = false;
  showRejectDialog.value = false;
  selectedExamId.value = null;
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

    .professor-view {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 20px;
        margin-left: 1rem;
        row-gap: 5px;
    }

        .professor-view > * + * {
            margin-top: 0.5rem;
        }

    .dialogue-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
</style>
