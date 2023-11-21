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
                          <input type="text" class="form-control" v-model="email" id="email">
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" v-model="password" id="password">
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
                      <form>
                        <div class="mb-3">
                          <label for="name" class="form-label">Name</label>
                          <input type="text" class="form-control" id="name">
                        </div>
                        <div class="mb-3">
                          <label for="phone" class="form-label">Phone</label>
                          <input type="text" class="form-control" id="phone">
                        </div>
                        <div class="mb-3">
                          <label for="email" class="form-label">Email</label>
                          <input type="email" class="form-control" id="email">
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" id="password">
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
import axios from 'axios';

export default {
    data() {
        return {
          currentTab: 'login',
          email: 'zawad1992@gmail.com ',
          password: '123456'
        }
    },
    methods: {
        async submitForm() {
            try {
               
                const response = await axios.post('http://127.0.0.1:8888/LARAVEL/fake_twitter_backend/api/login', {
                    email: this.email,
                    password: this.password
                });
                this.saveToSessionStorage(response.data);
                this.$router.push('/');
            } catch (error) {
                console.error(error);
            }
        },
        saveToSessionStorage(data) {
          console.log(data);
            sessionStorage.setItem('user', JSON.stringify(data.user));
            sessionStorage.setItem('authorisation', JSON.stringify(data.authorisation));
        }
    }
}
</script>