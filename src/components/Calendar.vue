<template>
  <div class="calendar-container">
    <!-- First Calendar (Current Month) -->
    <div class="calendar">
      <div class="calendar-header">
        <span class="calendar-title">
          <h2>{{ calendarTitle }}</h2>
        </span>
      </div>
      <div class="calendar-grid">
        <table class="calendar-table">
          <thead>
            <tr>
              <th v-for="day in days" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, weekIndex) in firstMonthWeeks" :key="weekIndex">
              <td v-for="day in week" :key="day" class="calendar-cell">
                <div v-if="day" :class="['day', { highlighted: day.highlighted, gray: !day.current }]">
                  {{ day.date }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Second Calendar (Next Month) -->
    <div class="calendar">
      <div class="calendar-header">
        <span class="calendar-title">
          <h2>{{ nextMonthTitle }}</h2>
        </span>
        <div class="calendar-nav">
          <button @click="changeMonth(-1)" class="calendar-btn" aria-label="calendar backward">‹</button>
          <button @click="changeMonth(1)" class="calendar-btn" aria-label="calendar forward">›</button>
        </div>
      </div>
      <div class="calendar-grid">
        <table class="calendar-table">
          <thead>
            <tr>
              <th v-for="day in days" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, weekIndex) in secondMonthWeeks" :key="weekIndex">
              <td v-for="day in week" :key="day" class="calendar-cell">
                <div v-if="day" :class="['day', { highlighted: day.highlighted, gray: !day.current }]">
                  {{ day.date }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
    examDates: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    const now = new Date();
    return {
      days: ['LUN', 'MAR', 'MIE', 'JOI', 'VIN', 'SAM', 'DUM'],
      currentMonth: now.getMonth(),
      currentYear: now.getFullYear(),
    };
  },
  computed: {
    calendarTitle() {
      return `${new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' })} ${this.currentYear}`;
    },
    nextMonthTitle() {
      const nextMonth = this.currentMonth + 1;
      const nextYear = nextMonth > 11 ? this.currentYear + 1 : this.currentYear;
      return `${new Date(nextYear, nextMonth % 12).toLocaleString('default', { month: 'long' })} ${nextYear}`;
    },
    firstMonthWeeks() {
      return this.generateCalendarWeeks(this.currentYear, this.currentMonth);
    },
    secondMonthWeeks() {
      const nextMonth = this.currentMonth + 1;
      const nextYear = nextMonth > 11 ? this.currentYear + 1 : this.currentYear;
      return this.generateCalendarWeeks(nextYear, nextMonth % 12);
    }
  },
  methods: {
    generateCalendarWeeks(year, month) {
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const weeks = [];
      let week = [];
      let day = 1;

      // Adaugă zilele din luna precedentă
      const daysFromPrevMonth = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
      for (let i = daysFromPrevMonth; i > 0; i--) {
        week.push({ date: new Date(year, month, -i + 1).getDate(), current: false });
      }

      // Adaugă zilele din luna curentă
      while (day <= daysInMonth) {
        week.push({ date: day++, current: true });
        if (week.length === 7) {
          weeks.push(week);
          week = [];
        }
      }

      // Adaugă zilele din luna următoare
      let nextMonthDay = 1;
      while (week.length < 7) {
        week.push({ date: nextMonthDay++, current: false });
      }
      weeks.push(week);

      // Marchează zilele cu examene
      this.markExamDays(weeks, year, month);

      return weeks;
    },
    markExamDays(weeks, year, month) {
      this.examDates.forEach(exam => {
        const [day, monthExam, yearExam] = exam.date.split('.').map(Number); // Ajustează formatul dacă e diferit
        if (year === yearExam && month === monthExam - 1) {
          weeks.forEach(week => {
            week.forEach(dayItem => {
              if (dayItem.current && dayItem.date === day) {
                dayItem.highlighted = true;
              }
            });
          });
        }
      });
    },
    changeMonth(direction) {
      this.currentMonth += direction;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
    }
  }
};
</script>


<style scoped>
.calendar-container {
  display: flex;
  gap: 1em;
  justify-content: center;
  padding: 0.5em;
  background-color: #f4f4f4;
  width: 80%;
}

.calendar {
  width: 100%;
  color: black;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  padding: 1em;
  font-weight: bold;
}

.calendar-title {
  font-size: 1.2em;
}

.calendar-nav {
  display: flex;
  gap: 7px;
}

.calendar-btn {
  font-size: 1.2em;
  background: none;
  border: none;
  cursor: pointer;
}

.calendar-grid {
  padding: 1em;
}

.calendar-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 3px;
}

.calendar-table th,
.calendar-table td {
  width: 14.2%;
  text-align: center;
}

.calendar-cell {
  height: 30px;
  width: 30px;
}

.day {
  padding: 12px;
  border-radius: 14px;
}

.day.highlighted {
  background-color: #157def;
  color: white;
}

.day.gray {
  color: rgb(206, 206, 206);
}
</style>