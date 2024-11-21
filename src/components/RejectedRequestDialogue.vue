<template>
    <div class="rejection-dialog-overlay">
        <div class="rejection-dialog-container">
            <h2>Motivul respingerii</h2>
            <div class="input-area">
                <textarea placeholder="Introduceți motivul respingerii" v-model="rejectionReason"></textarea>
            </div>
            <div class="dialog-buttons">
                <button class="confirm-btn" @click="confirmRejection">Confirmare</button>
                <button class="cancel-btn" @click="cancelRejection">Anulare</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'RejectionReasonDialogComponent',
    props: ['examId'],
    data() {
        return {
            rejectionReason: '',
        };
    },
    methods: {
        confirmRejection() {
            this.$emit('confirm-rejection', { examId: this.examId, rejectionReason: this.rejectionReason });
            this.closeDialog();
        },
        cancelRejection() {
            this.closeDialog();
        },
        closeDialog() {
            this.$emit('close');
        },
    },
};
</script>

<style scoped>
.rejection-dialog-overlay {
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

.rejection-dialog-container {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 50%;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    color: black;
}

h2 {
    text-align: center;
}

.input-area {
    margin: 20px 0;
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

.dialog-buttons {
    margin-top: 10px;
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