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
        <label>Ora examenului</label>
        <div class="time-picker">
          <select v-model="selectedTime.hours" class="time-select">
            <option v-for="hour in 12" :key="hour" :value="hour">
              {{ hour.toString().padStart(2, '0') }}
            </option>
          </select>
          <span class="time-separator">:</span>
          <select v-model="selectedTime.minutes" class="time-select">
            <option value="00">00</option>
            <option value="15">15</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </select>
          <select v-model="selectedTime.isAM" class="time-select period">
            <option :value="true">AM</option>
            <option :value="false">PM</option>
          </select>
        </div>
      </div>
      <div class="input-area">
        <label>Durata examenului</label>
        <div class="duration-selector">
          <button v-for="duration in examDurations" :key="duration"
            :class="['duration-btn', { active: selectedDuration === duration }]" @click="selectDuration(duration)">
            {{ duration }} h
          </button>
        </div>
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

export default {
  name: 'ExamSchedulingDialog',
  components: {
    ExamRequestDropInput,
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
      selectedDuration: 2,
      examDurations: [1, 2, 3],
      errorMessage: null, // Store error message for the overlay
    };
  },
  methods: {
    // Method to show the error overlay
    showError(message) {
      this.errorMessage = message;
    },

    selectDuration(duration) {
      this.selectedDuration = duration;
    },

    async acceptExam() {
      // Validate that all required fields are selected
      if (!this.selectedAssistant) {
        this.showError('Vă rugăm să selectați un asistent.');
        return;
      }
      if (!this.selectedRoom) {
        this.showError('Vă rugăm să selectați o sală.');
        return;
      }
      if (!this.selectedTime || !this.selectedTime.hours || !this.selectedTime.minutes) {
        this.showError('Vă rugăm să selectați o oră pentru examen.');
        return;
      }

      try {
        // Convert hours to 12-hour format
        let hours = parseInt(this.selectedTime.hours);
        if (!this.selectedTime.isAM && hours < 12) {
          hours += 12;
        } else if (this.selectedTime.isAM && hours === 12) {
          hours = 0;
        }

        // Format back to 12-hour for display
        let displayHours = hours % 12;
        displayHours = displayHours === 0 ? 12 : displayHours;

        const formattedTime = `${displayHours}:${this.selectedTime.minutes}${this.selectedTime.isAM ? 'AM' : 'PM'}`;

        const payload = {
          requestID: this.requestID,
          assistantID: this.selectedAssistant,
          start_Time: formattedTime,
          locationID: this.selectedRoom,
          duration: this.selectedDuration,
        };

        const response = await api.post('/Exams/PostWithRequestID', payload);

        if (response.status === 200) {
          this.$emit('exam-accepted');
          this.$emit('close');
          window.location.reload();
        }
      } catch (error) {
        const errorMessage = this.getErrorMessage(error);
        this.showError(errorMessage);
      }
    },

    // Utility method to get a detailed error message
    getErrorMessage(error) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        if (error.response.data && error.response.data.message) {
          return error.response.data.message;
        } else if (error.response.statusText) {
          return error.response.statusText;
        } else {
          return `Eroare necunoscută`;
        }
      } else if (error.request) {
        // Request was made but no response was received
        return 'Eroare de rețea: Nu am putut să te conectăm la server.';
      } else return `${error.message}`;

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

.duration-selector {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.duration-btn {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  color: black;
  cursor: pointer;
  transition: all 0.3s ease;
}

.duration-btn.active {
  background: black;
  color: white;
  border-color: black;
}

.duration-btn:hover {
  background: #f5f5f5;
  border-color: black;
}

.duration-btn.active:hover {
  background: #333;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.time-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: white;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.time-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  background: white;
  min-width: 65px;
  text-align: center;
}

.time-select:focus {
  outline: none;
  border-color: black;
}

.time-separator {
  font-size: 1.2em;
  font-weight: bold;
  color: #666;
}

.period {
  min-width: 70px;
}
</style>
