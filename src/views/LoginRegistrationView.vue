<template>
    <div class="row justify-content-center mt-5">
      <div class="col-md-4">
        <ul class="nav nav-tabs">
            <li class="nav-item"> <a class="nav-link" :class="{ active: currentTab === 'login' }" @click="currentTab = 'login'">Login</a> </li>
            <li class="nav-item"> <a class="nav-link" :class="{ active: currentTab === 'register' }" @click="currentTab = 'register'">Register</a> </li>
        </ul>
        <div class="tab-content" id="myTabContent">
          <div v-if="currentTab === 'login'" class="tab-pane active show">
            <!-- Login form -->
            <div class="row justify-content-center mt-5">
                <div class="col-md-12 m-0">
                  <h2 class="text-center mb-4">Login to Twitter</h2>
                  <div class="card">
                    <div class="card-body">
                      <form @submit.prevent="submitForm">
                        <div class="mb-3">
                          <label for="email" class="form-label">Email</label>
                          <input type="text" class="form-control" v-model="login.email" id="login.email">
                          <div v-if="login.errors.email" class="text-danger">{{ login.errors.email[0] }}</div>
                          <div v-if="login.authError" class="text-danger">{{ login.authError }}</div>
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" v-model="login.password" id="login.password">
                          <div v-if="login.errors.password" class="text-danger">{{ login.errors.password[0] }}</div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Login</button>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div v-if="currentTab === 'register'" class="tab-pane active show">
            <div class="row justify-content-center mt-5">
                <div class="col-md-12 m-0">
                  <h2 class="text-center mb-4">Create your account</h2>
                  <div class="card">
                    <div class="card-body">
                      <form @submit.prevent="submitRegistrationForm">
                        <div class="mb-3">
                          <label for="name" class="form-label">Name</label>
                          <input type="text" class="form-control" v-model="registration.name" id="name">
                          <div v-if="registration.errors.name" class="text-danger">{{ registration.errors.name[0] }}</div>
                        </div>
                        <div class="mb-3">
                          <label for="email" class="form-label">Email</label>
                          <input type="email" class="form-control" v-model="registration.email" id="email">
                          <div v-if="registration.errors.email" class="text-danger">{{ registration.errors.email[0] }}</div>
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" v-model="registration.password" id="password">
                          <div v-if="registration.errors.password" class="text-danger">{{ registration.errors.password[0] }}</div>
                        </div>
                        <button type="submit" class="btn btn-primary w-100">Sign up</button>
                      </form>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
</template>
<script>
import { apiPost, saveToSessionStorage } from '../api';

export default {
    data() {
        return {
          currentTab: 'login',
          login: {
            email: '',
            password: '',
            errors: {},
            authError: ''
          },
          registration: {
            name: '',
            email: '',
            password: '',
            errors: {}
          }
         
        }
    },
    methods: {
      async submitForm() {
        try {
          const loginData = await apiPost('/login', this.login, false);

          // Clear previous authentication errors
          this.login.authError = '';

          if (loginData.status === 'failed' && loginData.data) {
            this.login.errors = loginData.data;
          } else {
            saveToSessionStorage(loginData);
            this.$router.push('/');
          }
        } catch (error) {
          if (error.isUnauthenticated) {
            this.login.authError = 'Username or password is incorrect';
          } else {
            console.error(error);
          }
        }
      },
      async submitRegistrationForm() {
        try {
          const registrationData = await apiPost('/register', this.registration, false);

          // Check if the response indicates a validation failure
          if (registrationData.status === 'failed' && registrationData.data) {
            this.registration.errors = registrationData.data;
          } else {
            // Handle successful registration
            saveToSessionStorage(registrationData);
            this.$router.push('/');
          }
        } catch (error) {
          console.error(error);
          // Handle network or server errors
        }
      }
    }
}
</script>