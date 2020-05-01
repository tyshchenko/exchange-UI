<template src="./template.html"></template>

<script>
import WalletService from '@/services/WalletService';
import EventBus, { EventNames, } from '@/eventBuses/default';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

const loggedInUser = LocalStorage.get(Keys.username);
const mqttKey = LocalStorage.get(Keys.mqtt);

export default {
  name: 'register',
  data() {
    return {
      showLoader: false,
      formData: {
        login: (loggedInUser) ? loggedInUser : '' ,
        password: (mqttKey) ? mqttKey : '' ,
      },
    };
  },
  methods: {
    async register() {
      const response = await WalletService.register(this.formData);
      if (response.Status == 1) {
        EventBus.$emit(EventNames.userLogin, { username: this.formData.login, mqttKey: this.formData.password, });
        this.$showSuccessMsg({
          message: response.Result,
        });
      } else {
        this.$showErrorMsg({
          message: response.Result,
        });
      }
    },

  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>
