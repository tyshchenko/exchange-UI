<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import ExchangeDataEventBus from '@/eventBuses/exchangeData';

const loggedInUser = LocalStorage.get(Keys.username);

export default {
  name: 'account-info',
  data () {
    return {
      activeTab: 'Account Info',
      email:loggedInUser,
      displayFlag: false,
      enabled2fa: false,
      kycdone: false,
    };
  },
  methods: {
    gotokyc() {
      ExchangeDataEventBus.$emit(
        'sett-activeTab',
        'KYC'
      );
    },
    goto2fa() {
      ExchangeDataEventBus.$emit(
        'sett-activeTab',
        'Security'
      );
    },
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
