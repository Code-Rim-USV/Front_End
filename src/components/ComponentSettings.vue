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
        <label for="newPassword" class="input-label">Parolă nouă</label>
        <input
          type="password"
          id="newPassword"
          v-model="password"
          class="input-field"
          placeholder="Introduceți parola"
        />
      </div>

      <div class="save-button-container">
        <button class="save-button" @click="saveSettings" :disabled="!isPasswordChanged">
          Salvează
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    username: String,
    role: String,
    email: String,
    originalPassword: String,
  },
  emits: ['saveSettings'],
  data() {
    return {
      password: '',
    };
  },
  computed: {
    isPasswordChanged() {
      return this.password !== this.originalPassword && this.password !== '';
    },
  },
  methods: {
    saveSettings() {
      this.$emit('saveSettings', {
        username: this.username,
        role: this.role,
        email: this.email,
        password: this.password,
      });
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
</style>
