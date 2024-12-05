<template>
    <div class="exam-request-form">
      <div class="row">
        <ExamRequestDropInput 
          class="input-column" 
          label="Select Material" 
          :options="materials" 
          v-model="material"
          placeholder="Selectează materia" 
        />
        
        <ExamRequestDateInput 
          class="input-column" 
          label="Date" 
          v-model="date" 
          placeholder="Selectează data" 
        />
        <button class="add-exam-button" @click="addExam" :disabled="isFormInvalid">
          Adaugă un examen
        </button>
      </div>
      <p v-if="formStatus" class="form-status">{{ formStatus }}</p>
    </div>
  </template>
  
  <script>
  import ExamRequestDropInput from "./ExamRequestDropInput.vue";
  import ExamRequestDateInput from "./ExamRequestDateInput.vue";
  import api from '@/services/api';
  
  export default {
    name: "ExamRequestsForm",
    components: {
      ExamRequestDropInput,
      ExamRequestDateInput,
    },
    props: {
      materials: { 
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        material: "",
        date: "",
        formStatus: "",
      };
    },
    computed: {
      isFormInvalid() {
        return !this.material || !this.date;
      },
    },
    methods: {
      async addExam() {
        if (this.isFormInvalid) {
          return;
        }
  
        const userID = JSON.parse(localStorage.getItem('user'))?.userId;
        if (!userID) {
          this.formStatus = "Utilizatorul nu a fost găsit.";
          return;
        }
  
        const formattedDate = this.date instanceof Date ? this.date.toISOString().split('T')[0] : this.date;
  
        const requestData = {
          userID,
          subjectID: this.material,
          date: formattedDate
        };
  
        try {
          const response = await api.post('/Requests/Post', requestData);
          window.location.reload();
        } catch (error) {
          console.error('Eroare la adăugarea examenului: ', error);
        }
  
        // Reset form
        this.material = "";
        this.date = "";
      },
    },
  };
  </script>
  
  <style scoped>
  .exam-request-form {
    display: flex;
    justify-content: center;
    padding: 20px;
    width: 90%;
    margin: 0 auto;
    margin-bottom: 100px;
  }
  
  .row {
    display: flex;
    gap: 20px;
    align-items: end;
    width: 100%;
    justify-content: space-around;
  }
  
  .input-column {
    flex: 1;
  }
  
  .add-exam-button {
    width: 15%;
    height: 80px;
    padding: 10px;
    background-color: #000;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .add-exam-button:hover {
    background-color: #333;
  }
  
  .add-exam-button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  .form-status {
    font-size: 1rem;
    font-weight: bold;
    color: green;
    margin-top: 20px;
  }
  </style>
  