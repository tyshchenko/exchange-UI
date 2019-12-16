import ApiCurryBase from './ApiCurryBase';
import axios from 'axios';

class TradeService {
  async placeNewOrder(requestBody) {
    let method = {
      'method': 'order.put_market',
      'id':1,
    };
    return (await ApiCurryBase.post('/', {method, requestBody,})).data;
  }

  async cancelOrder(requestBody) {
    return (await ApiCurryBase.post('/cancel-order', requestBody)).data;
  }

  async getRecentOrders() {
    return (await ApiCurryBase.get('/get-recent-orders')).data;
  }

  async getActiveOrders(exchange = '', pair = '') {
    return (await ApiCurryBase.post('/get-active-orders', {
      exchange,
      pair,
    })).data;
  }
  async getOpenPositions(exchange) {
    return (await ApiCurryBase.post('/get-open-positions', {
      exchange,
    })).data;
  }

  async getFees() {
    return (await ApiCurryBase.get('/fees')).data;
  }

  async getLedger(requestBody) {
    if (requestBody) {
      let response = await ApiCurryBase.post('/', {'method': 'balance.query','id':1, 'params':[1,],});
      let arr = [];
      let data = response.data;
      /* eslint-disable no-console */
      console.log(data.result);
      /* eslint-enable no-console */
      arr.push({'wallet_type':'exchange','currency':'BTC','locked_bal':Number(data.result.BTC.freeze),'avail_bal':Number(data.result.BTC.available),'total_bal':Number(data.result.BTC.freeze) + Number(Number(data.result.BTC.available))});
      arr.push({'wallet_type':'exchange','currency':'USD','locked_bal':Number(data.result.USD.freeze),'avail_bal':Number(data.result.USD.available),'total_bal':Number(data.result.USD.freeze) + Number(Number(data.result.USD.available))});
      return {'status':true,'message':'Balance','data':arr,};
    }

  }

  async getPairsList() {
    return (await ApiCurryBase.get('/pairs-list')).data;
  }

  async getMarginInfo(body) {
    //return (await ApiCurryBase.post('/bitfinex-margin-info', body)).data;
    if (body) {
        return {"status":true,"message":"Bitfinex Margin Info","data":{"user_pl":0,"user_swaps":0,"margin_balance":0,"margin_net":0,"margin_required":0}}
    }
  }

  async calculatePrices(body) {
    return (await ApiCurryBase.post('/calc-prices', body)).data;

  }

  async getBitmexContracts() {
    return (await ApiCurryBase.get('/get-bitmex-contracts')).data;
  }

  async setBitmexleverage(body) {
    return (await ApiCurryBase.post('/set-bitmex-position-leverage', body)).data;
  }

  async bitmexGetTradingHistory(symbol) {
    let params = {
      symbol: symbol,
    };
    let response = await axios.post('https://bds.blocknomic.com/get-bitmex-trades', params);
    return response.data.tokens;
  }
  async bitmexGetLiquidationOrders() {
    return (await ApiCurryBase.post('/bitmex-liquidation-orders')).data;

  }
  async bitmexWalletSummary() {
    return (await ApiCurryBase.post('/bitmex-wallet-summary')).data;

  }
  async bitmexTransferMargin(symbol, amount) {
    return (await ApiCurryBase.get('/bitmex-transfer-margin', {
      symbol,
      amount,
    })).data;

  }
  async bitmexRiskLimit(symbol, riskLimit) {
    return (await ApiCurryBase.get('/bitmex-risk-limit', {
      symbol,
      riskLimit,
    })).data;

  }
  async bitmexClosePosition(symbol) {
    return (await ApiCurryBase.post('/bitmex-close-position', {
      symbol,
    })).data;

  }
  async bitmexCancelAllOrderAfter(timeout) {
    return (await ApiCurryBase.get('/bitmex-cancel-all-order-after', {
      timeout,
    })).data;

  }
  async bitmexDeleteAllOrder(filter) {
    return (await ApiCurryBase.get('/bitmex-delete-all-order', filter)).data;

  }
  async bitmexDeleteSingleOrder(orderID, clOrdID) {
    return (await ApiCurryBase.get('/bitmex-delete-single-order', {
      orderID,
      clOrdID,
    })).data;

  }
  async bitmexGetUserMargin() {
    return (await ApiCurryBase.post('/bitmex-user-margin')).data;

  }
  async bitmexGetDepositAddress() {
    return (await ApiCurryBase.get('/bitmex-deposit-address')).data;

  }
  async bitmexGetOpenOrderHistory() {
    return (await ApiCurryBase.get('/bitmex-open-orders')).data;

  }
  async bitmexSetLeverage(symbol, leverage) {
    return (await ApiCurryBase.post('/set-bitmex-position-leverage', {
      symbol,
      leverage,
    })).data;

  }
  async bitmexGetPairList() {
    return (await ApiCurryBase.post('/fetch-bitmex-pair-list')).data;

  }
  async bitmexOrders(data) {
    return (await ApiCurryBase.post('/place-bitmex-orders', {
      data,
    })).data;

  }

  async bitmexGetOpenPositions() {
    return (await ApiCurryBase.post('/fetch-bitmex-open-positions')).data;

  }
  async bitmexGetSwapFundingHistory() {
    return (await ApiCurryBase.post('/fetch-bitmex-swap-funding-history')).data;

  }
  async bitmexGetPositionsHistory() {
    return (await ApiCurryBase.post('/fetch-bitmex-positions-history')).data;

  }
  async bitmexGetOrderHistory() {
    return (await ApiCurryBase.post('/fetch-bitmex-order-history')).data;

  }
  async bitmexGetBalanceFromBitmex() {
    return (await ApiCurryBase.post('/fetch-bitmex-balance')).data;

  }
}


export default new TradeService();
