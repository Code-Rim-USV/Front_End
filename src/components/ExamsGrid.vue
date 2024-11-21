<template>
  <div class="exams-grid">
    <h2>Examene</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Profesor</th>
            <th>Asistent</th>
            <th>Sala</th>
            <th>Data</th>
            <th>Ora</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamically populated rows from the exams list -->
          <tr v-for="exam in exams" :key="exam.id">
            <td>{{ exam.material }}</td>
            <td>{{ exam.professor }}</td>
            <td>{{ exam.assistant }}</td>
            <td>{{ exam.room }}</td>
            <td>{{ exam.date }}</td>
            <td>{{ exam.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamsGridComponent',
  data() {
    return {
      exams: [
        { id: 1, material: 'Sisteme Inteligente', professor: 'Turcu Corneliu', assistant: 'Ovidiu Gherman', room: 'C202', date: '22.11.2024', time: '12:00' },
        { id: 2, material: 'Baze de Date', professor: 'Ionescu Ana', assistant: 'Marin Bogdan', room: 'C203', date: '25.11.2024', time: '14:00' },
        { id: 3, material: 'Algoritmi și Structuri de Date', professor: 'Popescu Mihai', assistant: 'Sima Elena', room: 'C204', date: '27.11.2024', time: '09:00' },
        { id: 4, material: 'Tehnologii Web', professor: 'Stanescu Radu', assistant: 'Gheorghe Ion', room: 'C205', date: '29.11.2024', time: '10:00' },
        { id: 5, material: 'Calculatoare Paralele', professor: 'Ilie Vasile', assistant: 'Petrache Clara', room: 'C206', date: '03.12.2024', time: '15:00' },
        { id: 6, material: 'Rețele de Calculatoare', professor: 'Mihaila George', assistant: 'Munteanu Daniel', room: 'C207', date: '06.12.2024', time: '11:00' },
        { id: 7, material: 'Sisteme de Operare', professor: 'Dima Alina', assistant: 'Lupu Florin', room: 'C208', date: '10.12.2024', time: '13:00' },
      ],
    };
  },
};
</script>

<style scoped>
.exams-grid {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: black;
}

.table-container {
  max-height: 30vh;
  overflow-y: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  text-align: left;
  font-weight: normal;
  color: #b0b0b0;
  padding-bottom: 10px;
  padding: 0 20px;
}

tbody td {
  padding: 10px 20px;
  color: #333;
}

tbody tr {
  border-bottom: 1px solid #eee;
}

tbody tr:last-child {
  border-bottom: none;
}

.grid-line {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 2px;
  background-color: #b0b0b0;
}
</style>
