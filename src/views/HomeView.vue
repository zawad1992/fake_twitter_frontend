<template>
  <div class="col-md-12">
    <ul class="nav nav-tabs mx-auto">
      <li class="nav-item"> <a class="nav-link" :class="{ active: currentTab === 'foryou' }" @click="currentTab = 'foryou'">For You</a> </li>
      <li class="nav-item"> <a class="nav-link" :class="{ active: currentTab === 'following' }" @click="currentTab = 'following'">Following</a> </li>
    </ul>
    <div class="card">
      <div class="card-body">
        <p class="card-text">
          <form @submit.prevent="addTweet">
            <div class="mb-3">
              <textarea class="form-control" v-model="newTweet.tweet" id="tweet" rows="3" placeholder="What is happening?!"></textarea>
            </div>
            <button type="submit" class="btn btn-primary w-100">Tweet</button>
          </form>
        </p>
      </div>
    </div>
    <div class="tab-content mt-2" id="myTabContent">
      <div v-if="currentTab === 'foryou'" class="tab-pane active show">
        <!-- Content for "For You" -->
        <div class="card" v-for="tweet in mytweets" :key="tweet._id">
          <div class="card-body">
            <h5 class="card-title">{{ tweet.user ? tweet.user.name : 'Unknown User' }}</h5>
            <p class="card-text">{{ tweet.tweet }}</p>
            <small>Posted at: {{ formatDate(tweet.created_at) }}</small>
            <div class="clearfix"></div>
            <span>Total: {{ tweet.likes?.length || 0 }} likes </span>
          </div>
        </div>
        <!-- Pagination for 'For You' Tab -->
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: mytweetsPagination.currentPage === 1 }">
              <a class="page-link" href="#" @click="changePage('following', -1)" aria-label="Previous">
                <span aria-hidden="true">Previous</span>
              </a>
            </li>
            <li class="page-item" v-for="page in pageNumbers(mytweetsPagination.totalPages)" :key="page" :class="{ active: mytweetsPagination.currentPage === page }">
              <a class="page-link" href="#" @click="goToPage('following', page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: mytweetsPagination.currentPage === mytweetsPagination.totalPages }">
              <a class="page-link" href="#" @click="changePage('following', 1)" aria-label="Next">
                <span aria-hidden="true">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div v-if="currentTab === 'following'" class="tab-pane active show">
        <!-- Content for "Following" -->
        <div class="card" v-for="tweet in tweets" :key="tweet._id">
          <div class="card-body">
            <h5 class="card-title">{{ tweet.user ? tweet.user.name +'-'+ tweet.user.email : 'Unknown User' }} <button class="btn btn-outline-danger btn-sm" @click="unfollow(tweet.user_id)">Unfollow</button></h5>
            <p class="card-text">{{ tweet.tweet }}</p>
            <small>Posted at: {{ formatDate(tweet.created_at) }}</small>
            <div class="clearfix"></div>
            <span>Total: {{ tweet.likes?.length || 0 }} likes </span>
            <!-- Check if the current user has liked this tweet -->
            <button v-if="!isLikedByCurrentUser(tweet.likes)" class="btn btn-sm btn-success" @click="likeTweet(tweet._id, 1)">Like</button>
            <button v-else class="btn btn-sm btn-danger" @click="likeTweet(tweet._id, 0)">Unlike</button>
            
          </div>
        </div>
        <!-- Pagination for 'Following' Tab -->
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: tweetsPagination.currentPage === 1 }">
              <a class="page-link" href="#" @click="changePage('forYou', -1)" aria-label="Previous">
                <span aria-hidden="true">Previous</span>
              </a>
            </li>

            <li class="page-item" v-for="page in pageNumbers(tweetsPagination.totalPages)" :key="page" :class="{ active: tweetsPagination.currentPage === page }">
              <a class="page-link" href="#" @click="goToPage('forYou', page)">{{ page }}</a>
            </li>

            <li class="page-item" :class="{ disabled: tweetsPagination.currentPage === tweetsPagination.totalPages }">
              <a class="page-link" href="#" @click="changePage('forYou', 1)" aria-label="Next">
                <span aria-hidden="true">Next</span>
              </a>
            </li>
          </ul>
        </nav>
        
      </div>
    </div>
    <!-- End tab content -->
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
      user_id: user._id || '',
      tweetsPagination: {
        currentPage: 1,
        totalPages: 0
      },
      mytweetsPagination: {
        currentPage: 1,
        totalPages: 0
      },
      pageSize: 5, // This should match the backend's pagination size
      likedTweets: [], // Store IDs of tweets the user has liked
    };
  },
  async created() {
    await this.fetchTweets();
  },
  watch: {
    // Watcher for currentTab
    currentTab(newTab, oldTab) {
      if (newTab !== oldTab) {
        this.fetchTweets();
      }
    }
  },
  methods: {
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
    async fetchTweets() {
      // Clear existing data before fetching new data
      this.tweets = [];
      this.mytweets = [];

      // Determine which API endpoint to call based on the current tab
      let apiEndpoint;
      if (this.currentTab === 'foryou') {
        apiEndpoint = `/tweets/user/${this.user_id}`;
      } else if (this.currentTab === 'following') {
        apiEndpoint = `/tweets/${this.user_id}`;
      }

      // Fetch data from the appropriate endpoint
      try {
        const response = await apiGet(`${apiEndpoint}?page=${this.getPagination().currentPage}&pageSize=${this.pageSize}`);
        if (response && response.data) {
          if (this.currentTab === 'foryou') {
            this.mytweets = response.data.data || [];
          } else if (this.currentTab === 'following') {
            this.tweets = response.data.data || [];
          }
          this.getPagination().totalPages = response.data.last_page || 0;
        }
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    },
    getPagination() {
      // Helper method to get the correct pagination object
      return this.currentTab === 'foryou' ? this.mytweetsPagination : this.tweetsPagination;
    },
    async likeTweet(tweetId, status) {
      try {
        await apiPost(`/like/${tweetId}/${status}`, { user_id: this.user_id });

        // Find the index of the tweet in the tweets array
        const tweetIndex = this.tweets.findIndex(tweet => tweet._id === tweetId);
        if (tweetIndex !== -1) {
          // Update the likes array for the tweet
          if (status === 1) {
            // Add like
            this.tweets[tweetIndex].likes.push({ user_id: this.user_id });
          } else {
            // Remove like
            this.tweets[tweetIndex].likes = this.tweets[tweetIndex].likes.filter(like => like.user_id !== this.user_id);
          }
        }
      } catch (error) {
        console.error("Error updating like status:", error);
      }
    },
    isLikedByCurrentUser(likesArray) {
      console.log(likesArray);
      // Check if the likes array contains an entry with the current user's ID
      return likesArray.some(like => like.user_id === this.user_id);
    },

    async unfollow(userId) {
      try {
        // Call API to unfollow the user
        await apiPost(`/follow/${userId}/0`, { user_id: this.user_id });
        // Update tweets array to remove the unfollowed user's tweets
        this.tweets = this.tweets.filter(tweet => tweet.user._id !== userId);
      } catch (error) {
        console.error("Error unfollowing user:", error);
      }
    },
    formatDate(dateString) {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleString('en-US', options);
    },
    changePage(tab, delta) {
      if (tab === 'forYou' && this.canChangePage(this.tweetsPagination, delta)) {
        this.tweetsPagination.currentPage += delta;
        this.fetchTweets();
      } else if (tab === 'following' && this.canChangePage(this.mytweetsPagination, delta)) {
        this.mytweetsPagination.currentPage += delta;
        this.fetchTweets();
      }
    },
    canChangePage(pagination, delta) {
      const newPage = pagination.currentPage + delta;
      return newPage > 0 && newPage <= pagination.totalPages;
    },
    pageNumbers(totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    },
    goToPage(tab, page) {
      if (tab === 'forYou') {
        this.tweetsPagination.currentPage = page;
      } else if (tab === 'following') {
        this.mytweetsPagination.currentPage = page;
      }
      this.fetchTweets();
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
