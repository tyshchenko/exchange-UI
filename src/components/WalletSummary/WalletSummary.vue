<template src="./template.html"></template>

<script>
import Spinner from '@/components/Spinner/Spinner.vue';
import TradeService from '@/services/TradeService';

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
      this.spinnerFlag = false;
    },

  },

};
</script>
<style lang="scss" src="./style.scss" scoped>
</style>


