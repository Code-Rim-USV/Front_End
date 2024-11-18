<template>
    <div class="schedule-exam-hour-input">
      <label for="timeInput">Ora</label>
      <div class="time-picker">
        <div class="time-input">
          <span class="material-icons">schedule</span>
          <input id="hoursInput" type="number" v-model="hours" min="1" max="12" @input="onTimeChange" class="hour-input"
            aria-label="Hours" />
          :
          <input id="minutesInput" type="number" v-model="minutes" min="0" max="59" @input="onTimeChange"
            class="minute-input" aria-label="Minutes" />
        </div>
        <div class="ampm-toggle">
          <button :class="{ active: isAM }" @click="toggleAMPM(true)" :aria-pressed="isAM.toString()">
            AM
          </button>
          <button :class="{ active: !isAM }" @click="toggleAMPM(false)" :aria-pressed="(!isAM).toString()">
            PM
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ScheduleExamHourInputComponent",
    data() {
      return {
        hours: 1,
        minutes: 0,
        isAM: true,
      };
    },
    watch: {
      hours(newVal) {
        this.hours = Math.min(12, Math.max(1, newVal));
      },
      minutes(newVal) {
        this.minutes = Math.min(59, Math.max(0, newVal));
      },
    },
    methods: {
      onTimeChange() {
        this.$emit("time-change", {
          hours: this.hours,
          minutes: this.minutes,
          isAM: this.isAM,
        });
      },
      toggleAMPM(isAM) {
        this.isAM = isAM;
      },
    },
  };
  </script>
  
  <style scoped>
  .schedule-exam-hour-input {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 80px;
  }
  
  .time-picker {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 4px;
    background-color: #f9f9f9;
  }
  
  .time-input {
    display: flex;
    align-items: center;
    margin-right: 10px;
    color: black;
  }
  
  .hour-input,
  .minute-input {
    width: 75px;
    padding: 4px;
    font-size: 16px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .ampm-toggle {
    display: flex;
  }
  
  .ampm-toggle button {
    padding: 4px 8px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    background-color: #ddd;
    border-radius: 4px;
    margin-left: 2px;
  }
  
  .ampm-toggle button.active {
    background-color: #007bff;
    color: white;
  }
  </style>
  