d   <template>
    <div v-if="show" class="confirm-dialog-overlay">
      <div class="confirm-dialog">
        <div class="confirm-dialog-content">
          <h3>{{ title }}</h3>
          <p>{{ message }}</p>
        </div>
        <div class="confirm-dialog-actions">
          <button class="btn-cancel" @click="$emit('cancel')">Anulare</button>
          <button class="btn-confirm" @click="$emit('confirm')">Confirmare</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmDialog',
    props: {
      show: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Confirmare'
      },
      message: {
        type: String,
        default: 'Sunteți sigur?'
      }
    }
  }
  </script>
  
  <style scoped>
  .confirm-dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }
  
  .confirm-dialog {
    background: white;
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .confirm-dialog-content {
    margin-bottom: 20px;
  }
  
  .confirm-dialog-content h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 1.2em;
  }
  
  .confirm-dialog-content p {
    margin: 0;
    color: #666;
  }
  
  .confirm-dialog-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  button {
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .btn-cancel {
    background-color: #f0f0f0;
    color: #333;
  }
  
  .btn-cancel:hover {
    background-color: #e0e0e0;
  }
  
  .btn-confirm {
    background-color: #157def;
    color: white;
  }
  
  .btn-confirm:hover {
    background-color: #1266d3;
  }
  </style> 