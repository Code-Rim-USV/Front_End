<template>
    <div>
        <label :for="label" class="exam-request-date-label">{{ label }}</label>
        <input id="exam-request-date-input" type="date" v-model="selectedDate" :placeholder="placeholder"
               class="exam-request-date-input" />
    </div>
</template>

<script>
export default {
  name: "ExamRequestDateInput",
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: String,
      default: "",
      validator(value) {
        // Date format (yyyy-mm-dd)
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(value);
      }
    },
    placeholder: {
      type: String,
      default: "Selectează o dată",
    },
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
    .exam-request-date-input {
        width: 100%;
        height: 80px;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 16px;
    }

    .exam-request-date-label {
        font-size: 14px;
        margin-bottom: 8px;
        display: block;
        font-weight: bold;
    }

    .exam-request-date-input:focus {
        border-color: #157def;
        outline: none;
    }
</style>
