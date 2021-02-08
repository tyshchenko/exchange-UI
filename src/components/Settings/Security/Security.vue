<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import HistoryService from '@/services/HistoryService.js';
import WalletService from '@/services/WalletService.js';
import VueQrcode from 'vue-qrcode';

const loggedInUser = LocalStorage.get(Keys.username);

export default {
  name: 'security',
  components: {
    VueQrcode,
  },
  data () {
    return {
      activeTab: 'Security',
      email:loggedInUser,
      displayFlag: false,
      enabled2fa: false,
      history: [],
      kycdone: false,
      username:'',
      show2fa:false,
      qrcodevalue:'',
      qrready:false,
    };
  },
  async created() {
    let data = [];
    data = await HistoryService.authhistoryData();
    let newData = [];
    if (data.error) {
      /* eslint-disable no-console */
      console.log(data.error);
      /* eslint-enable no-console */

    } else {
      data.data.forEach((val) => {

        let obj = {};

        obj.action = val.action || '-';
        obj.time = val.time || '-';
        newData.push(obj);

      });
    }
    this.history = newData;
    let datastatus = await WalletService.loadstatus();
    if (datastatus.error) {
      /* eslint-disable no-console */
      console.log(datastatus.error);
      /* eslint-enable no-console */

    } else {
      this.enabled2fa = datastatus.data.otp;
      this.kycdone = datastatus.data.kyc;
      this.username = datastatus.data.username;
    }
  },
  methods: {
    showme2fa() {
      this.show2fa=true;
      let dataqr = await WalletService.loadqr();
      if (dataqr.error) {
        /* eslint-disable no-console */
        console.log(dataqr.error);
        /* eslint-enable no-console */

      } else {
        this.qrcodevalue = dataqr.data;
        this.qrready = true;
      }
    },
    enable2fa() {
      let dataqr = await WalletService.enable2fa();
      if (dataqr.error) {
        /* eslint-disable no-console */
        console.log(dataqr.error);
        /* eslint-enable no-console */
        this.$showErrorMsg({
          message: dataqr.error,
        });
        
      } else {
        this.$showSuccessMsg({
          message: '2FA Verification enabled',
        });

      }
    },
    disable2fa() {
      let dataqr = await WalletService.disable2fa();
      if (dataqr.error) {
        /* eslint-disable no-console */
        console.log(dataqr.error);
        /* eslint-enable no-console */
        this.$showErrorMsg({
          message: dataqr.error,
        });
        
      } else {
        this.$showSuccessMsg({
          message: '2FA Verification dasabled',
        });

      }
    },
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
