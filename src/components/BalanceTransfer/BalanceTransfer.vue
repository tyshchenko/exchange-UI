<template src="./template.html"></template>

<script>
import TabBar from '@/components/TabBar/TabBar.vue';

export default {
  name: 'balance-transfer',
  components: {
    TabBar,
  },
  data() {
    return {
      activeTab: 'BITFINEX',
      tabs: [
        'BITFINEX',
      ],
      tabRouteMapping: {
        'BITFINEX': '/balance',
      },
    };
  },
  methods: {
    onTabChange(activeTab) {
      this.activeTab = activeTab;
    },
  },
};
</script>
<style lang="scss" src="./style.scss" scoped>

</style>
