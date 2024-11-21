<template>
    <div class="exam-request-form">
        <div class="row">
            <ExamRequestDropInput class="input-column" label="Select Material" :options="materials" v-model="material"
                placeholder="Selectează materia" />
            <ExamRequestDropInput class="input-column" label="Select Professor" :options="professors"
                v-model="professor" placeholder="Selectează profesorul" />
            <ExamRequestDateInput class="input-column" label="Date" v-model="date" placeholder="Selectează data" />
            <button class="add-exam-button" @click="addExam" :disabled="isFormInvalid">
                Trimite Programare
            </button>
        </div>
        <p v-if="formStatus" class="form-status">{{ formStatus }}</p>
    </div>
</template>

<script>
import ExamRequestDropInput from "./ExamRequestDropInput.vue";
import ExamRequestDateInput from "./ExamRequestDateInput.vue";

export default {
    name: "ExamRequestsForm",
    components: {
        ExamRequestDropInput,
        ExamRequestDateInput,
    },
    data() {
        return {
            material: "",
            date: "",
            professor: "",
            materials: [
                { text: "Materia 1", value: "materia1" },
                { text: "Materia 2", value: "materia2" },
                { text: "Materia 3", value: "materia3" },
                { text: "Materia 4", value: "materia4" },
            ],
            professors: [
                { text: "Profesor A", value: "profA" },
                { text: "Profesor B", value: "profB" },
            ],
            formStatus: "",
        };
    },
    computed: {
        isFormInvalid() {
            return !this.material || !this.professor || !this.date;
        },
    },
    methods: {
        addExam() {
            if (this.isFormInvalid) {
                this.formStatus = "Completeaza toate campurile.";
                return;
            }
            console.log({
                material: this.material,
                date: this.date,
                professor: this.professor,
            });

            this.material = "";
            this.date = "";
            this.professor = "";
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
