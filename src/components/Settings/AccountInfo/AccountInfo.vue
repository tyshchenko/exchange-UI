<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

const loggedInUser = LocalStorage.get(Keys.username);

export default {
  name: 'account-info',
  data () {
    return {
      activeTab: 'Account Info',
      email:loggedInUser,
      displayFlag: false,
    };
  },
  methods: {
    gotokyc() {
      this.activeTab = 'KYC';
    },
    goto2fa() {
      this.activeTab = 'Security';
    },
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
