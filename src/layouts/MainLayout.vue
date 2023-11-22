<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container-fluid">
        <div class="navbar-nav me-auto">
          <a class="navbar-brand" href="#">Twitter</a>
        </div>
        <div class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="#" @click="logout">Logout</a>
          </li>
        </div>
      </div>
    </nav>
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-md-3">
          <!-- Sidebar -->
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Sidebar</h5>
              <!-- Add sidebar content -->
              <ul class="list-group">
                <li class="list-group-item"><a class="btn btn-dark btn-sm w-100" href="#">Profile</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-5">
            <RouterView />
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Trending</h5>
              <ul class="list-group">
                <li class="list-group-item">Hashtag 1</li>
                <li class="list-group-item">Hashtag 2</li>
                <li class="list-group-item">Hashtag 3</li>
                <li class="list-group-item">Hashtag 4</li>
                <li class="list-group-item">Hashtag 5</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  <script>
  // Import the API functions
  import { apiGet, apiPost, apiLogout } from '../api';
  
  export default {
    data() {
      let userData = sessionStorage.getItem('user');
      let user;
      if (userData !== null) {
          // Parse userData if it's not null
          try {
              user = JSON.parse(userData);
          } catch (error) {
              console.error("Error parsing user data from sessionStorage:", error);
              user = {};
          }
      } else {
          // Set user to an empty object if userData is null
          user = {};
      }
      return {
        user_id: user._id || '',
      };
    },
    async created() {
    },
    methods: {
      async logout() {
        try {
          await apiLogout();
          this.$router.push('/login');
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }
    }
  };
  </script>
  