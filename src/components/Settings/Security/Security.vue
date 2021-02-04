<template src="./template.html"> 
</template>

<script>
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

const loggedInUser = LocalStorage.get(Keys.username);

export default {
  name: 'security',
  data () {
    return {
      activeTab: 'Security',
      email:loggedInUser,
      displayFlag: false,
    };
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
