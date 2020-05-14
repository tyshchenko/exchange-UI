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
    data = await TradeService.getFuturesOrders();
    let newData = [];
    if (data.data.error) {
      this.spinnerFlag = false;
      this.initialData = [];
      this.history = [];
      this.displayText = '';

    } else {
      this.spinnerFlag = false;
      data.data.forEach((val) => {
        let obj = {};
        obj.SYMBOL = val.pair, || '-';
        obj.STATUS = val.status || '-';
        obj.AMOUNT = val.amount || '-';
        obj.BASE_PRICE = (parseFloat(val.startMoney) / parseFloat(val.amount)).toFixed(2) || '-';
        obj.MARGIN_FUNDING = parseFloat(val.startMoney).toFixed(2) || '-';
        obj.MARGIN_FUNDING_TYPE = '-';
        obj.PL =  '-';
        obj.PL_PERC =  '-';
        obj.PRICE_LIQ = parseFloat(val.stopPrice).toFixed(2) || '-';
        obj.LEVERAGE = 10 || '-';
        obj.ID = val.id || '-';
        obj.MTSCREATE = new Date(val.placedTime * 1000) || '-';
        obj.MTSUPDATE = new Date(val.placedTime * 1000) || '-';
        newData.push(obj); 
      });
    }
    this.initialData = newData;
    if(this.history.length === 0)
      this.displayText = 'No Records Found.';
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
        return ele.SYMBOL.includes(this.searchString.toUpperCase()) || ele.PL.toString().includes(this.searchString) || ele.ID.toString().includes(this.searchString) ;
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
            return a.STATUS - b.STATUS;
          });
        case 102: 
          return data.sort((b,a) => {
            return b.STATUS - a.STATUS;
          });
        case 201: 
          return data.sort((b,a) => {
            return a.AMOUNT - b.AMOUNT;
          });
        case 202: 
          return data.sort((b,a) => {
            return b.AMOUNT - a.AMOUNT;
          });
        case 301: 
          return data.sort((b,a) => {
            return a.PL_PERC - b.PL_PERC;
          });
        case 302: 
          return data.sort((b,a) => {
            return b.PL_PERC - a.PL_PERC;
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
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>


