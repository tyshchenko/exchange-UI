<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
import WalletService from '@/services/WalletService.js';

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
      username:'',
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
  async created() {
    let data = await WalletService.loadstatus();
    if (data.error) {
      /* eslint-disable no-console */
      console.log(data.error);
      /* eslint-enable no-console */

    } else {
      this.enabled2fa = data.data.otp;
      this.kycdone = data.data.kyc;
      this.username = data.data.username;
    }
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
