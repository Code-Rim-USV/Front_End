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
            <th>Stare</th>
            <th>Acțiune</th>
          </tr>
        </thead>
        <tbody v-if="requests.length > 0">
          <tr v-for="request in requests" :key="request.requestID">
            <td>{{ request.subjectName }}</td>
            <td>{{ request.group }}</td>
            <td>{{ request.date }}</td>
            <td>{{ request.status }}</td>
            <td>
              <button @click="$emit('accept', request.requestID)" class="accept-btn">Acceptă</button>
              <button @click="$emit('reject', request.requestID)" class="reject-btn">Respingere</button>
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
  name: 'ExamRequestsGrid',
  props: {
    requests: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.exam-requests-grid {
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
