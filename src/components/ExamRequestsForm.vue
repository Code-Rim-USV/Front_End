<template>
  <div>
    <!-- Exam Request Form -->
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

    <!-- Error Overlay (for errors in exam request) -->
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
      errorMessage: null, // Store error message for the error overlay
    };
  },
  computed: {
    isFormInvalid() {
      return !this.material || !this.date;
    },
  },
  methods: {
    // Method to show error message in overlay
    showError(message) {
      this.errorMessage = message;
    },

    async addExam() {
      if (this.isFormInvalid) {
        return;
      }

      const userID = JSON.parse(localStorage.getItem('user'))?.userId;
      if (!userID) {
        this.showError("Utilizatorul nu a fost găsit.");
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

        // Optionally handle success here, if needed (like showing a success message)

      } catch (error) {
        const errorMessage = this.getErrorMessage(error);
        this.showError("A apărut o eroare la adăugarea examenului: " + errorMessage);
      }

      // Reset form
      this.material = "";
      this.date = "";
    },

    // Utility method to get detailed error message
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
/* Exam Request Form Styles */
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
