<template>
    <div class="sidebar">
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
          <li :class="{ active: activeItem === 'examScheduling' }" @click="setActive('examScheduling')">
            <span class="material-icons">schedule</span>
            <span>Programarea Examenelor</span>
          </li>
          <li :class="{ active: activeItem === 'rejectSchedules' }" @click="setActive('rejectSchedules')">
            <span class="material-icons">cancel</span>
            <span>Programări Respinse</span>
          </li>
        </ul>
      </nav>
      <div class="logout" @click="logout">
        <span class="material-icons">logout</span>
        <span>Deconectare</span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "GroupLeaderSidebarComponent", 
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
  .sidebar {
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
    color: #333;
    cursor: pointer;
    transition: background-color 0.2s, color 0.2s;
    width: 100%;
  }
  
  nav ul li.active,
  nav ul li:hover {
    background-color: #eff6ff;
    color: #157def;
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