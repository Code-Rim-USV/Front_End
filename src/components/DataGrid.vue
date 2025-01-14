<template>
  <div class="data-grid">
    <h2>{{ title }} <span class="last-updated">(Ultima actualizare: {{ lastUpdated }})</span></h2>
    
    <!-- Export button for exam grids -->
    <button v-if="showExport" @click="exportToCSV" class="export-btn">
      <span class="material-icons">download</span>
      Export CSV
    </button>

    <div class="table-container">
      <table v-if="data && data.length > 0">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header.key">{{ header.label }}</th>
            <th v-if="actions && actions.length > 0">Acțiune</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id || item.requestID || item.examID">
            <td v-for="header in headers" :key="header.key">
              <template v-if="header.key === 'status'">
                <div :class="getStatusClass(item[header.key])">
                  {{ getStatusText(item[header.key]) }}
                </div>
              </template>
              <template v-else-if="header.key === 'duration'">
                {{ item[header.key] }}{{ item[header.key] > 1 ? ' ore' : ' oră' }}
              </template>
              <template v-else>
                {{ item[header.key] }}
              </template>
            </td>
            <td v-if="actions && actions.length > 0" class="actions-cell">
              <template v-if="actions.includes('edit')">
                <button @click="$emit('edit', item.examID)" class="action-btn edit-btn">
                  <span class="material-icons">edit</span>
                </button>
              </template>
              <template v-if="actions.includes('accept-reject')">
                <button @click="$emit('accept', item.requestID)" class="action-btn accept-btn">
                  Acceptă
                </button>
                <button @click="$emit('reject', item.requestID)" class="action-btn reject-btn">
                  Respingere
                </button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-data">Nu sunt informații</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataGrid',
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    headers: {
      type: Array,
      required: true
    },
    actions: {
      type: Array,
      default: () => []
    },
    showExport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lastUpdated: new Date().toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      })
    };
  },
  methods: {
    getStatusClass(status) {
      return {
        'status-pending': status === 'Pending' || status === 'În proces',
        'status-rejected': status === 'Rejected' || status === 'Respins'
      };
    },
    getStatusText(status) {
      const statusMap = {
        'Pending': 'În proces',
        'Rejected': 'Respins',
        'În proces': 'În proces',
        'Respins': 'Respins'
      };
      return statusMap[status] || status;
    },
    exportToCSV() {
      const csvData = this.data.map(item => 
        this.headers.map(header => {
          if (header.key === 'duration') {
            return `${item[header.key]}${item[header.key] > 1 ? ' ore' : ' oră'}`;
          }
          return item[header.key];
        })
      );
      
      csvData.unshift(this.headers.map(header => header.label));
      
      const csvString = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${this.title.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  watch: {
    data() {
      this.lastUpdated = new Date().toLocaleTimeString('ro-RO', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    }
  }
};
</script>

<style scoped>
.data-grid {
  width: 100%;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  position: relative;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: bold;
}

.last-updated {
  font-size: 0.8rem;
  color: #666;
  font-weight: normal;
}

.export-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.export-btn:hover {
  background-color: #45a049;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  margin-top: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

th {
  background-color: #f3f4f6;
  font-weight: 600;
  color: #374151;
}

tr:hover {
  background-color: #f9fafb;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #6b7280;
  font-size: 1.1rem;
  background-color: white;
  border-radius: 8px;
  border: 2px dashed #e5e7eb;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: flex-start;
  align-items: center;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.edit-btn {
  background-color: #f3f4f6;
  color: #374151;
}

.edit-btn:hover {
  background-color: #e5e7eb;
}

.accept-btn {
  background-color: #4caf50;
  color: white;
}

.accept-btn:hover {
  background-color: #45a049;
}

.reject-btn {
  background-color: #f44336;
  color: white;
}

.reject-btn:hover {
  background-color: #da190b;
}

.status-pending {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fef3c7;
  color: #92400e;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.status-rejected {
  display: inline-block;
  padding: 4px 12px;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}
</style> 