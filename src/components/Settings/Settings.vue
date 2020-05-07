<template src="./template.html"> 
</template>

<script>
import AccountInfo from '@/components/Settings/AccountInfo/AccountInfo.vue';
import ReceivingAddress from '@/components/Settings/ReceivingAddress/ReceivingAddress.vue';
import SendMoney from '@/components/Settings/SendMoney/SendMoney.vue';


export default {
  name: 'settings',
  components: {
    AccountInfo,
    ReceivingAddress,
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
