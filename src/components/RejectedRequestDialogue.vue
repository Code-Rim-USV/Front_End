<template>
  <div class="dialogue-overlay">
    <div class="dialogue-container">
      <h2>Motivul respingerii</h2>
      <div class="input-area">
        <textarea placeholder="Introduceți motivul respingerii" v-model="rejectionReason"></textarea>
      </div>
      <div class="dialogue-buttons">
        <button class="confirm-btn" @click="rejectExam">Confirmare</button>
        <button class="cancel-btn" @click="$emit('close')">Anulare</button>
      </div>
    </div>
  </div>

  <!-- Error Overlay (for rejection error) -->
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
import api from '@/services/api';

export default {
  name: 'RejectedDialogue',
  props: {
    requestID: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rejectionReason: '',
      errorMessage: null, // Store error message for the error overlay
    };
  },
  methods: {
    // Method to show error message in overlay
    showError(message) {
      this.errorMessage = message;
    },

    async rejectExam() {
      try {
        const payload = {
          requestID: this.requestID,
          rejectionReason: this.rejectionReason,
        };

        const response = await api.put(`/Requests/PutRejected/${this.requestID}`, payload);

        if (response.status === 204) {
          this.$emit('close');
        }
      } catch (error) {
        const errorMessage = this.getErrorMessage(error);
        this.showError('A apărut o eroare la respingerea examenului: ' + errorMessage);
      }
    },

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

textarea {
  width: 100%;
  height: 15vh;
  margin-top: 10px;
  padding: 8px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
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
