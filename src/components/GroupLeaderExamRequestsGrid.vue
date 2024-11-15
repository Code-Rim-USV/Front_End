<template>
  <div class="exams-grid">
    <h2>Cereri in procesare</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Profesor</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- Dynamically populated rows from the exams list -->
          <tr v-for="exam in exams" :key="exam.id">
            <td>{{ exam.material }}</td>
            <td>{{ exam.professor }}</td>
            <td>{{ exam.date }}</td>
            <td>
              <div class="process">In proces</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupLeaderExamRequestsGridComponent',
  data() {
    return {
      exams: [
        { id: 1, material: 'Matematică Discretă', professor: 'Popescu Adrian', date: '01.12.2024' },
        { id: 2, material: 'Programare Orientată pe Obiecte', professor: 'Mihailescu Andreea', date: '03.12.2024' },
        { id: 3, material: 'Sisteme de Operare', professor: 'Dima Alexandru', date: '05.12.2024' },
        { id: 4, material: 'Analiză Numerică', professor: 'Ionescu Daniela', date: '08.12.2024' },
        { id: 5, material: 'Teoria Grafurilor', professor: 'Georgescu Valentin', date: '10.12.2024' },
        { id: 6, material: 'Calcul Numeric', professor: 'Popa Gabriela', date: '12.12.2024' },
        { id: 7, material: 'Ingineria Programării', professor: 'Stan Mariana', date: '15.12.2024' },
      ],
    };
  },
};
</script>

<style scoped>
.exams-grid {
  width: 90%;
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
  max-height: 300px;
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

.process {
  color: #d6882e;
}
</style>
