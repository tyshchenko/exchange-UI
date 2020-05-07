<template src="./template.html"> 
</template>

<script>
import AccountInfo from '@/components/Settings/AccountInfo/AccountInfo.vue';
import SendMoney from '@/components/Settings/SendMoney/SendMoney.vue';
import BitfinexDepositAddress from '@/components/Deposit/BitfinexDepositAddress/BitfinexDepositAddress';


export default {
  name: 'settings',
  components: {
    AccountInfo,
    BitfinexDepositAddress,
    SendMoney,
  },
  data () {
    return {
      activeTab: 'Account Info',
      tabs: ['Account Info', 'Deposit Address', 'Send Money',],
    };
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
