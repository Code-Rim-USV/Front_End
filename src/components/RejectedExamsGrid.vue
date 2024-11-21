<template>
  <div class="rejected-exams-grid">
    <h2>Examene Respinse</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Profesor</th>
            <th>Data</th>
            <th>Status</th>
            <th>Motivul Respingerii</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in rejectedExams" :key="exam.id">
            <td>{{ exam.material }}</td>
            <td>{{ exam.professor }}</td>
            <td>{{ exam.date }}</td>
            <td>
              <div class="rejected-status">Respins</div>
            </td>
            <td>{{ exam.rejectionReason }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RejectedExamsGridComponent',
  data() {
    return {
      rejectedExams: [
        { id: 1, material: 'Matematică Discretă', professor: 'Popescu Adrian', date: '01.12.2024', rejectionReason: 'Programare suprapusă' },
        { id: 2, material: 'Programare Orientată pe Obiecte', professor: 'Mihailescu Andreea', date: '03.12.2024', rejectionReason: 'Motiv administrativ' },
        { id: 3, material: 'Sisteme de Operare', professor: 'Dima Alexandru', date: '05.12.2024', rejectionReason: 'Neconformitate program' },
        { id: 4, material: 'Analiză Numerică', professor: 'Ionescu Daniela', date: '08.12.2024', rejectionReason: 'Conflicte de resurse' },
        { id: 5, material: 'Teoria Grafurilor', professor: 'Georgescu Valentin', date: '10.12.2024', rejectionReason: 'Număr insuficient de săli' },
      ],
    };
  },
};
</script>

<style scoped>
.rejected-exams-grid {
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
  height: 80vh;
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
  padding: 0 20px;
  padding-bottom: 10px;
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

.rejected-status {
  color: #f31800;
}
</style>
