<template src="./template.html"></template>

<script>
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
import pairs from '../../../../../assets/json/keyMaps';
import TradeService from '@/services/TradeService';
import EventBus, {
  EventNames,
} from '@/eventBuses/default';
export default {
  name: 'balance',
  data() {
    return {
      balance: {},
      pair: this.$store.getters.selectedPair,
      exc: this.$store.getters.selectedExchange,
      marginInfo: {},
      showMarginInfo: false,
      marginBaseInfo:{},
    };
  },
  async created() {
    ExchangeDataEventBus.$on('change-symbol', this.getBalance);
    ExchangeDataEventBus.$on('afterSymbolAndExchangeChange', this.getBalance);
    EventBus.$on(EventNames.notification, this.getBalanceByNotify);
    EventBus.$on('change-active-tab', this.activeTabChange);
    this.getBalance();
  },
  methods: {
    async getBalance() {
      this.showLoader = true;
      this.pair = this.$store.getters.selectedPair;
      this.exc = this.$store.getters.selectedExchange.toLowerCase();
      this.excPair = pairs[`${this.exc}-_-${this.pair}`];
      this.balance =(await TradeService.getLedger()).data;
      this.showMarginInfo = false;
      this.showLoader= false;
    },
    async getBalanceByNotify(data) {
      if(data.data.updateType==='balance') {
        this.showLoader = true;
        this.pair = this.$store.getters.selectedPair;
        this.exc = this.$store.getters.selectedExchange.toLowerCase();
        this.excPair = pairs[`${this.exc}-_-${this.pair}`];
        this.balance =(await TradeService.getLedger()).data;
        this.showMarginInfo = false;
        this.showLoader= false;
      }
    },
    activeTabChange(activeTab) {
      this.activeTab = activeTab;
      /* eslint-disable no-console */
      console.log(activeTab);
      /* eslint-enable no-console */
      if (activeTab === 'Balance') {
        this.getBalance();
      }
    },
  },
  destroyed() {
    EventBus.$off(EventNames.notification, this.getBalanceByNotify);
    ExchangeDataEventBus.$off('afterSymbolAndExchangeChange', this.getBalance);
    ExchangeDataEventBus.$off('change-symbol', this.getBalance);
    EventBus.$off('change-active-tab', this.activeTabChange);
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>

</style>
