<template src="./template.html"></template>

<script>
import WalletService from '@/services/WalletService.js';
import Spinner from '@/components/Spinner/Spinner.vue';

export default {
  name: 'wallet-summary',
  components: {
    Spinner,
  },
  data() {
    return {
      bitfinexSummary: [],
      initialData: [],
      loading: [],
      fromValue: [],
      toValue: [],
      amount: [],
      spinnerFlag: true,
      searchString: '',
      sortBy: 0,
    };
  },
  async created() {
    this.creating();
  },
  methods: {
    async creating () {
      this.bitfinexSummary =(await TradeService.getLedger()).data;
      let data = await WalletService.bitfinexWalletSummary();
      let newData = [];
      if(data.error) {
        this.spinnerFlag = false;
        this.initialData = [];
        this.$showErrorMsg({
          message: 'Notice: Invalid API-KEY or API-KEYS not Entered.',
        });
      } else {
        this.spinnerFlag = false;
        this.initialData = this.sortingData(data.data);
        data.data.forEach((val) => {
          let obj = {};
          if(val[5]>0) {
            obj.id = val[0] || '-';
            obj.currency = val[1] || '-';
            obj.currencyName = val[2] || '-';
            obj.status = val[3] || '-';
            obj.movementLastUpdated = new Date(val[4]) || '-';
            obj.amount = val[5] || '-';
            obj.fees = (val[6]* (-1)) || '-';
            obj.destinationAddress = val[7] || '-';
            obj.transactionHash = val[8] || '-';
            newData.push(obj);
          }
        });
      }
      this.initialData = newData;
    },

  },

};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>


