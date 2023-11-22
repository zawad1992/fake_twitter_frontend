<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <div class="navbar-nav me-auto">
        <a class="navbar-brand" href="#">Twitter</a>
        <li class="nav-item active"> <a class="nav-link" href="#">Home</a> </li>
        <li class="nav-item"> <a class="nav-link" href="#">Explore</a> </li>
      </div>
      <ul class="nav nav-tabs mx-auto">
        <li class="nav-item"> <a class="nav-link" :class="{ active: currentTab === 'foryou' }" @click="currentTab = 'foryou'">For You</a> </li>
        <li class="nav-item"> <a class="nav-link" :class="{ active: currentTab === 'following' }" @click="currentTab = 'following'">Following</a> </li>
      </ul>
      <div class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Notifications</a>
        </li>
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
              <li class="list-group-item"><a class="btn btn-dark btn-sm w-100" href="#">Link 1</a></li>
              <li class="list-group-item"><a class="btn btn-dark btn-sm w-100" href="#">Link 2</a></li>
              <li class="list-group-item"><a class="btn btn-dark btn-sm w-100" href="#">Link 3</a></li>
              <li class="list-group-item"><a class="btn btn-dark btn-sm w-100" href="#">Link 4</a></li>
              <li class="list-group-item"><a class="btn btn-dark btn-sm w-100" href="#">Link 5</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-md-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Share your thought</h5>
            <p class="card-text">
              <form @submit.prevent="addTweet">
                <div class="mb-3">
                  <textarea class="form-control" v-model="newTweet.tweet" id="tweet" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-primary w-100">Tweet</button>
              </form>
            </p>
          </div>
        </div>
        <div class="tab-content mt-2" id="myTabContent">
          <div v-if="currentTab === 'foryou'" class="tab-pane active show">
            <!-- Content for "For You" -->
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">For You</h5>
                <p class="card-text">Content for "For You" goes here.</p>
              </div>
            </div>
            <div class="card" v-for="tweet in mytweets" :key="tweet._id">
              <div class="card-body">
                <h5 class="card-title">{{ tweet.user ? tweet.user.name : 'Unknown User' }}</h5>
                <p class="card-text">{{ tweet.tweet }}</p>
                <small>Posted at: {{ tweet.created_at }}</small>
              </div>
            </div>
          </div>
          <div v-if="currentTab === 'following'" class="tab-pane active show">
            <!-- Content for "Following" -->
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Following</h5>
                <p class="card-text">Content for "Following" goes here.</p>
              </div>
            </div>
            <div class="card" v-for="tweet in tweets" :key="tweet._id">
              <div class="card-body">
                <h5 class="card-title">{{ tweet.user ? tweet.user.name : 'Unknown User' }}</h5>
                <p class="card-text">{{ tweet.tweet }}</p>
                <small>Posted at: {{ tweet.created_at }}</small>
              </div>
            </div>
          </div>
        </div>
        <!-- End tab content -->
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
      tweets: [],
      mytweets: [],
      newTweet: {
        user_id: user._id || '', // Set the user ID here or dynamically
        tweet: ''
      },
      currentTab: 'foryou',
      user_id: user._id || ''
    };
  },
  async created() {
    await this.fetchTweets();
  },
  methods: {
    async fetchTweets() {
      try {
        const tweetsData = await apiGet('/tweets');
        this.tweets = tweetsData && tweetsData.data ? tweetsData.data : [];

        const myTweetsData = await apiGet(`/tweets/user/${this.user_id}`);
        this.mytweets = myTweetsData && myTweetsData.data ? myTweetsData.data : [];
      } catch (error) {
        console.error(error);
      }
    },
    async addTweet() {
      try {
        const newTweetData = await apiPost('/tweets', this.newTweet);
        if (newTweetData && newTweetData.data) {
          this.tweets.unshift(newTweetData.data);
          this.mytweets.unshift(newTweetData.data);
        }
        this.newTweet = { user_id: this.newTweet.user_id, tweet: '' };
      } catch (error) {
        console.error(error);
      }
    },
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
