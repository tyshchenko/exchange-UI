<template src="./template.html"></template>

<script>
import WalletService from '@/services/WalletService';
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
        login: (loggedInUser) ? loggedInUser : '' ,
        password: (mqttKey) ? mqttKey : '' ,
        otp:'',
      },
    };
  },
  methods: {
    async login() {
      this.$showSuccessMsg({
        message: 'Executing Login Procedure ... ',
      });
      const response = await WalletService.login(this.formData);
      if (response.Status == 1) {
        EventBus.$emit(EventNames.userLogin, { username: this.formData.login, mqttKey: this.formData.password, });
        this.$showSuccessMsg({
          message: response.Result,
        });
      } else if (response.Status == 100) {
        showTwoFAuthenticationModal();
      } else {
        this.$showErrorMsg({
          message: response.Result,
        });
      }
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
