<template src="./template.html"></template>

<script>
import BitfinexDepositHistory from './BitfinexDepositHistory/BitfinexDepositHistory';
import BitfinexTradingHistory from './BitfinexTradingHistory/BitfinexTradingHistory';
import BitfinexCompletedWithdrawalHistory from './BitfinexCompletedWithdrawalHistory/BitfinexCompletedWithdrawalHistory';
import BitfinexPendingWithdrawalHistory from './BitfinexPendingWithdrawalHistory/BitfinexPendingWithdrawalHistory';
import BitfinexOrdersHistory from './BitfinexOrdersHistory/BitfinexOrdersHistory';
import BitfinexPositionsHistory from './BitfinexPositionsHistory/BitfinexPositionsHistory';


export default {
  name: 'history',
  components: {
    BitfinexDepositHistory,
    BitfinexTradingHistory,
    BitfinexCompletedWithdrawalHistory,
    BitfinexPendingWithdrawalHistory,
    BitfinexOrdersHistory,
    BitfinexPositionsHistory,
  },
  
  data() {
    return {
      selectedExchange: 'bitfinex',
      bitfinexFlag: true,
      bitfinexActiveTab: 'Orders',
      bitfinexTabs: ['Orders', 'Trading', 'Crypto Deposits', 'Crypto Withdrawal',],

    };
  },
  methods: {
    onDropDownBitfinexTabChange(tab) {
      this.bitfinexActiveTab = tab;
    },
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>

</style>
