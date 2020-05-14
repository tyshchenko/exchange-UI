<template src="./template.html"></template>

<script>
import TradeService from '@/services/TradeService';
import { dateToDisplayDateTime, } from '@/utils/utility';
import EventBus, { EventNames, } from '@/eventBuses/default';

export default {
  name: 'recent-trades',
  components: {},
  props: {
    open: {
      type: Boolean,
    },
  },
  data() {
    return {
      showTotal: false,
    };
  },
  mounted() {
    this.userLoginListener = () => this.getRecentTrades();
    this.userLogoutListener = () => (this.recentTrades = []);
    EventBus.$on(EventNames.userLogin, this.userLoginListener);
    EventBus.$on(EventNames.userLogout, this.userLogoutListener);
  },
  computed: {
    recentTrades() {
      return this.mapRecentTrades(this.$store.getters.recentTrades);
    },
  },
  methods: {
    async getRecentTrades() {
      let recentTrades = await TradeService.getFuturesOrders();
      this.$store.commit('recentTrades', recentTrades.data);
    },
    toggleOpen() {
      this.$emit('toggle-open');
    },
    formatDateTime(timestamp) {
      return dateToDisplayDateTime(new Date(timestamp));
    },
    async cancelOrder(id) {
      this.$store.commit('addLoaderTask', 1, false);
      const response = await TradeService.cancelOrder({
        orderId: id,
      });
      if (response.status) {
        this.$showSuccessMsg({
          message: response.data.message,
        });
      } else {
        this.$showErrorMsg({
          message: response.data.message,
        });
      }
      this.$store.commit('removeLoaderTask', 1);
    },
    mapRecentTrades(rtArr = []) {
      return rtArr.map(rt => ({
        id: rt.id,
        orderId: rt.clientOrderId,
        placedTime: new Date(rt.placedTime * 1000),
        amount: parseFloat(rt.amount),
        startMoney: parseFloat(rt.startMoney).toPrecision(2),
        stopPrice: parseFloat(rt.stopPrice).toPrecision(2),
        openPrice: parseFloat(parseFloat(rt.startMoney) / parseFloat(rt.amount)).toPrecision(2),
        buyOrSell: rt.buyOrSell,
        exchange: rt.exchange,
        orderType: rt.orderType,
        status: rt.status,
        pair: rt.pair,
        basePair: (rt.pair.split('/'))[0],
        quotePair: (rt.pair.split('/'))[1],
      }));
    },
  },
  destroyed() {
    // EventBus.$off(EventNames.userLogin, this.userLoginListener);
    // EventBus.$off(EventNames.userLogout, this.userLogoutListener);
  },
};
</script>

<style lang="scss" src="./style.scss" scoped></style>


