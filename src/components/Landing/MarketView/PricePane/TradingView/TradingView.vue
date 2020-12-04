<template src="./template.html"></template>

<script>
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
import Datafeed from './datafeed.js';

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(window.location.search);
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}



export default {
  name: 'trading-view',
  props: {
    symbol: {
      default: 'CoinBae:ANKER/BTC',
      type: String,
    },
    interval: {
      default: '5',
      type: String,
    },
    containerId: {
      default: 'tv_chart_container',
      type: String,
    },
    datafeedUrl: {
      default: 'https://demo_feed.tradingview.com',
      type: String,
    },
    libraryPath: {
      default: '/charting_library/',
      type: String,
    },
    chartsStorageUrl: {
      default: 'https://saveload.tradingview.com',
      type: String,
    },
    chartsStorageApiVersion: {
      default: '1.1',
      type: String,
    },
    clientId: {
      default: 'tradingview.com',
      type: String,
    },
    userId: {
      default: 'public_user_id',
      type: String,
    },
    fullscreen: {
      default: false,
      type: Boolean,
    },
    autosize: {
      default: true,
      type: Boolean,
    },
    studiesOverrides: {
      type: Object,
    },
  },
  tvWidget: null,
  mounted() {
    const widgetOptions = {
      symbol: this.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: Datafeed,
      interval: this.interval,
      container_id: this.containerId,
      library_path: this.libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: [],
      enabled_features: [],
      charts_storage_url: this.chartsStorageUrl,
      charts_storage_api_version: this.chartsStorageApiVersion,
      client_id: this.clientId,
      user_id: this.userId,
      fullscreen: this.fullscreen,
      autosize: this.autosize,
      theme:'Dark',
      studies_overrides: this.studiesOverrides,

    };
    const tvWidget = new window.TradingView.widget(widgetOptions);
    this.tvWidget = tvWidget;
    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
      });
    });
  },
  destroyed() {
    if (this.tvWidget !== null) {
      this.tvWidget.remove();
      this.tvWidget = null;
    }
    ExchangeDataEventBus.$emit('unsubscribe-candles');
    ExchangeDataEventBus.$off('snapshotCandles');
  },
};
</script>


<style lang="scss" src="./style.scss" scoped></style>
