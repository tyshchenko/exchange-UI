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
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
