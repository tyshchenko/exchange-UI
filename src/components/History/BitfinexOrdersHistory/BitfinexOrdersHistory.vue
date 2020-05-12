<template src="./template.html"></template>

<script>
import TradeService from '@/services/TradeService';
import Spinner from '@/components/Spinner/Spinner.vue';
import { dateToDisplayDateTime, } from '@/utils/utility';

export default {
  name: 'bitfinex-orders-history',
  components: {
    Spinner,
  },
  data() {
    return {
      history: [],
      spinnerFlag: true,
      sortBy: 0,
      searchString: '',
      initialData: [],
      displayText: 'No Records Found.',
    };
  },
  async created() {
    let activeOrders = await TradeService.getActiveOrders();
    this.initialData = this.mapActiveOrders(activeOrders.data);
    /* eslint-disable no-console */
    console.log(this.initialData);
    /* eslint-enable no-console */
    if(this.history.length === 0)
      this.displayText = 'No Records Found.';
    this.updateData();
    this.spinnerFlag = false;
  },
  watch: {
    searchString: function() {
      this.updateData();
    },
  },
  methods: {
    formatDateTime(timestamp) {
      return dateToDisplayDateTime(new Date(timestamp));
    },
    updateData() {
      this.history = this.initialData.filter((ele) => {
        return ele.symbol.includes(this.searchString.toUpperCase()) || ele.type.toString().includes(this.searchString) || ele.id.toString().includes(this.searchString) ;
      });
      this.history = this.sortData(this.history);
      this.history = this.history.reverse();
      /* eslint-disable no-console */
      console.log(this.history);
      /* eslint-enable no-console */
    },
    sortData(data) {
      switch(this.sortBy) {
        case 0: 
          return data.reverse();
        case 1: 
          return data;
        case 101: 
          return data.sort((b,a) => {
            return a.order_status - b.order_status;
          });
        case 102: 
          return data.sort((b,a) => {
            return b.order_status - a.order_status;
          });
        case 201: 
          return data.sort((b,a) => {
            return a.symbol - b.symbol;
          });
        case 202: 
          return data.sort((b,a) => {
            return b.symbol - a.symbol;
          });
        case 301: 
          return data.sort((b,a) => {
            return a.amount - b.amount;
          });
        case 302: 
          return data.sort((b,a) => {
            return b.amount - a.amount;
          });
        case 401: 
          return data.sort((b,a) => {
            return a.price - b.price;
          });
        case 402: 
          return data.sort((b,a) => {
            return b.price - a.price;
          });
      }
    },
    sortDataBy(value) {
      if(this.sortBy === value) {
        this.sortBy += 1;
      } else {
        this.sortBy = value;
      }
      this.updateData();
    },
    mapActiveOrders(rtArr = []) {
      return rtArr.map(rt => ({
        id: rt.id,
        orderId: rt.clientOrderId,
        tTime: new Date(rt.placedTime * 1000),
        amount: parseFloat(rt.amount),
        price_avg: parseFloat(rt.avgPrice),
        price: parseFloat(rt.avgPrice),
        buyOrSell: rt.buyOrSell,
        exchange: rt.exchange,
        type: rt.orderType,
        stopPrice: parseFloat(rt.stopPrice) || '--',
        order_status: rt.status,
        symbol: rt.pair,
      }));
    },
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>
