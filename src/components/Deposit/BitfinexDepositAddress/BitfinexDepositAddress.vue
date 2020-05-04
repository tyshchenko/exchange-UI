<template src="./template.html"></template>

<script>
import DepositService from '@/services/DepositService.js';

export default {
  name: 'bitfinex-deposit-address',
  components: {
  },
  
  data() {
    return {
      selectedMethod: 'SELECT A CURRENCY',
      destinationAddress: '',
      bitfinexMethodTypes: ['bitcoin',],
    };
  },
  methods: {
    async changeSelectedMethod (newVal) {
      this.selectedMethod = newVal;
      let data = [];
      data = await DepositService.fetchDespositAddress('8', newVal);
      if(data.Status) {
        if(data.Result) {
          this.destinationAddress = data.Address;
        } else {
          this.destinationAddress = '';
        }
      }
      else {
        this.destinationAddress = '';
        this.$showErrorMsg({
          message: 'Error Fetching Wallet Details',
        });
      }
    },
    copyReferral() {
      let copyText = document.querySelector('#destination_Address');
      copyText.select();
      copyText.select();
      document.execCommand('copy');
      // alert("Copied the text: " + copyText.value);
      this.$showSuccessMsg({ message: 'Wallet Address copied successfully.', });
    }, 
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>

</style>
