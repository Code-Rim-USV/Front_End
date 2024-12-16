<template>
  <div class="professor-exams-grid">
    <h2>Examene</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Grupa</th>
            <th>Asistent</th>
            <th>Sala</th>
            <th>Data</th>
            <th>Ora</th>
            <th>Durata</th>
            <th>Editare</th>
          </tr>
        </thead>
        <tbody v-if="exams.length > 0">
          <tr v-for="exam in exams" :key="exam.examID">
            <td>{{ exam.subjectName }}</td>
            <td>{{ exam.group }}</td>
            <td>{{ exam.assistantName }}</td>
            <td>{{ exam.location }}</td>
            <td>{{ exam.date }}</td>
            <td>{{ exam.start_Time }}</td>
            <td>{{ exam.duration }}{{ exam.duration > 1 ? ' ore' : ' oră' }}</td>
            <td>
              <button @click="$emit('edit', exam)" class="edit-btn">
                <span class="material-icons">edit</span>
              </button>
            </td>
          </tr>
        </tbody>
        <p v-else>Nu sunt informații</p>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfessorExamsGrid',
  props: {
    exams: Array,
  },
  emits: ['edit'],  
};
</script>


<style scoped>
.professor-exams-grid {
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
  padding-bottom: 10px;
  padding: 0 20px;
}

tbody td {
  padding: 10px 10px;
  color: #333;
  width: 15%;
}

tbody tr {
  border-bottom: 1px solid #eee;
}

tbody tr:last-child {
  border-bottom: none;
}

.edit-btn {
  background-color: white;
  border: none;
  color: black;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn svg {
  margin-right: 5px;
}

.edit-btn:hover {
  background-color: black;
  color: white;
}
</style>
