<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import HistoryService from '@/services/HistoryService.js';

const loggedInUser = LocalStorage.get(Keys.username);

export default {
  name: 'security',
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
    show2fa() {
      this.show2fa=true;
    },
    enable2fa() {
      this.show2fa=true;
    },
    disable2fa() {
      this.show2fa=true;
    },
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
