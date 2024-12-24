<template>
    <div class="dialogue-overlay">
      <div class="dialogue-container">
        <h2>Editați examenul</h2>
        <div class="input-area">
          <ExamRequestDropInput 
            label="Asistenți" 
            :options="assistantOptions || []" 
            v-model="selectedAssistant"
            placeholder="Selectați asistentul" />
        </div>
        <div class="input-area">
          <ExamRequestDropInput 
            label="Sala" 
            :options="roomOptions || []" 
            v-model="selectedRoom" 
            placeholder="Selectați sala" />
        </div>
        <div class="input-area">
          <ScheduleExamHourInput v-model="selectedTime" />
        </div>
        <div class="input-area">
          <label>Durata examenului</label>
          <div class="duration-selector">
            <button 
              v-for="duration in examDurations" 
              :key="duration"
              :class="['duration-btn', { active: selectedDuration === duration }]"
              @click="selectDuration(duration)">
              {{ duration }} h
            </button>
          </div>
        </div>
        <div class="dialogue-buttons">
          <button class="cancel-btn" @click="handleCancel">Anulează</button>
          <button class="confirm-btn" @click="handleConfirm">Salvează modificările</button>
        </div>
      </div>

      <!-- Error Overlay -->
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
    </div>
  </template>
  
  <script>
  import ExamRequestDropInput from './ExamRequestDropInput.vue';
  import ScheduleExamHourInput from './ScheduleExamHourInput.vue';
  
  export default {
    name: 'ExamEditDialog',
    components: {
      ExamRequestDropInput,
      ScheduleExamHourInput,
    },
    props: {
      examData: {
        type: Object,
        required: true,
        default: () => ({
          assistantID: '',
          locationID: '',
          start_Time: '09:00',
          duration: 2
        })
      },
      assistantOptions: {
        type: Array,
        default: () => []
      },
      roomOptions: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        selectedAssistant: '',
        selectedRoom: '',
        selectedTime: this.initializeTime(),
        selectedDuration: 2,
        examDurations: [1, 2, 3],
        errorMessage: null, // Add errorMessage to control the overlay visibility
      };
    },
    created() {
      this.initializeData();
    },
    methods: {
      initializeTime() {
        return {
          hours: 9,
          minutes: '00',
          isAM: true
        };
      },
      initializeData() {
        this.selectedAssistant = this.examData.assistantID || '';
        this.selectedRoom = this.examData.locationID || '';
        this.selectedTime = this.formatTime(this.examData.start_Time || '09:00');
        this.selectedDuration = this.examData.duration || 2;
      },
      formatTime(timeString) {
        try {
          const [hours, minutes] = timeString.split(':');
          const isAM = parseInt(hours) < 12;
          return {
            hours: isAM ? parseInt(hours) : parseInt(hours) - 12,
            minutes: minutes.slice(0, 2),
            isAM: isAM,
          };
        } catch (error) {
          console.warn('Error formatting time:', error);
          return this.initializeTime();
        }
      },
      selectDuration(duration) {
        this.selectedDuration = duration;
      },
      handleCancel() {
        this.$emit('close');
      },
      handleConfirm() {
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

        this.$emit('update', {
          assistantID: this.selectedAssistant,
          locationID: this.selectedRoom,
          duration: this.selectedDuration,
          time: this.selectedTime
        });
      },
      showError(message) {
        this.errorMessage = message;
      },
    }
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
  
  /* Error Overlay Styles */
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
  