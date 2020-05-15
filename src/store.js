import Vue from 'vue';
import Vuex from 'vuex';
import {
  dateToDisplayTime,
} from '@/utils/utility';
// import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from "constants";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    themeMode: 'default',
    theme: {
      'default': {
        'main-bg-color': '#13151a',
        'header-bg-color': '#262830',
        'header-border-color': '#415b62',
        'tab-button-background-color': '#2846A5',
        'primary-text-color': '#ffffff',
        'miner-sub-text-color': '#909ca0',
        'mobile-bg-color': '#415b62',
        'green-color': '#5fd66a',
        'red-color': '#ff5353',
        'sec-mobile-bg-color': '#248fff',
        'pri-label-color': '#879fad',
        'just-black ': '#000000',
        'placeholder-color': '#999999',
        'border-bottom-color': '#1e2c31',
        'border-right-color ': '#445f66',
        'tab-color': '#2846A5',
        'silder-bg-color': '#d3d3d3,',
        'secondary-modal-bg-color': '#0F1E23',
        'container-bg-color': '#121E22',
      },
    },
    ledger: [],
    websocketStatus: 'Closed',
    activeOrders: [],
    recentTrades: [],
    loaderCounter: 0,
    loaderCancellable: false,
    isLoggedIn: false,
    isPhoneVerified: true, //change to true to enable phone verification
    isKycVerified: false,
    sidebarOpen: false,
    tradePaneClosed: false,
    bookPaneClosed: false,
    liveTradePrice: 0,
    volume24h: 0,
    volumeMonth: 0,
    liquidity: 0,
    tickerCache: {},
    priceAnalysisSnapShot: {},
    selectedPair: 'BTC/USD',
    selectedExchange: 'bitfinex',
    supportedPairs: [],
    totalPortfolioValue: 0,
    tpvCurrency: 'USD',
    limitTab: false,
    tickerData: {},
    availablePairs: [],
    availableExchanges: ['bitfinex', ],
    buyPrice: 0,
    sellPrice: 0,
    precision: 0.0001,
    tickerDataExc: {},
    bitmexPairs: [],
  },
  getters: {
    websocketStatus(state) {
      return state.websocketStatus;
    },
    themeMode(state) {
      return state.themeMode;
    },
    limitTab(state) {
      return state.limitTab;
    },
    supportedPairs(state) {
      return [...new Set(state.supportedPairs), ];
    },
    selectedPair(state) {
      return state.selectedPair;
    },
    isLoggedIn(state) {
      return state.isLoggedIn;
    },
    currentTime() {
      return dateToDisplayTime();
    },
    ledger(state) {
      return state.ledger;
    },
    activeOrders(state) {
      return state.activeOrders;
    },
    recentTrades(state) {
      return state.recentTrades;
    },
    showLoader(state) {
      return state > 0;
    },
    loaderCancellable(state) {
      return state.loaderCancellable;
    },
    isPhoneVerified(state) {
      return state.isPhoneVerified; //change to true to enable phone verification
    },
    isKycVerified(state) {
      return state.isKycVerified;
    },
    sidebarOpen(state) {
      return state.sidebarOpen;
    },
    liveTradePrice(state) {
      return state.liveTradePrice;
    },
    liquidity(state) {
      return state.liquidity;
    },
    volume24h(state) {
      return state.volume24h;
    },
    tickerCache(state) {
      return state.tickerCache;
    },
    priceAnalysisSnapShot(state) {
      return state.priceAnalysisSnapShot;
    },
    selectedExchange(state) {
      return state.selectedExchange;
    },
    formattedSelectedExchange(state) {
      switch (state.selectedExchange) {
        case 'bequant':
          return 'bequant';
        default:
          return (
            state.selectedExchange.charAt(0).toUpperCase() +
                        state.selectedExchange.slice(1)
          );
      }
    },
    getTickerData(state) {
      return state.tickerData;
    },
    getccTickerData(state) {
      return state.tickerData[state.selectedPair.split('/')[0]][
                state.selectedPair
      ].exchanges;
    },
    getSelectedPairExchanges(state) {
      return state.availableExchanges;
    },
    getAvailablePairs(state) {
      return state.availablePairs;
    },
    buyPrice(state) {
      return state.buyPrice;
    },
    sellPrice(state) {
      return state.sellPrice;
    },
    precisionSelectedpair(state) {
      return state.precision;
    },
  },
  mutations: {
    changeWebsocketStatus(state, websocketStatus) {
      state.websocketStatus = websocketStatus;
    },
    changeLimitTab(state) {
      state.limitTab = true;
    },
    changeMarketTab(state) {
      state.limitTab = false;
    },
    isLoggedIn(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
    ledger(state, newLedger) {
      state.ledger = newLedger;
      store.commit('totalPortfolioValue');
    },
    activeOrders(state, newValue) {
      state.activeOrders = newValue;
    },
    recentTrades(state, newValue) {
      state.recentTrades = newValue;
    },
    addLoaderTask(state, count, cancellable = false) {
      // console.log(count);
      state.loaderCounter += count;
      state.loaderCancellable = cancellable;
    },
    removeLoaderTask(state, count) {
      // console.log(count);
      if (state.loaderCounter > 0) {
        state.loaderCounter -= count;
        state.loaderCancellable = false;
      } else if (state.loaderCounter < 0) {
        state.loaderCounter = 0;
      }
    },
    isPhoneVerified(
      state
      // value //uncomment to enable phone verification
    ) {
      state.isPhoneVerified = true;
      // state.isPhoneVerified = value; //uncomment to enable phone verification
    },
    isKycVerified(state, value) {
      state.isKycVerified = value;
    },
    toggleSidebar(state) {
      if (!state.sidebarOpen) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleTradePaneClosed(state) {
      state.tradePaneClosed = !state.tradePaneClosed;
    },
    toggleBookPaneClosed(state) {
      state.bookPaneClosed = !state.bookPaneClosed;
    },
    closeSidebar(state) {
      if (!state.sidebarOpen) {
        return;
      }
      this.commit('toggleSidebar');
    },
    liveTradePrice(state, ltp) {
      state.liveTradePrice = ltp;
    },
    volume24h(state, ltp) {
      state.volume24h = ltp;
    },
    liquidity(state, ltp) {
      state.liquidity = ltp;
    },
    tickerCache(state, ticker) {
      state.tickerCache = ticker;
    },
    priceAnalysisSnapShot(state, snapshot) {
      state.priceAnalysisSnapShot = snapshot;
    },
    selectedExchange(state, exchange) {
      state.selectedExchange = exchange;
    },
    selectedPair(state, exchange) {
      state.selectedPair = exchange;
    },
    addSupportedPair() {
      // state.supportedPairs.push(pair);
    },
    totalPortfolioValue(state) {
      state.totalPortfolioValue = state.ledger
                .reduce((tpv, {
                  currency,
                  total,
                }) => {
                  currency = currency.toUpperCase();
                  let sellPrice = 1;
                  if (currency !== state.tpvCurrency) {
                    sellPrice =
                            ((((
                              (state.tickerData[currency] || {})[
                                    `${currency}/${state.tpvCurrency}`
                              ] || {}
                            ).best || {}).bids || {})[0] || {}).price || 0;
                  }
                  tpv += sellPrice * total;
                  return tpv;
                }, 0)
                .toFixed(3);
    },
    changeTickerData(state, data) {
      // alert("change");
      state.tickerData = data;
    },
    changePairData(state, data) {
      state.availablePairs = data;
    },
    setAvailableExchanges(state) {
      state.availableExchanges = Object.keys(
        state.tickerData[state.selectedPair.split('/')[0]][state.selectedPair]
                .exchanges
      );
    },
    buyPrice(state, price) {
      state.buyPrice = price;
    },
    sellPrice(state, price) {
      state.sellPrice = price;
    },
    precisionMap(state, map) {
      state.precision = map;
    },
  },
  actions: {
    toggleTheme({
      state,
    }, themeMode) {
      state.themeMode = themeMode;
      const themeObj = Object.keys(state.theme[themeMode]);
      for (let i = 0; i < themeObj.length; i++) {
        document.documentElement.style.setProperty(`--${themeObj[i]}`, state.theme[themeMode][themeObj[i]]);
      }
    },
  },
});


export default store;
