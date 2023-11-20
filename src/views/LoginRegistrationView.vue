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
                      <form>
                        <div class="mb-3">
                          <label for="username" class="form-label">Phone, email, or username</label>
                          <input type="text" class="form-control" id="username">
                        </div>
                        <div class="mb-3">
                          <label for="password" class="form-label">Password</label>
                          <input type="password" class="form-control" id="password">
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
export default {
  data() {
    return {
      currentTab: 'login'
    }
  }
}
</script>