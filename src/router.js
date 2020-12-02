import Vue from 'vue';
import Router from 'vue-router';
import Settings from '@/components/Settings/Settings.vue';
import History from '@/components/History/History.vue';
import WalletSummary from '@/components/WalletSummary/WalletSummary.vue';
import ActiveTradesMobile from '@/components/ActiveTradesMobile/ActiveTradesMobile.vue';
import LocalStorage from '@/utils/localStorage.js';
import EventBus, {
  EventNames,
} from '@/eventBuses/default';
import Landing from '@/components/Landing/Landing.vue';
import Ticker from '@/components/TickerPage/TickerPage.vue';
import TradeModalMobile from '@/components/TradeModalMobile/TradeModalMobile';

Vue.use(Router);

const vueRouter = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: Landing,
    meta: {
      pageTitle: 'AnkerSwap',
    },
  }, {
    path: '/markets',
    name: 'ticker-page',
    component: Ticker,
    meta: {
      pageTitle: 'Markets',
    },
  }, {
    path: '/active-trades',
    name: 'active-trades-mobile',
    component: ActiveTradesMobile,
    meta: {
      pageTitle: 'Active Trades',
    },
  }, {
    path: '/trade-modal',
    name: 'trade-modal-mobile',
    component: TradeModalMobile,
    meta: {
      pageTitle: 'Trade',
    },
  }, {
    path: '/settings',
    component: Settings,
    name: 'settings',
    meta: {
      pageTitle: 'Settings - AnkerSwap.',
      needLogin: true,
    },
  }, {
    path: '/balance',
    component: WalletSummary,
    name: 'wallet-summary',
    meta: {
      pageTitle: 'Wallets - AnkerSwap.',
      needLogin: true,
    },
  }, {
    path: '/history',
    name: 'history',
    component: History,
    meta: {
      pageTitle: 'History - AnkerSwap.',
      needLogin: true,
    },

  },
  ],
});

vueRouter.beforeEach((to, from, next) => {
  if (to.meta.needLogin && !LocalStorage.isUserLoggedIn()) {
    EventBus.$emit(EventNames.userSessionExpired);
    return next(false);
  }
  document.title = to.meta.pageTitle;
  return next();
});

vueRouter.afterEach(() => {
  Vue.nextTick().then(() => {
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);
  });
});

export default vueRouter;
