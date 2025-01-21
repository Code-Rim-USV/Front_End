<template>
  <div>
    <div class="settings-container">
      <h2>SETĂRI</h2>
      <div class="input-group">
        <label for="username" class="input-label">Nume utilizator</label>
        <input type="text" id="username" :value="username" class="input-field" disabled />
      </div>

      <div class="input-group">
        <label for="role" class="input-label">Rol</label>
        <input type="text" id="role" :value="role" class="input-field" disabled />
      </div>

      <div class="input-group">
        <label for="email" class="input-label">Email</label>
        <input type="email" id="email" :value="email" class="input-field" disabled />
      </div>

      <div class="input-group">
        <label for="oldPassword" class="input-label">Parolă curentă</label>
        <input
          type="password"
          id="oldPassword"
          v-model="oldPassword"
          class="input-field"
          placeholder="Introduceți parola curentă"
        />
      </div>

      <div class="input-group">
        <label for="newPassword" class="input-label">Parolă nouă</label>
        <input
          type="password"
          id="newPassword"
          v-model="newPassword"
          class="input-field"
          placeholder="Introduceți parola nouă"
        />
      </div>

      <div class="save-button-container">
        <button class="save-button" @click="saveSettings" :disabled="!isPasswordValid">
          Salvează
        </button>
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

    <!-- Success Overlay -->
    <div v-if="successMessage" class="success-overlay">
      <div class="success-content">
        <div class="success-header">
          <div @click="successMessage = null" class="success-close-btn">
            ✔
          </div>
        </div>
        <span class="success-message">{{ successMessage }}</span>
        <button @click="successMessage = null" class="success-ok-btn">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api';

export default {
  props: {
    username: String,
    role: String,
    email: String,
    userId: Number,
  },
  emits: ['passwordChanged'],
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      errorMessage: null,
      successMessage: null,
    };
  },
  computed: {
    isPasswordValid() {
      return this.oldPassword !== '' && this.newPassword !== '' && this.oldPassword !== this.newPassword;
    },
  },
  methods: {
    showError(message) {
      this.errorMessage = message;
    },

    showSuccess(message) {
      this.successMessage = message;
    },

    async saveSettings() {
      try {
        if (!this.isPasswordValid) {
          this.showError('Vă rugăm completați ambele câmpuri cu parole diferite');
          return;
        }

        const payload = {
          UserID: this.userId,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        };

        await api.put(`/Users/PutPassword/${this.userId}`, payload);
        
        // Clear the password fields
        this.oldPassword = '';
        this.newPassword = '';
        this.errorMessage = null;
        
        // Show success message
        this.showSuccess('Parola a fost schimbată cu succes!');
      } catch (error) {
        const errorMessage = this.getErrorMessage(error);
        this.showError(errorMessage);
      }
    },

    getErrorMessage(error) {
      if (error.response) {
        return error.response.data.message || error.response.statusText;
      } else if (error.request) {
        return 'Eroare de rețea: Nu am putut să te conectăm la server.';
      } else {
        return `${error.message}`;
      }
    },
  },
};
</script>

<style scoped>
.settings-container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
  height: auto;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: black;
  text-align: left;
}

.input-group {
  margin-bottom: 15px;
  width: 100%;
}

.input-label {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.input-field {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #949292;
  border-radius: 4px;
  width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: #4caf50;
}

.input-field:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed;
  color: #949292;
  border-color: #ddd;
}

.save-button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-button {
  width: auto;
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-button:hover {
  background-color: #333;
}

.save-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

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

.error-message-local {
  display: none;
}

.success-overlay {
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

.success-content {
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

.success-header {
  position: relative;
  width: 100%;
  margin-top: 30px;
}

.success-close-btn {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4CAF50;
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

.success-message {
  font-size: 16px;
  color: #4CAF50;
  margin-bottom: 20px;
  flex-grow: 1;
}

.success-ok-btn {
  background-color: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
}

.success-ok-btn:hover {
  background-color: #f0f0f0;
}
</style>
