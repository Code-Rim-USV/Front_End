<template>
  <div class="dialogue-overlay">
    <div class="dialogue-container">
      <h2>Programează examenul</h2>
      <div class="input-area">
        <!-- Dropdown pentru selectarea asistentului -->
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
        <button class="confirm-btn" @click="acceptExam">Accept</button>
        <button class="cancel-btn" @click="$emit('close')">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import api from '@/services/api';
import ExamRequestDropInput from './ExamRequestDropInput.vue';
import ScheduleExamHourInput from './ScheduleExamHourInput.vue';

export default {
  name: 'ExamSchedulingDialog',
  components: {
    ExamRequestDropInput,
    ScheduleExamHourInput,
  },
  props: {
    requestID: {
      type: String,
      required: true,
    },
    assistantOptions: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      selectedAssistant: '',
      selectedRoom: '',
      selectedTime: {
        hours: 1,
        minutes: 0,
        isAM: true,
      },
      roomOptions: [
        { value: 'C001', text: 'C001' },
        { value: 'C002', text: 'C002' },
        { value: 'C003', text: 'C003' },
        { value: 'C004', text: 'C004' },
        { value: 'C005', text: 'C005' },
        { value: 'C006', text: 'C006' },
        { value: 'C007', text: 'C007' },
        { value: 'C009', text: 'C009' },

        { value: 'C101', text: 'C101' },
        { value: 'C102', text: 'C102' },
        { value: 'C103', text: 'C103' },
        { value: 'C104', text: 'C104' },
        { value: 'C105', text: 'C105' },
        { value: 'C106', text: 'C106' },
        { value: 'C107', text: 'C107' },
        { value: 'C109', text: 'C109' },

        { value: 'C201', text: 'C201' },
        { value: 'C202', text: 'C202' },
        { value: 'C203', text: 'C203' },
        { value: 'C204', text: 'C204' },
        { value: 'C205', text: 'C205' },
        { value: 'C206', text: 'C206' },
        { value: 'C207', text: 'C207' },
        { value: 'C209', text: 'C209' },

        { value: 'C301', text: 'C301' },
        { value: 'C302', text: 'C302' },
        { value: 'C303', text: 'C303' },
        { value: 'C304', text: 'C304' },
        { value: 'C305', text: 'C305' },
        { value: 'C306', text: 'C306' },
        { value: 'C307', text: 'C307' },
        { value: 'C309', text: 'C309' }
      ],
    };
  },
  methods: {
    async acceptExam() {
      try {
        const payload = {
          requestID: this.requestID,
          assistantID: this.selectedAssistant,
          start_Time: `${this.selectedTime.hours}:${this.selectedTime.minutes}${this.selectedTime.isAM ? 'AM' : 'PM'}`,
          location: this.selectedRoom, 
        };
        console.log(payload); 
        const response = await api.post('/Exams/PostWithRequestID', payload);

        if (response.status === 200) {
          alert('Examenul a fost programat cu succes!');
          this.$emit('close');
        }
      } catch (error) {
        console.error('Eroare la programarea examenului:', error);
        alert('A apărut o eroare la programarea examenului. Vă rugăm să încercați din nou.');
      }
    },
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
