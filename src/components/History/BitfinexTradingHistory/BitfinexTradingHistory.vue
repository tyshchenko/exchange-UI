<template src="./template.html"></template>

<script>
import TradeService from '@/services/TradeService';
import Spinner from '@/components/Spinner/Spinner.vue';
import { dateToDisplayDateTime, } from '@/utils/utility';

export default {
  name: 'bitfinex-trading-history',
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
    let data = [];
    let recentTrades = await TradeService.getRecentOrders();
    this.initialData = this.mapRecentTrades(recentTrades.data);
    this.updateData();
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
        return ele.Pair.includes(this.searchString.toUpperCase()) || ele.ORDER_ID.toString().includes(this.searchString) || ele.id.toString().includes(this.searchString) ;
      });
      this.history = this.sortData(this.history);
    },
    sortData(data) {
      switch(this.sortBy) {
        case 0: 
          return data.reverse();
        case 1: 
          return data;
        case 101: 
          return data.sort((b,a) => {
            return a.ORDER_PRICE - b.ORDER_PRICE;
          });
        case 102: 
          return data.sort((b,a) => {
            return b.ORDER_PRICE - a.ORDER_PRICE;
          });
        case 201: 
          return data.sort((b,a) => {
            return a.EXEC_AMOUNT - b.EXEC_AMOUNT;
          });
        case 202: 
          return data.sort((b,a) => {
            return b.EXEC_AMOUNT - a.EXEC_AMOUNT;
          });
        case 301: 
          return data.sort((b,a) => {
            return a.EXEC_PRICE - b.EXEC_PRICE;
          });
        case 302: 
          return data.sort((b,a) => {
            return b.EXEC_PRICE - a.EXEC_PRICE;
          });
        // case 301: 
        //   return data.sort((b,a) => {
        //     return a.MTS_CREATE - b.MTS_CREATE;
        //   });
        // case 302: 
        //   return data.sort((b,a) => {
        //     return b.MTS_CREATE - a.MTS_CREATE;
        //   });
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
    mapRecentTrades(rtArr = []) {
      return rtArr.map(rt => ({
        id: rt.id,
        ORDER_ID: rt.clientOrderId,
        MTS_CREATE: new Date(rt.placedTime * 1000),
        EXEC_AMOUNT: parseFloat(rt.amount),
        amount_orig: parseFloat(rt.amount),
        ORDER_PRICE: parseFloat(rt.avgPrice),
        ORDER_TYPE: rt.buyOrSell,
        exchange: rt.exchange,
        MAKER: rt.orderType,
        EXEC_PRICE: parseFloat(rt.stopPrice) || '--',
        order_status: rt.status,
        filled: rt.filled,
        Pair: rt.pair,
      }));
    },
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>


