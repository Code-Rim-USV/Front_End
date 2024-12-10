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
        <button class="confirm-btn" @click="acceptExam">Acceptă</button>
        <button class="cancel-btn" @click="$emit('close')">Anulează</button>
      </div>
    </div>
  </div>

  <!-- Error overlay -->
  <div v-if="errorMessage" class="error-overlay">
    <div class="error-content">
      <div class="error-header">
        <div @click="errorMessage = null" class="error-close-btn">
          ✖
        </div>
      </div>
      <span class="error-message">{{ errorMessage }}</span>
      <button @click="errorMessage = null" class="error-ok-btn">OK</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
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
    roomOptions: {
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
        minutes: "00",
        isAM: true,
      },
      errorMessage: null, // Store error message for the overlay
    };
  },
  methods: {
    // Method to show the error overlay
    showError(message) {
      this.errorMessage = message;
    },

    async acceptExam() {
      try {
        const payload = {
          requestID: this.requestID,
          assistantID: this.selectedAssistant,
          start_Time: `${this.selectedTime.hours}:${this.selectedTime.minutes}${this.selectedTime.isAM ? 'AM' : 'PM'}`,
          locationID: this.selectedRoom,
        };

        const response = await api.post('/Exams/PostWithRequestID', payload);

        if (response.status === 200) {
          this.$emit('close');
        }
      } catch (error) {
        // Show the error overlay instead of alerting or logging the error
        const errorMessage = this.getErrorMessage(error);
        this.showError('A apărut o eroare la programarea examenului: ' + errorMessage);
      }
    },

    // Utility method to get a detailed error message
    getErrorMessage(error) {
      if (error.response) {
        return error.response.data.message || error.response.statusText;
      } else if (error.request) {
        return 'Eroare de rețea: Nu am putut să te conectăm la server.';
      } else {
        return `Eroare necunoscută: ${error.message}`;
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
  width: 50%;
  max-width: 500px;
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

/* Error overlay styles */
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
</style>
