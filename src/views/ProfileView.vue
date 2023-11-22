<template>
  <div class="container profile-page">
    <h1 class="mb-4">My Profile</h1>
    <div v-if="userInfo" class="user-info mb-4">
      <h2>{{ userInfo.name }}</h2>
      <p>Email: {{ userInfo.email }}</p>
      <p>Joined: {{ formatDate(userInfo.created_at) }}</p>
    </div>

    <div class="row">
      <div v-if="userInfo.followers && userInfo.followers.length" class="col-md-12 followers mb-4">
        <h3>Followers</h3>
        <ul class="list-group">
          <li v-for="(follower, index) in userInfo.followers" :key="follower._id" class="list-group-item">
            {{ index + 1 }}. {{ follower.follower.name }} ({{ formatDate(follower.created_at) }})
          </li>
        </ul>
      </div>

      <div v-if="userInfo.following && userInfo.following.length" class="col-md-12 following">
        <h3>Following</h3>
        <ul class="list-group">
          <li v-for="(following, index) in userInfo.following" :key="following._id" class="list-group-item">
            {{ index + 1 }}. {{ following.followed.name }} -Follow since: {{ formatDate(following.created_at) }}
            <div class="clearfix">&nbsp;</div>
            <button class="btn btn-outline-danger btn-sm" @click="unfollow(following.followed._id)">Unfollow</button>
          </li>
        </ul>
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
        try {
            user = JSON.parse(userData);
        } catch (error) {
            console.error("Error parsing user data from sessionStorage:", error);
            user = {};
        }
    } else {
        user = {};
    }

    return {
      userInfo: [],
      user_id: user._id || '',
    };
  },
  async created() {
    await this.fetchUserInfo();
  },
  methods: {
    async fetchUserInfo() {
      try {
        // Fetching data for 'For You' tab
        const userResponse = await apiGet(`/users/${this.user_id}`);
        if (userResponse && userResponse.data) {
          this.userInfo = userResponse.data || []; // Accessing nested 'data'
          console.log(this.userInfo);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async unfollow(userId) {
      try {
        // Call API to unfollow the user
        await apiPost(`/follow/${userId}/0`, { user_id: this.user_id });

        // Update userInfo to remove the unfollowed user from the following list
        this.userInfo.following = this.userInfo.following.filter(following => following.followed._id !== userId);
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleString('en-US', options);
    }
  }
};
</script>

