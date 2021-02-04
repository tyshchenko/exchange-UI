<template src="./template.html"></template>

<script>
import DepositService from '@/services/DepositService.js';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import EventBus, { EventNames, } from '@/eventBuses/default';

export default {
  name: 'bitfinex-deposit-address',
  components: {
  },
  
  data() {
    return {
      selectedMethod: 'SELECT A CURRENCY',
      destinationAddress: '',
      bitfinexMethodTypes: ['bitcoin','anker',],
      currentImgUrl: '/img/qr.png',
    };
  },
  methods: {
    async changeSelectedMethod (newVal) {
      this.selectedMethod = newVal;
      let data = [];
      let mqttKey = LocalStorage.get(Keys.mqtt);
      data = await DepositService.fetchDespositAddress(mqttKey, newVal);
      if(data.Status==1) {
        if(data.Result) {
          this.destinationAddress = data.Address;
          this.currentImgUrl = process.env.VUE_APP_CURRY_API_BASE_URL + 'qr/' + data.Address;
        } else {
          this.destinationAddress = '';
        }
      }
      else {
        this.destinationAddress = '';
        if(data.Result) {
          this.$showErrorMsg({
            message: data.Result,
          });
        } else {
          this.$showErrorMsg({
            message: 'Error Fetching Wallet Details',
          });
        }
        if (data.Expired==1) {
          EventBus.$emit(EventNames.userLogout);
        }
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
