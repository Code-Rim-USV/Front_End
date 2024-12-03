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
        <tbody v-if="rejectedExams.length > 0">
          <tr v-for="exam in rejectedExams" :key="exam.id">
            <td>{{ exam.subjectName }}</td>
            <td>{{ exam.professorName }}</td>
            <td>{{ exam.date }}</td>
            <td>
              <div class="rejected-status">Respins</div>
            </td>
            <td>{{ exam.rejectionReason }}</td>
          </tr>
        </tbody>
        <p v-else>Nu sunt informații</p>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamsGrid',
  props: {
    rejectedExams: Array,
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
  height: 40%;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: black;
}

p {
  font-size: 1.5em;
  margin-top: 20px;
  margin-left: 20px;
  color: rgb(46, 45, 45);
  font-family: 'Courier New', Courier, monospace;
}

.table-container {
  overflow-y: auto;
  height: 80%;
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
