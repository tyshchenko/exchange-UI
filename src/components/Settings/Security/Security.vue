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
      history: [],
    };
  },
  async created() {
    let data = [];
    data = await HistoryService.authhistoryData();
    let newData = [];
    if (data.error) {

    } else {
      data.data.forEach((val) => {

        let obj = {};

        obj.action = val[1] || '-';
        obj.time = new Date(val[0]) || '-';
        newData.push(obj);

      });
    }
    this.history = newData;
  },
};

</script>
<style src="./style.scss" lang="scss" scoped>

</style>
