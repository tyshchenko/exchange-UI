<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import WalletService from '@/services/WalletService.js';
import axios from 'axios';

const loggedInUser = LocalStorage.get(Keys.username);

export default {
  name: 'kyc',
  data () {
    return {
      activeTab: 'KYC',
      email:loggedInUser,
      displayFlag: false,
      kyc: {
        firstname:'',
        lastname:'',
        phone:'',
        country:'',
      },
    };
  },
  async created() {
    let data = await WalletService.loadkyc();
    if (data.error) {
      /* eslint-disable no-console */
      console.log(data.error);
      /* eslint-enable no-console */

    } else {
      /* eslint-disable no-console */
      console.log(this.kyc);
      /* eslint-enable no-console */
      this.kyc = data.data;
      /* eslint-disable no-console */
      console.log(data.data);
      console.log(this.kyc);
      /* eslint-enable no-console */
    }
  },
  methods: {
    async save() {
      this.$showSuccessMsg({
        message: 'Saving personal information ... ',
      });
      const response = await WalletService.savekyc(this.kyc);
      if (response.Status == 1) {
        this.$showSuccessMsg({
          message: 'Done',
        });
      } else {
        this.$showErrorMsg({
          message: response.Result,
        });
        /* eslint-disable no-console */
        console.log(response);
        /* eslint-enable no-console */
      }
    },
    uploadImage(event) {

      const URL = '/api/upload'; 

      let data = new FormData();
      data.append('name', loggedInUser);
      data.append('id', event.target.id);
      data.append('file', event.target.files[0]); 

      let config = {
        header : {
          'Content-Type' : 'image/png'
        }
      }

      axios.put(
        URL, 
        data,
        config
      ).then(
        response => {
          /* eslint-disable no-console */
          console.log(response);
          /* eslint-enable no-console */
          this.$showSuccessMsg({
            message: 'Uploading file ... ',
          });
        }
      )
    },
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
