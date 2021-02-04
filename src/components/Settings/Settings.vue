<template src="./template.html"> 
</template>

<script>
import AccountInfo from '@/components/Settings/AccountInfo/AccountInfo.vue';
import ReceivingAddress from '@/components/Settings/ReceivingAddress/ReceivingAddress.vue';
import SendMoney from '@/components/Settings/SendMoney/SendMoney.vue';
import Security from '@/components/Settings/Security/Security.vue';
import KYC from '@/components/Settings/KYC/KYC.vue';


export default {
  name: 'settings',
  components: {
    AccountInfo,
    ReceivingAddress,
    SendMoney,
    KYC,
    Security,
  },
  data () {
    return {
      activeTab: 'Account Info',
      tabs: ['Account Info', 'Security', 'KYC', 'Deposit Address', 'Send Money',],
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
