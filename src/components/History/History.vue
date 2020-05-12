<template src="./template.html"></template>

<script>
import BitfinexDepositHistory from './BitfinexDepositHistory/BitfinexDepositHistory';
import BitfinexTradingHistory from './BitfinexTradingHistory/BitfinexTradingHistory';
import BitfinexCompletedWithdrawalHistory from './BitfinexCompletedWithdrawalHistory/BitfinexCompletedWithdrawalHistory';
import BalanceHistory from './BalanceHistory/BalanceHistory';
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
    BalanceHistory,
  },
  
  data() {
    return {
      selectedExchange: 'bitfinex',
      bitfinexFlag: true,
      bitfinexActiveTab: 'Orders',
      bitfinexTabs: ['Orders', 'Trading', 'Positions', 'Crypto Deposits', 'Crypto Withdrawal', 'Balance History',],

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
