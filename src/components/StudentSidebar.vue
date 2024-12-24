<template>
    <div class="student-sidebar">
      <div class="logo">
        <img src="../assets/LogoUSV.png" alt="USV Logo" />
        <span>
          <h2>USV FIESC</h2>
        </span>
      </div>
      <nav>
        <ul>
          <li :class="{ active: activeItem === 'calendar' }" @click="setActive('calendar')">
            <span class="material-icons">calendar_today</span>
            <span>Calendar</span>
          </li>
        </ul>
      </nav>
      <div class="actions">
        <div class="settings" @click="setActive('settings')">
          <span class="material-icons">settings</span>
          <span>Setari</span>
        </div>
        <div class="logout" @click="logout">
          <span class="material-icons">logout</span>
          <span>Deconectare</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "StudentSidebarComponent", 
    data() {
      return {
        activeItem: "calendar", 
      };
    },
    methods: {
      setActive(tab) {
        this.activeItem = tab;
        this.$emit('changeComponent', tab);
      },
      logout() {
        localStorage.removeItem('user');  
  
        this.$router.push({ name: 'LoginView' });  
      },
    },
  };
  </script>
  
  <style scoped>
  .student-sidebar {
    width: 15%;
    background-color: #fff;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    height: 100vh;
    box-shadow: 1px 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .logo img {
    height: 40px;
    margin-right: 10px;
  }
  
  .logo span {
    font-weight: bold;
    font-size: 18px;
    color: #333;
  }

  .actions {
  margin-top: auto;
  width: 100%;
}

  .settings,
.logout {
  display: flex;
  align-items: center;
  padding: 10px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
}

.settings:hover,
.logout:hover {
  background-color: #e6f0ff;
}

.settings .material-icons,
.logout .material-icons {
  margin-right: 10px;
}
  
  nav {
    width: 100%;
  }
  
  nav ul {
    list-style-type: none;
    padding: 0;
    width: 100%;
  }
  
  nav ul li {
    display: flex;
    align-items: center;
    padding: 10px;
    font-size: 16px;
    color: #157def;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }
  
  nav ul li.active,
  nav ul li:hover {
    background-color: #eff6ff;
  }
  
  nav ul li .material-icons {
    margin-right: 10px;
  }
  
  .logout {
    margin-top: auto;
    display: flex;
    align-items: center;
    padding: 10px;
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }
  
  .logout:hover {
    background-color: #e6f0ff;
  }
  
  .logout .material-icons {
    margin-right: 10px;
  }
  </style>
  