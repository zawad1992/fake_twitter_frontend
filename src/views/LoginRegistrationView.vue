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
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" v-model="login.password" id="login.password">
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
                        </div>
                        <div class="mb-3">
                          <label for="email" class="form-label">Email</label>
                          <input type="email" class="form-control" v-model="registration.email" id="email">
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" v-model="registration.password" id="password">
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
            email: 'zawad1992@gmail.com',
            password: '123456'
          },
          registration: {
            name: '',
            email: '',
            password: '123456'
          }
         
        }
    },
    methods: {
      async submitForm() {
        try {
          const loginData = await apiPost('/login', this.login);
          saveToSessionStorage(loginData);
          this.$router.push('/');
        } catch (error) {
          console.error(error);
        }
      },
      async submitRegistrationForm() {
        try {
          const registrationData = await apiPost('/register', this.registration);
          saveToSessionStorage(registrationData);
          this.$router.push('/');
        } catch (error) {
          console.error(error);
        }
      }
    }
}
</script>