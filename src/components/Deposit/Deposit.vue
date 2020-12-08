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
      activeTab: 'CRYPTO',
      tabs: ['CRYPTO',],
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
