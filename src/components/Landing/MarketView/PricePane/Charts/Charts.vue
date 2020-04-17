// <template src="./template.html"></template>

<script>
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
export default {
  name: 'charts',
  data() {
    return {
      exchange: this.$store.state.selectedExchange,
      bitmexPathVariable: '',
    };
  },
  mounted() {
    let str1 = this.$store.state.selectedPair.toUpperCase();
    let res1 = str1.split('/');
    let noSlashPairBitfinex = res1[0] + res1 [1];
    this.bitmexPathVariable = `https://bitmex.blocknomic.com/index.html?symbol=BITFINEX%3A${noSlashPairBitfinex.toUpperCase()}&exchange=bitfinex`;
  },
  methods: {
  },
  destroyed() {
    ExchangeDataEventBus.$emit('unsubscribe-candles');
    ExchangeDataEventBus.$off('snapshotCandles');
  },
};
</script>


// <style lang="scss" src="./style.scss" scoped></style>
