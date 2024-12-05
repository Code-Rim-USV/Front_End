<template>
    <div>
        <label :for="label" class="exam-request-drop-label">{{ label }}</label>
        <select :id="label" v-model="selected" class="exam-request-drop-input">
            <option disabled value="">{{ placeholder }}</option>
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.text }}
            </option>
        </select>
    </div>
</template>

<script>
export default {
  name: "ExamRequestDropInput",
  props: {
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(option => option.hasOwnProperty('value') && option.hasOwnProperty('text'));
      },
    },
    modelValue: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "Selectează o opțiune",
    },
  },
  computed: {
    selected: {
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
    .exam-request-drop-label {
        font-size: 14px;
        margin-bottom: 8px;
        display: block;
        font-weight: bold;
    }

    .exam-request-drop-input {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border-radius: 4px;
        border: 1px solid #ccc;
        height: 80px;
        appearance: none;
    }

        .exam-request-drop-input:focus {
            border-color: #157def;
            outline: none;
        }
</style>
