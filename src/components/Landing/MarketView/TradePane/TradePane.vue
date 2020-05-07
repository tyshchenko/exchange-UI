<template src="./template.html"></template>

<script>
import Vue from 'vue';
import TradeTab from './TradeTab/TradeTab.vue';
import TabBar from '@/components/TabBar/TabBar.vue';
import Ticker from './Ticker/Ticker.vue';
import News from './News/News.vue';
import Balance from './Balance/Balance.vue';
import Login from './Login/Login.vue';
import Register from './Register/Register.vue';
import LiveTrades from './../BookPane/LiveTrades/LiveTrades';
import EventBus, { EventNames, } from '@/eventBuses/default';


export default {
  name: 'trade-pane',
  components: {
    TabBar,
    TradeTab,
    Ticker,
    Balance,
    LiveTrades,
    News,
    Login,
    Register,
  },
  data() {
    return {
      activeTab: 'Login',
      tabs: {
        notLoggedInTabs: ['Login', 'Register',],
        loggedInTabs: [ 'Balance','Trade',],
      },
      height: 0,
      tabBarEventBus: new Vue(),
    };
  },
  updated() {
    this.height = this.$refs.tradePane.clientHeight;
  },
  mounted() {
    if(this.$store.state.isLoggedIn){
      this.tabBarEventBus.$emit('change-active-tab', 'Trade');
      this.activeTab= 'Trade';      
    } else {
      this.tabBarEventBus.$emit('change-active-tab', 'Login');
      this.activeTab= 'Login';      
    }
    EventBus.$on(EventNames.userLogin, () =>
      this.tabBarEventBus.$emit('change-active-tab', 'Trade')
    );
    this.height = this.$refs.tradePane.clientHeight;
    EventBus.$on(EventNames.userLogout, this.userLogoutListener);
  },
  methods: {
    activeTabChange(activeTab) {
      this.activeTab = activeTab;
      if (activeTab === 'Balance') {
        this.getBalance();
      }
      // let el = document.getElementsByClassName('trade-pane-content')[0];
      // if (activeTab === 'Login') {
      //   el.style.height = 'calc(50% - 0px)';
      // } else if (activeTab === 'Ticker') {
      //   el.style.height = 'calc(50% - 15px)';
      // } else {
      //   el.style.height = 'auto';
      // }
    },
    userLogoutListener() {
      this.activeTab = 'Login';
      this.tabBarEventBus.$emit('change-active-tab', 'Login');
    },
  },
};
</script>


<style lang="scss" src="./style.scss" scoped></style>
