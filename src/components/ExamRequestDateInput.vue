<template>
    <div class="date-input-container">
        <label :for="inputId" class="date-input__label">{{ label }}</label>
        <input 
            :id="inputId"
            type="date" 
            v-model="selectedDate" 
            :placeholder="placeholder"
            class="date-input__field" 
        />
    </div>
</template>

<script>
/**
 * A reusable date input component for exam requests
 * Supports v-model binding and validation
 */
export default {
    name: "ExamRequestDateInput",
    props: {
        // Input label text
        label: {
            type: String,
            required: true,
        },
        // v-model value
        modelValue: {
            type: String,
            default: "",
            validator(value) {
                if (!value) return true;
                // Validate date format (YYYY-MM-DD)
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                return dateRegex.test(value);
            }
        },
        // Input placeholder text
        placeholder: {
            type: String,
            default: "Selectați o dată",
        },
        // Unique ID for the input field
        inputId: {
            type: String,
            default: "exam-date-input"
        }
    },
    computed: {
        selectedDate: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
};
</script>

<style scoped>
.date-input-container {
    margin-bottom: 1rem;
}

.date-input__field {
    width: 100%;
    height: 48px;
    padding: 0.625rem;
    border-radius: 4px;
    border: 1px solid var(--border-color, #ccc);
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.date-input__label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    display: block;
    font-weight: 600;
    color: var(--text-color, #333);
}

.date-input__field:focus {
    border-color: var(--primary-color, #157def);
    outline: none;
    box-shadow: 0 0 0 2px rgba(21, 125, 239, 0.1);
}
</style>
