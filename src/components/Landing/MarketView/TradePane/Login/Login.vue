<template src="./template.html"></template>

<script>
import WalletService from '@/services/WalletService';
import EventBus, { EventNames, } from '@/eventBuses/default';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

const loggedInUser = LocalStorage.get(Keys.username);


export default {
  name: 'login',
  data() {
    return {
      showLoader: false,
      showLogin: true,
      showOTP: false,
      formData: {
        login: (loggedInUser) ? loggedInUser : '',
        password: '',
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
      this.showOTP = false;
      if (response.Status == 1) {
        EventBus.$emit(EventNames.userLogin, { username: this.formData.login, mqttKey: response.Userid, });
        this.$showSuccessMsg({
          message: response.Result,
        });
      } else {
        if (response.Status == 100) {
          this.showOTP = true;
          this.$showSuccessMsg({
            message: 'Please enter 2FA ',
          });
        } else {
          this.$showErrorMsg({
            message: response.Result,
          });
        }
        
        
      }
    },
    showDepositModal() {
      this.$store.commit('closeSidebar');
      this.$emit('show-withdrawl-modal');
    },
    forgpass() {
      this.showLogin = false;
    },
    backforgpass() {
      this.showLogin = true;
    },
    async sendforgpass() {
      this.$showSuccessMsg({
        message: 'Sending request ... ',
      });
      const response = await WalletService.restorerequest(this.formData);
      if (response.Status == 1) {
        this.$showSuccessMsg({
          message: response.Result,
        });
      } else {
        /* eslint-disable no-console */
        console.log(response);
        /* eslint-enable no-console */
        if (response.Status == 100) {
          this.showOTP = true;
          /* eslint-disable no-console */
          console.log(response);
          /* eslint-enable no-console */
        }
        this.$showErrorMsg({
          message: response.Result,
        });
      }
      this.showLogin = true;
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
