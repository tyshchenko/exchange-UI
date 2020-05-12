<template src="./template.html"></template>

<script>
import TradeService from '@/services/TradeService';
import Spinner from '@/components/Spinner/Spinner.vue';
import { dateToDisplayDateTime, } from '@/utils/utility';

export default {
  name: 'balance-history',
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
    let data = await TradeService.getBalanceHistory();
    this.spinnerFlag = false;
    let newData = [];
    data.data.forEach((val) => {
      let obj = {};
      obj.asset = val.asset || '-';
      obj.time = new Date(val.time * 1000) || '-';
      obj.business = val.business || '-';
      obj.change = val.change || '-';
      obj.balance = val.balance || '-';
      obj.detail = val.detail || '-';
      newData.push(obj);
    });
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
        return ele.asset.includes(this.searchString.toUpperCase()) || ele.business.toString().includes(this.searchString) || ele.detail.toString().includes(this.searchString) ;
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
            return a.change - b.change;
          });
        case 102: 
          return data.sort((b,a) => {
            return b.change - a.change;
          });
        case 201: 
          return data.sort((b,a) => {
            return a.balance - b.balance;
          });
        case 202: 
          return data.sort((b,a) => {
            return b.balance - a.balance;
          });
        case 301: 
          return data.sort((b,a) => {
            return a.asset - b.asset;
          });
        case 302: 
          return data.sort((b,a) => {
            return b.asset - a.asset;
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


