<template>
  <div class="input-group">
    <label>{{ label }}</label>
    <div class="input-wrapper">
      <input
        :type="inputType"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <button
        v-if="showToggle"
        type="button"
        @click="togglePasswordVisibility"
        class="toggle-button"
        aria-label="Vezi parola"
      >
        <span v-if="isPasswordVisible">👁️</span>
        <span v-else>👁️‍🗨️</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  props: {
    label: String,
    type: {
      type: String,
      default: "text",
    },
    placeholder: String,
    modelValue: [String, Number],
    showToggle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isPasswordVisible: false,
    };
  },
  computed: {
    inputType() {
      return this.showToggle && this.isPasswordVisible ? "text" : this.type;
    },
    inputValue: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit("update:modelValue", value);
      },
    },
  },
  methods: {
    togglePasswordVisibility() {
      this.isPasswordVisible = !this.isPasswordVisible;
    },
  },
};
</script>

<style scoped>
.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.4rem;
  color: #333;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.toggle-button {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}
</style>
