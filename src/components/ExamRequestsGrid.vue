<template>
  <div class="exam-requests-grid">
    <h2>Solicitări Examene</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Materia</th>
            <th>Grupa</th>
            <th>Data</th>
            <th>Status</th>
            <th>Acțiune</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id">
            <td>{{ exam.material }}</td>
            <td>{{ exam.group }}</td>
            <td>{{ exam.date }}</td>
            <td>{{ exam.status }}</td>
            <td>
              <button @click="$emit('accept', exam.id)" class="accept-btn">Accept</button>
              <button @click="$emit('reject', exam.id)" class="reject-btn">Respingere</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamRequestsGridComponent',
  data() {
    return {
      exams: [
        { id: 1, material: 'Sisteme Inteligente', group: '3141', date: '22.11.2024', status: 'În progres' },
        { id: 2, material: 'Baze de Date', group: '3142', date: '25.11.2024', status: 'În progres' },
        { id: 3, material: 'Algoritmi și Structuri de Date', group: '3143', date: '27.11.2024', status: 'În progres' },
        { id: 4, material: 'Tehnologii Web', group: '3144', date: '29.11.2024', status: 'În progres' },
        { id: 5, material: 'Calculatoare Paralele', group: '3121', date: '03.12.2024', status: 'În progres' },
        { id: 6, material: 'Rețele de Calculatoare', group: '3131', date: '06.12.2024', status: 'În progres' },
        { id: 7, material: 'Sisteme de Operare', group: '3114', date: '10.12.2024', status: 'În progres' },
      ],
    };
  },
};
</script>

<style scoped>
.exam-requests-grid {
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

button {
  padding: 8px 12px;
  font-size: 0.9em;
  margin: 5px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.accept-btn {
  background-color: #4caf50;
  color: white;
  border-radius: 10px;
}

.reject-btn {
  background-color: #f44336;
  color: white;
  border-radius: 10px;
}

button:hover {
  opacity: 0.8;
}
</style>
