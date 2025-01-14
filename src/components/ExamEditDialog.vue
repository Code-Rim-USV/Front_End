<template>
  <div class="dialog-overlay">
    <div class="dialog-container">
      <h2>Editare examen</h2>
      <div class="form-group">
        <ExamRequestDropInput
          label="Asistenți"
          :options="assistantOptions"
          v-model="selectedAssistant"
          placeholder="Selectați asistentul"
        />
      </div>
      <div class="form-group">
        <ExamRequestDropInput
          label="Sala"
          :options="roomOptions"
          v-model="selectedRoom"
          placeholder="Selectați sala"
        />
      </div>
      <div class="form-group">
        <label class="form-label">Ora examenului</label>
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
      <div class="form-group">
        <label class="form-label">Durata examenului</label>
        <div class="duration-selector">
          <button
            v-for="duration in examDurations"
            :key="duration"
            :class="['duration-btn', { active: selectedDuration === duration }]"
            @click="selectDuration(duration)"
          >
            {{ duration }} ore
          </button>
        </div>
      </div>
      <div class="dialog-actions">
        <button class="btn btn-primary" @click="updateExam">Salvează</button>
        <button class="btn btn-secondary" @click="$emit('close')">Anulează</button>
      </div>
    </div>
  </div>

  <!-- Error Dialog -->
  <div v-if="errorMessage" class="error-dialog-overlay">
    <div class="error-dialog">
      <div class="error-dialog__header">
        <button @click="closeError" class="error-dialog__close">
          ✖
        </button>
      </div>
      <p class="error-dialog__message">{{ errorMessage }}</p>
      <button @click="closeError" class="btn btn-primary">OK</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import api from '@/services/api';
import ExamRequestDropInput from './ExamRequestDropInput.vue';

/**
 * Dialog component for editing exam details
 */
export default {
  name: 'ExamEditDialog',
  components: {
    ExamRequestDropInput,
  },
  props: {
    examId: {
      type: Number,
      required: true,
    },
    assistantOptions: {
      type: Array,
      required: true,
    },
    roomOptions: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      selectedAssistant: '',
      selectedRoom: '',
      selectedTime: {
        hours: 9,
        minutes: "00",
        isAM: true,
      },
      selectedDuration: 2,
      examDurations: [1, 2, 3],
      errorMessage: null,
    };
  },
  methods: {
    closeError() {
      this.errorMessage = null;
    },

    showError(message) {
      this.errorMessage = message;
    },

    selectDuration(duration) {
      this.selectedDuration = duration;
    },

    async updateExam() {
      if (!this.validateForm()) return;

      try {
        const formattedTime = this.formatTime();
        await this.submitExamUpdate(formattedTime);
        this.handleSuccess();
      } catch (error) {
        console.error('Eroare la actualizare:', error);
        this.showError(this.getErrorMessage(error));
      }
    },

    validateForm() {
      if (!this.selectedAssistant) {
        this.showError('Vă rugăm să selectați un asistent.');
        return false;
      }
      if (!this.selectedRoom) {
        this.showError('Vă rugăm să selectați o sală.');
        return false;
      }
      if (!this.selectedTime || !this.selectedTime.hours || !this.selectedTime.minutes) {
        this.showError('Vă rugăm să selectați ora examenului.');
        return false;
      }
      return true;
    },

    formatTime() {
      let hours = parseInt(this.selectedTime.hours);
      if (!this.selectedTime.isAM && hours < 12) {
        hours += 12;
      } else if (this.selectedTime.isAM && hours === 12) {
        hours = 0;
      }
      
      let displayHours = hours % 12;
      displayHours = displayHours === 0 ? 12 : displayHours;
      
      return `${String(displayHours).padStart(2, '0')}:${this.selectedTime.minutes} ${this.selectedTime.isAM ? 'AM' : 'PM'}`;
    },

    async submitExamUpdate(formattedTime) {
      const payload = {
        ExamID: parseInt(this.examId),
        AssistantID: parseInt(this.selectedAssistant),
        Start_Time: formattedTime,
        LocationID: parseInt(this.selectedRoom),
        Duration: parseInt(this.selectedDuration)
      };

      await api.put(`/Exams/Put/${this.examId}`, payload);
    },

    handleSuccess() {
      this.$emit('close');
      window.location.reload();
    },

    getErrorMessage(error) {
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      if (error.response?.statusText) {
        return error.response.statusText;
      }
      if (error.response) {
        return `Eroare de server: ${error.response.status}`;
      }
      if (error.request) {
        return 'Eroare de rețea: Nu s-a putut conecta la server.';
      }
      return error.message || 'A apărut o eroare necunoscută.';
    },
  }
};
</script>

<style scoped>
.dialog-overlay {
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

.dialog-container {
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

.form-group {
  margin: 15px 0;
}

.dialog-actions {
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

.btn-primary {
  background: black;
  color: white;
}

.btn-primary:hover {
  background: white;
  color: black;
  border: 1px solid black;
}

.btn-secondary {
  background: white;
  color: black;
  border: 1px solid black;
}

.btn-secondary:hover {
  background: black;
  color: white;
}

/* Error Dialog styles */
.error-dialog-overlay {
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

.error-dialog {
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

.error-dialog__header {
  position: relative;
  width: 100%;
  margin-top: 30px; 
}

.error-dialog__close {
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

.error-dialog__message {
  font-size: 16px;
  color: red;
  margin-bottom: 20px;
  flex-grow: 1;
}

.btn-primary {
  background-color: transparent;
  color: grey;
  border: 2px solid grey;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
}

.btn-primary:hover {
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

.form-label {
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
