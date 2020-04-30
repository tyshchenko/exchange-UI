<template src="./template.html"></template>

<script>
import EventBus, { EventNames, } from '@/eventBuses/default';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

const loggedInUser = LocalStorage.get(Keys.username);
const mqttKey = LocalStorage.get(Keys.mqtt);

export default {
  name: 'login',
  data() {
    return {
      showLoader: false,
      formData: {
        login: loggedInUser,
        password: mqttKey,
      },
    };
  },
  methods: {
    login() {
      EventBus.$emit(EventNames.userLogin, { username: this.formData.login, mqttKey: this.formData.password, });
      this.$showSuccessMsg({
        message: 'Login Successfully',
      });
    },
    showDepositModal() {
      this.$store.commit('closeSidebar');
      this.$emit('show-withdrawl-modal');
    },
    showWithdrawlModal() {
      this.$store.commit('closeSidebar');
      this.$emit('show-deposit-modal');
    },
    showTwoFAuthenticationModal() {
      this.$store.commit('closeSidebar');
      this.$emit('show-TwoFAuthentication-modal');
    },
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>
