<template>
    <div class="layout">
        <!-- Sidebar -->
        <StudentSidebar />

        <!-- Main content area -->
        <div class="student-view">
            <Calendar />
            <ExamsGrid />
        </div>
    </div>
</template>

<script setup>
import Calendar from '@/components/Calendar.vue';
import ExamsGrid from '@/components/ExamsGrid.vue';
import StudentSidebar from '@/components/StudentSidebar.vue';
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
