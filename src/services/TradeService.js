import ApiCurryBase from './ApiCurryBase';
import axios from 'axios';

class TradeService {
  async placeNewOrder(requestBody) {
    /* eslint-disable no-console */
    console.log(requestBody);
    /* eslint-enable no-console */
    let side = 1;
    if (requestBody.bos =='buy') {
      side = 2;
    }
    let params = [1,'BTCUSD',side,requestBody.amount,'0.00','',];
    let type = 'order.put_market';
    if (requestBody.type == 'limit') {
      type = 'order.put_limit';
      params = [1,'BTCUSD',side,requestBody.amount,requestBody.price,'0.00','0.00','',];
    }
    let method = {
      'method': type,
      'id':1,
      'params':params,
    };
    //equestBody: {pair: "BTC/USD", type: "market", exc: "bitfinex", bos: "buy", amount: "1", moe: "market"}
    //{"id":2,"method":"order.put_market","params":[1,"BTCUSD",2,"0.02","0.002",""]}: 
    let responce = (await ApiCurryBase.post('/', method)).data;
    responce.status = true;
    responce.data = responce.result;
    responce.data.message = 'success';
    responce.data.volume = responce.result.amount;
    /* eslint-disable no-console */
    console.log(responce);
    /* eslint-enable no-console */
    return responce;
  }

  async cancelOrder(requestBody) {
    let params = [1,'BTCUSD',requestBody.orderId,];
    let method = {
      'method': 'order.cancel',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    /* eslint-disable no-console */
    console.log(responce);
    /* eslint-enable no-console */
    responce.status = true;
    responce.data = responce.result;
    responce.data.message = 'success';
    return responce;
  }

  async getRecentOrders() {
    return (await ApiCurryBase.get('/get-recent-orders')).data;
  }

  async getActiveOrders(exchange = '', pair = '') {
    //get-active-orders

    let response = await ApiCurryBase.post('/', {'method': 'order.pending','id':1, 'params':[1,'BTCUSD',0,50,],});
    let data = response.data;
    /* eslint-disable no-console */
    console.log(data.result.records);
    /* eslint-enable no-console */
    let outputdata = data.result.records.map(rt => ({
      id: rt.id,
      clientOrderId: rt.id,
      orderId: rt.id,
      placedTime: rt.ctime,
      amount: rt.amount,
      avgPrice: rt.price,
      buyOrSell: rt.side==2 ? 'buy' : 'sell',
      exchange: 'XCoinBae',
      orderType: '',
      stopPrice:  rt.price,
      status: rt.deal_stock>0 ? 'part.filled' : 'pending',
      pair: rt.market,
    }));
    return {data:outputdata,};
  }
  
  async getOpenPositions(exchange) {
    // return (await ApiCurryBase.post('/get-open-positions', {
    // exchange,
    // })).data;
    let response = await ApiCurryBase.post('/', {'method': 'order.pending','id':1, 'params':[1,'BTCUSD',0,50,],});
    let data = response.data;
    /* eslint-disable no-console */
    console.log(data.result.records);
    /* eslint-enable no-console */
    let outputdata = data.result.records.map(rt => ({
      id: rt.id,
      clientOrderId: rt.id,
      placedTime: rt.ctime,
      amount: rt.deal_money,
      avgPrice: rt.price,
      buyOrSell: rt.side,
      exchange: exchange,
      orderType: '',
      stopPrice:  rt.price,
      status: rt.status,
      pair: rt.market,
    }));
    return {'status':true,'message':'Balance','data':outputdata,};
  }

  async getFees() {
    return (await ApiCurryBase.get('/fees')).data;
  }

  async getLedger(requestBody) {
    if (requestBody) {
      let response = await ApiCurryBase.post('/', {'method': 'balance.query','id':1, 'params':[1,],});
      let arr = [];
      let data = response.data;
      arr.push({'wallet_type':'exchange','currency':'BTC','locked_bal':Number(data.result.BTC.freeze),'avail_bal':Number(data.result.BTC.available),'total_bal':Number(data.result.BTC.freeze) + Number(Number(data.result.BTC.available)),});
      arr.push({'wallet_type':'exchange','currency':'USD','locked_bal':Number(data.result.USD.freeze),'avail_bal':Number(data.result.USD.available),'total_bal':Number(data.result.USD.freeze) + Number(Number(data.result.USD.available)),});
      return {'status':true,'message':'Balance','data':arr,};
    }

  }

  async getPairsList() {
    return (await ApiCurryBase.get('/pairs-list')).data;
  }

  async getMarginInfo(body) {
    //return (await ApiCurryBase.post('/bitfinex-margin-info', body)).data;
    if (body) {
      /* eslint-disable no-console */
      console.log(body);
      /* eslint-enable no-console */
    }
    let data = {'user_pl':10,'user_swaps':20,'margin_balance':30,'margin_net':40,'margin_required':50,};
    return {'status':true,'message':'Bitfinex Margin Info','data':data,};
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
