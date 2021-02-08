<template src="./template.html"> 
</template>

<script>
import AccountInfo from '@/components/Settings/AccountInfo/AccountInfo.vue';
import ReceivingAddress from '@/components/Settings/ReceivingAddress/ReceivingAddress.vue';
import SendMoney from '@/components/Settings/SendMoney/SendMoney.vue';
import Security from '@/components/Settings/Security/Security.vue';
import Kyc from '@/components/Settings/KYC/KYC.vue';
import ExchangeDataEventBus from '@/eventBuses/exchangeData';


export default {
  name: 'settings',
  components: {
    AccountInfo,
    ReceivingAddress,
    SendMoney,
    Kyc,
    Security,
  },
  data () {
    return {
      activeTab: 'Account Info',
      tabs: ['Account Info', 'Security', 'KYC', 'Deposit Address', 'Send Money',],
    };
  },
  created() {
    this.changeTab = tab => {
      this.activeTab = tab;
      /* eslint-disable no-console */
      console.log(this.activeTab);
      console.log(tab);
      /* eslint-enable no-console */
    };
  },
  mounted() {
    ExchangeDataEventBus.$on('sett-activeTab', this.changeTab);
  },
  methods: {
    onDropDownTabChange(tab) {
      this.activeTab = tab;
    },
  },
};
</script>
<style src="./style.scss" lang="scss" scoped>

</style>
