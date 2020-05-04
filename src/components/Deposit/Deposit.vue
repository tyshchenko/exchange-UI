<template src="./template.html"></template>

<script>
import BitfinexDepositAddress from './BitfinexDepositAddress/BitfinexDepositAddress';

export default {
  name: 'deposit',
  components: {
    BitfinexDepositAddress,
  },
  data () {
    return {
      activeTab: 'XCoinBae',
      tabs: ['XCoinBae',],
    };
  },
  methods: {
    onDropDownTabChange(tab) {
      this.activeTab = tab;
    },
  },
};
</script>
<style src="./style.scss" lang="scss" scoped>

</style>
