<template src="./template.html"></template>

<script>
import TradeService from '@/services/TradeService';
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
import { stringArrayToHtmlList, } from '@/utils/utility';

export default {
  name: 'limit-order',
  data() {
    return {
      showConfirm: false,
      formData: {
        pair: 'ANKERBTC',
        type: 'limit',
        exc: 'coinbae',
        bos: 'buy',
        amount: undefined,
        price: undefined,
        moe: 'market',
      },
      fees: {
        maker: '',
        taker: '',
      },
      showLoader: false,
      statusCode: 'operational',
      watcher: '',
    };
  },
  watch: {
    formData: {
      handler: function(to) {
        this.getStatus(to.exc);
      },
      deep: true,
    },
  },
  created() {
    this.getFees();

  },
  mounted() {
    this.watcher = setInterval(() => {
      this.getStatus(this.formData.exc);
    }, 5000);
    ExchangeDataEventBus.$on('change-symbol', this.changeSymbol);
    ExchangeDataEventBus.$on('selectedprice', this.changePrice);
    this.getStatus('auto');
  },
  methods: {
    pairChange() {
      this.$store.commit('addLoaderTask', 3, false);
      // console.log(this.$store.getters.getSelectedPairExchanges, "lovish");
      this.$store.commit('setAvailableExchanges');
      ExchangeDataEventBus.$emit(
        'change-symbol',
        this.$store.state.selectedPair
      );
    },
    getStatus(exc) {
      if (exc === 'auto') {
        this.statusCode = this.$store.getters.getAutoStatus;
      } else {
        this.statusCode = this.$store.getters[`get${exc}OrderStatus`];
      }
    },
    async getFees() {
      let fees = await TradeService.getFees();
      this.fees.maker = fees.data.maker;
      this.fees.taker = fees.data.taker;
    },
    confirmTrade(buyOrSell) {
      this.formData.bos = buyOrSell;

      let validationErrors = [];
      this.validateQty(validationErrors, 'Amount', this.formData.amount);
      this.validateQty(validationErrors, 'Price', this.formData.price);
      if (validationErrors.length) {
        this.$showErrorMsg({
          message: stringArrayToHtmlList(validationErrors),
        });
      } else {
        this.showConfirm = true;
      }
    },
    cancelTrade() {
      this.formData.amount = undefined;
      this.formData.price = undefined;
      this.showConfirm = false;
    },
    validateQty(errorsArray, placeholder, value) {
      if (!value || Number(value) === 0) {
        errorsArray.push(`${placeholder} is required.`);
      } else if ((value && Number.isNaN(Number(value))) || Number(value) < 0) {
        errorsArray.push(`${placeholder} is not valid.`);
      }
    },
    async makeTrade() {
      this.showLoader = true;
      this.formData.pair = this.$store.getters.selectedPair;
      const response = await TradeService.placeNewOrder(this.formData);
      setTimeout(() => {
        if(!response) {
          this.formData.amount = undefined;
          this.formData.price = undefined;
          this.showConfirm = false;
          this.$showErrorMsg({
            message: 'Timeout exceeded.',
          });
        }
      },7000);
      this.formData.amount = undefined;
      this.formData.price = undefined;
      this.showConfirm = false;

      if (response.status) {
        this.$showSuccessMsg({
          message: response.data.message,
        });
      } else {
        this.$showErrorMsg({
          message: response.data.message,
        });
      }
      this.showLoader = false;
    },
    changeSymbol() {
      this.formData.exc = 'auto';
    },
    changePrice(price) {
      this.formData.price = price['price'];
    },
  },
  destroyed() {
    clearInterval(this.watcher);
    ExchangeDataEventBus.$off('change-symbol', this.changeSymbol);
    ExchangeDataEventBus.$off('selectedprice', this.changePrice);
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>
