<template>
    <div class="dialogue-overlay">
      <div class="dialogue-container">
        <h2>Programează examenul</h2>
        <div class="input-area">
          <ExamRequestDropInput label="Asistenți" :options="assistantOptions" v-model="selectedAssistant"
            placeholder="Selectați asistentul" />
        </div>
        <div class="input-area">
          <ExamRequestDropInput label="Sala" :options="roomOptions" v-model="selectedRoom" placeholder="Selectați sala" />
        </div>
        <div class="input-area">
          <ScheduleExamHourInput v-model="selectedTime" />
        </div>
        <div class="dialogue-buttons">
          <button class="confirm-btn" @click="$emit('close')">Accept</button>
          <button class="cancel-btn" @click="$emit('close')">Cancel</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ExamRequestDropInput from './ExamRequestDropInput.vue';
  import ScheduleExamHourInput from './ScheduleExamHourInput.vue';
  
  export default {
    name: 'ExamSchedulingDialog',
    components: {
      ExamRequestDropInput,
      ScheduleExamHourInput,
    },
    props: {
      examId: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        assistantOptions: [
          { value: 'asistent1', text: 'Asistent 1' },
          { value: 'asistent2', text: 'Asistent 2' },
        ],
        roomOptions: [
          { value: 'sala1', text: 'Sala 1' },
          { value: 'sala2', text: 'Sala 2' },
        ],
        selectedAssistant: '',
        selectedRoom: '',
        selectedTime: {
          hours: 1,
          minutes: 0,
          isAM: true,
        },
      };
    },
  };
  </script>
  
  <style scoped>
  .dialogue-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .dialogue-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    color: black;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .input-area {
    margin: 15px 0;
  }
  
  .dialogue-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  button {
    border: none;
    border-radius: 4px;
    font-size: 1em;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .confirm-btn {
    background: black;
    color: white;
  }
  
  .confirm-btn:hover {
    background: white;
    color: black;
    border: 1px solid black;
  }
  
  .cancel-btn {
    background: white;
    color: black;
    border: 1px solid black;
  }
  
  .cancel-btn:hover {
    background: black;
    color: white;
  }
  </style>  