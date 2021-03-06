<template src="./template.html"></template>

<script>
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
import SimpleBar from 'simplebar';
import Spinner from '@/components/Spinner/Spinner.vue';
import precisionMaps from '@/assets/json/precisionMaps.js';
import Decimal from 'decimal.js';
export default {
  name: 'order-book',
  components: {
    Spinner,
  },
  props: {
    parentHeight: Number,
  },
  data() {
    return {
      bids: [],
      asks: [],
      price: 0,
      tableHeight: '',
      orderHeight: '',
      timeout: '',
      showLoader: true,
      sum: 0,
      precisionNumber: 3,
      count: 1,
      barAsk: 0,
      barBid: 0,
    };
  },
  computed: {
    maxVol() {
      return Math.max(
        this.asks[0].totalVolume,
        this.bids[this.bids.length - 1].totalVolume
      );
    },
  },
  methods: {
    setprices(selectedprice) {
      ExchangeDataEventBus.$emit('selectedprice', {
        price: selectedprice,
      });
    },
    precision(key) {
      ExchangeDataEventBus.$emit('precision', {
        key,
        number: this.precisionNumber,
      });
      if (key === 'minus' && this.precisionNumber !== 0) {
        this.precisionNumber = this.precisionNumber - 1;
        this.count = parseFloat(
          new Decimal(this.count).dividedBy('10').toString()
        );
      } else if (key === 'plus' && this.precisionNumber !== 3) {
        this.precisionNumber = this.precisionNumber + 1;
        this.count = parseFloat(new Decimal(this.count).times(10).toString());
      }
      ExchangeDataEventBus.$emit('change-precision', {
        precisionPass: this.count,
        precisionNumber: this.precisionNumber,
      });
      this.timeout = setTimeout(() => this.scrollTopBookToBottom(), 2000);
    },
    scrollTopBookToBottom() {
      try {
        let el = document.getElementById('ob-hello1');
        let obj = new SimpleBar(el, {
          autoHide: false,
        });
        obj.getScrollElement().scrollTop = 9999999;
      } catch (e) {
        throw e;
        
      }
    },
    asksUpdater(parsedSnap) {
      if (parsedSnap && parsedSnap.asks && parsedSnap.asks.length) {
        let asks = [parsedSnap.asks.length,];
        for (let i = 0; i < parsedSnap.asks.length; i++) {
          if (i === 0) {
            parsedSnap.asks[i].totalVolume = parsedSnap.asks[i].volume;
          } else {
            parsedSnap.asks[i].totalVolume =
              parsedSnap.asks[i].volume + parsedSnap.asks[i - 1].totalVolume;
          }
          asks[parsedSnap.asks.length - (i + 1)] = parsedSnap.asks[i];
        }
        this.barAsk = asks[0].totalVolume;
        return asks;
      } else {
        this.barAsk = 0;
        return [];
      }
    },
    bidsUpdater(parsedSnap) {
      if (parsedSnap && parsedSnap.bids && parsedSnap.bids.length) {
        let bids = [];
        for (let i = parsedSnap.bids.length - 1; i >= 0; i--) {
          if (i === parsedSnap.bids.length - 1) {
            parsedSnap.bids[i].totalVolume = parsedSnap.bids[i].volume;
          } else {
            parsedSnap.bids[i].totalVolume =
              parsedSnap.bids[i].volume + parsedSnap.bids[i + 1].totalVolume;
          }
          bids.push(parsedSnap.bids[i]);
        }
        this.barBid = bids[bids.length - 1].totalVolume;
        return bids;
      } else {
        this.barBid = 0;
        return [];
      }
    },
    roundPriceByPrecision(price, precision) {
      let roundArray = [0.00001,0.000001,0.0000001,0.00000001,];
      let fractionDigitsArray = [5,6,7,8,];
      //returns price according to precesion
      let fractionDigits = fractionDigitsArray[precision];
      let round = roundArray[precision];
      if (round == 0) {
        return price.toFixed(fractionDigits);
      } else {
        return (parseInt(price / round) * round).toFixed(fractionDigits);
      }
    },
    saveSnapshotData(dataObj, snapshotData, precision, askOrBid) {
      const roundedPrice = this.roundPriceByPrecision(parseFloat(snapshotData.value), precision);
      if (!dataObj[askOrBid][roundedPrice]) {
        dataObj[askOrBid][roundedPrice] = {value:roundedPrice,volume:parseFloat(snapshotData.volume),};
      } else {
        dataObj[askOrBid][roundedPrice].volume = dataObj[askOrBid][roundedPrice].volume + parseFloat(snapshotData.volume);
      }
      if (dataObj[askOrBid][roundedPrice].volume === 0) {
        delete dataObj[askOrBid][roundedPrice];
      }
    },
  },
  watch: {
    parentHeight: function(newVal) {
      let height = newVal / 2;
      let orderHeight = newVal / 2;
      let calcHeight = height - 40;
      this.tableHeight = calcHeight + 'px';
      this.orderHeight = orderHeight + 'px';
    },
  },
  created() {
    const { selectedExchange, selectedPair, } = this.$store.getters;
    if (precisionMaps[`${selectedExchange}-_-${selectedPair}`]) {
      this.count = precisionMaps[`${selectedExchange}-_-${selectedPair}`];
    } else {
      this.count = 1;
    }
    this.snapshotListener = snap => {
      this.showLoader = false;
      let parsedSnap = JSON.parse(JSON.stringify(snap));
      let P0Data = {
        asks: {},
        bids: {},
      };
      let P1Data = {
        asks: [],
        bids: [],
      };
      parsedSnap.asks.forEach(i => {
        this.saveSnapshotData(P0Data, i, this.precisionNumber, 'asks');
      });
      parsedSnap.bids.forEach(i => {
        this.saveSnapshotData(P0Data, i, this.precisionNumber, 'bids');
      });
      for (let key_ask in P0Data.asks) {
        P1Data.asks.push(P0Data.asks[key_ask]);
      }
      for (let key_bid in P0Data.bids) {
        P1Data.bids.push(P0Data.bids[key_bid]);
      }
      this.asks = this.asksUpdater(P1Data);
      this.bids = this.bidsUpdater(P1Data);
      if ( this.bids.length > 0 && this.asks.length > 0 ) {
        this.$store.commit('liquidity', (( Math.abs(this.asks[0].totalVolume) + Math.abs(this.bids[this.bids.length - 1].totalVolume) )*Math.abs(this.price)).toFixed(2));
      }
      this.timeout = setTimeout(() => this.scrollTopBookToBottom(), 1000);
      this.$store.commit('removeLoaderTask', 1);
    };
    this.bookUpdateListener = snap => {
      let parsedSnap = JSON.parse(JSON.stringify(snap));
      let P0Data = {
        asks: {},
        bids: {},
      };
      let P1Data = {
        asks: [],
        bids: [],
      };
      parsedSnap.asks.forEach(i => {
        this.saveSnapshotData(P0Data, i, this.precisionNumber, 'asks');
      });
      parsedSnap.bids.forEach(i => {
        this.saveSnapshotData(P0Data, i, this.precisionNumber, 'bids');
      });
      for (let key_ask in P0Data.asks) {
        P1Data.asks.push(P0Data.asks[key_ask]);
      }
      for (let key_bid in P0Data.bids) {
        P1Data.bids.push(P0Data.bids[key_bid]);
      }
      this.asks = this.asksUpdater(P1Data);
      this.bids = this.bidsUpdater(P1Data);

      if ( this.bids.length > 0 && this.asks.length > 0 ) {
        this.$store.commit('liquidity', (( Math.abs(this.asks[0].totalVolume) + Math.abs(this.bids[this.bids.length - 1].totalVolume) )*Math.abs(this.price)).toFixed(2));
      }
      this.showLoader = false;
    };
    this.reset = () => {
      const { selectedExchange, selectedPair, } = this.$store.getters;
      this.showLoader = true;
      if (precisionMaps[`${selectedExchange}-_-${selectedPair}`]) {
        this.count = precisionMaps[`${selectedExchange}-_-${selectedPair}`];
      } else {
        this.count = 1;
      }
      this.asks = [];
      this.bids = [];
      this.precisionNumber = 3;
    };
    this.liveTradeListener = liveTrade => {
      if (liveTrade.buyOrSell == 'sell') {
        this.price = -liveTrade.price;
      } else {
        this.price = liveTrade.price;
      }
    };
    ExchangeDataEventBus.$on('liveTrades', this.liveTradeListener);
    ExchangeDataEventBus.$on('subscribe-exchange', this.reset);
    ExchangeDataEventBus.$on('change-symbol', this.reset);
    ExchangeDataEventBus.$on('snapshotOrderbook', this.snapshotListener);
    ExchangeDataEventBus.$on('updateOrderbook', this.bookUpdateListener);
  },
  mounted() {
    this.$root.$on('tickerClicked', () => {
      this.scrollTopBookToBottom();
    });
  },
  destroyed() {
    ExchangeDataEventBus.$off('snapshotOrderbook', this.snapshotListener);
    ExchangeDataEventBus.$off('updateOrderbook', this.bookUpdateListener);
    ExchangeDataEventBus.$off('subscribe-exchange', this.reset);
    ExchangeDataEventBus.$off('change-symbol', this.reset);
    clearInterval(this.timeout);
  },
};
</script>

<style src="./style.scss" lang="scss" scoped></style>
