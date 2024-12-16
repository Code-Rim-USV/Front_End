<template>
  <div>
    <!-- Settings Form -->
    <div class="settings-container">
      <h2>SETĂRI</h2>

      <div class="input-group">
        <label for="username" class="input-label">Nume utilizator</label>
        <input type="text" id="username" v-model="username" class="input-field" disabled />
      </div>

      <div class="input-group">
        <label for="role" class="input-label">Rol</label>
        <input type="text" id="role" v-model="role" class="input-field" disabled />
      </div>

      <div class="input-group">
        <label for="email" class="input-label">Email</label>
        <input type="email" id="email" v-model="email" class="input-field" disabled />
      </div>

      <div class="input-group">
        <label for="newPassword" class="input-label">Parolă nouă</label>
        <input type="password" id="newPassword" v-model="password" class="input-field" placeholder="Introduceți parola" />
      </div>

      <!-- Save Button (Centered) -->
      <div class="save-button-container">
        <button class="save-button" @click="saveSettings" :disabled="isFormInvalid || !isPasswordChanged">
          Salvează
        </button>
      </div>
    </div>

    <!-- Error Overlay (for errors in form submission) -->
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
export default {
  data() {
    return {
      username: '',
      role: '',
      email: '',
      password: '',
      originalPassword: '', // Store the initial value of the password field
      errorMessage: null // Store error message for the error overlay
    };
  },
  computed: {
    isFormInvalid() {
      return !this.password; // Button will be disabled if password is empty
    },
    isPasswordChanged() {
      // Button is enabled only if password is changed
      return this.password !== this.originalPassword;
    }
  },
  methods: {
    saveSettings() {
      if (this.isFormInvalid) {
        this.showError("Parola nu poate fi goală.");
        return;
      }

      // Simulate a potential error from the server (this is just for demo purposes)
      // In a real scenario, this would be replaced with an actual API call
      const isError = Math.random() < 0.5; // Randomly simulate error

      if (isError) {
        this.showError("A apărut o eroare la salvarea setărilor.");
      } else {
        // Success case (you can replace this with actual saving logic)
        console.log("Settings saved successfully.");
        this.originalPassword = this.password; // Update the original password to the new value
      }
    },

    // Method to show error message in overlay
    showError(message) {
      this.errorMessage = message;
    }
  }
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
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.input-field:focus {
  outline: none;
  border-color: #4caf50;
}

/* Disabled Input Styles */
.input-field:disabled {
  background-color: #f1f1f1;
  cursor: not-allowed; /* Change cursor to no entry sign */
  color: #ccc;
  border-color: #ddd;
}

/* Save Button Styles */
.save-button-container {
  display: flex;
  justify-content: center; /* Center the button */
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
