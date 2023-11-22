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
                <li class="list-group-item"> <router-link to="/" class="btn btn-dark btn-sm w-100">Home</router-link> </li>
                <li class="list-group-item"> <router-link to="/profile" class="btn btn-dark btn-sm w-100">Profile</router-link> </li>
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
              <!-- Search Bar -->
              <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Search tweets by email or name" v-model="searchQuery">
                <button class="btn btn-outline-secondary" type="button" @click="searchTweets">Search</button>
              </div>
              <ul class="list-group">
                <li v-for="(tweet, index) in trendingTweets" :key="index" class="list-group-item">
                  {{ tweet.user ? tweet.user.name : 'Unknown User' }}: {{ tweetSnippet(tweet.tweet) }}
                  <!-- Render follow button only if user is not already followed -->
                  <button v-if="!followedUserIds.includes(tweet.user_id)" class="btn btn-outline-primary btn-sm" @click="follow(tweet.user_id)"> Follow </button>
                  <div class="clearfix"></div>
                  <small>Posted on : {{ formatDate(tweet.created_at) }} </small>
                  <div class="clearfix"></div>
                  <span>Total: {{ tweet.likes?.length || 0 }} likes </span>
                  <!-- Like/Unlike Button -->
                  <button v-if="!hasLikedTweet(tweet)" class="btn btn-sm btn-success" @click="likeTweet(tweet._id, 1)"> Like </button>
                  <button v-else class="btn btn-sm btn-danger" @click="likeTweet(tweet._id, 0)"> Unlike </button>
                </li>
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
        trendingTweets: [],
        followedUserIds: [], // Array to store IDs of followed users
        searchQuery: '', // Added for search functionality
      };
    },
    async created() {
      this.fetchTrendingTweets(); 
    },
    methods: {
      async fetchTrendingTweets(search = '') {
        // Fetch trending tweets from API
        try {
          const endpoint = search ? `/tweets/tranding/${this.user_id}?search=${search}` : `/tweets/tranding/${this.user_id}`;
          const trendingTweetsResponse = await apiGet(endpoint);
          if (trendingTweetsResponse && trendingTweetsResponse.data) {
            this.trendingTweets = trendingTweetsResponse.data || [];
          }
          
          if (trendingTweetsResponse && trendingTweetsResponse.followedUserIds) {
            this.followedUserIds = trendingTweetsResponse.followedUserIds || [];
          }

        } catch (error) {
          console.error("Error fetching trending tweets:", error);
        }
      },
      searchTweets() {
        // Call fetchTrendingTweets with the search query
        this.fetchTrendingTweets(this.searchQuery);
      },

      tweetSnippet(tweet) {
        if (typeof tweet === 'string') {
          return tweet.split(' ').slice(0, 10).join(' ') + '...';
        } else {
          return 'Tweet content not available';
        }
      },
      formatDate(dateString) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleString('en-US', options);
      },
      async follow(followUserId) {
        try {
          await apiPost(`/follow/${followUserId}/1`,{user_id:this.user_id});
          this.trendingTweets = this.trendingTweets.filter(tweet => tweet.user._id !== followUserId);

        } catch (error) {
          console.error("Error following user:", error);
        }
      },
      hasLikedTweet(tweet) {
        return tweet.likes.some(like => like.user_id === this.user_id);
      },

      async likeTweet(tweetId, status) {
        try {
          // Make the API call to like or unlike the tweet
          await apiPost(`/like/${tweetId}/${status}`, { user_id: this.user_id });

          // Find the tweet in trendingTweets and update its likes
          const tweetIndex = this.trendingTweets.findIndex(tweet => tweet._id === tweetId);
          if (tweetIndex !== -1) {
            if (status === 1) {
              // Add like
              this.trendingTweets[tweetIndex].likes.push({ user_id: this.user_id });
            } else {
              // Remove like
              this.trendingTweets[tweetIndex].likes = this.trendingTweets[tweetIndex].likes.filter(like => like.user_id !== this.user_id);
            }
          }
        } catch (error) {
          console.error("Error toggling like:", error);
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
  