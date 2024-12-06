<template>
    <div class="dialogue-overlay">
      <div class="dialogue-container">
        <h2>Editați examenul</h2>
        <div class="input-area">
          <ExamRequestDropInput 
            label="Asistenți" 
            :options="assistantOptions" 
            v-model="selectedAssistant"
            placeholder="Selectați asistentul" />
        </div>
        <div class="input-area">
          <ExamRequestDropInput 
            label="Sala" 
            :options="roomOptions" 
            v-model="selectedRoom" 
            placeholder="Selectați sala" />
        </div>
        <div class="input-area">
          <ScheduleExamHourInput v-model="selectedTime" />
        </div>
        <div class="dialogue-buttons">
          <button class="confirm-btn" @click="updateExam">Salvează modificările</button>
          <button class="cancel-btn" @click="$emit('close')">Anulează</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from '@/services/api';
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
        selectedAssistant: this.examData.assistantID || '',
        selectedRoom: this.examData.locationID || '',
        selectedTime: this.formatTime(this.examData.start_Time),
      };
    },
    watch: {
      // Când `examData` se schimbă, actualizează valorile
      examData: {
        handler(newExamData) {
          this.selectedAssistant = newExamData.assistantID || '';
          this.selectedRoom = newExamData.locationID || '';
          this.selectedTime = this.formatTime(newExamData.start_Time);
        },
        deep: true,
      },
    },
    methods: {
      formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const isAM = parseInt(hours) < 12;
        return {
          hours: isAM ? parseInt(hours) : parseInt(hours) - 12,
          minutes: minutes.slice(0, 2),
          isAM: isAM,
        };
      },
      async updateExam() {
        try {
          const updatedData = {};
  
          if (this.selectedAssistant !== this.examData.assistantID) {
            updatedData.assistantID = this.selectedAssistant;
          }
          if (this.selectedTime.hours !== this.examData.start_Time.split(':')[0] || 
              this.selectedTime.minutes !== this.examData.start_Time.split(':')[1].slice(0, 2)) {
            updatedData.start_Time = `${this.selectedTime.hours}:${this.selectedTime.minutes}${this.selectedTime.isAM ? 'AM' : 'PM'}`;
          }
          if (this.selectedRoom !== this.examData.locationID) {
            updatedData.locationID = this.selectedRoom;
          }
  
          if (Object.keys(updatedData).length > 0) {
            updatedData.examID = this.examData.examID;
            const response = await api.put(`/Exams/Put/${this.examData.examID}`, updatedData);
  
            if (response.status === 200) {
              alert('Examenul a fost actualizat cu succes!');
              this.$emit('close');
            }
          } else {
            alert('Nu au fost efectuate modificări.');
          }
        } catch (error) {
          console.error('Eroare la actualizarea examenului:', error);
          alert('A apărut o eroare la actualizarea examenului. Vă rugăm să încercați din nou.');
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
  </style>
  