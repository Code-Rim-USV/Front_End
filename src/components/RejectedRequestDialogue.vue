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
  </template>
  
  <script>
  import axios from 'axios';
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
      };
    },
    methods: {
      async rejectExam() {
        try {
          const payload = {
            requestID: this.requestID,
            rejectionReason: this.rejectionReason,
          };
          console.log(payload); // Verifică payload-ul înainte de a-l trimite
  
          // Trimite cererea de respingere către API
          const response = await api.put(`/Requests/PutRejected/${this.requestID}`, payload);
  
          if (response.status === 204) {
            alert('Examenul a fost respins cu succes!');
            this.$emit('close');
          }
        } catch (error) {
          console.error('Eroare la respingerea examenului:', error);
          alert('A apărut o eroare la respingerea examenului. Vă rugăm să încercați din nou.');
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
  </style>
  