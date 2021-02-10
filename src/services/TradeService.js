import ApiCurryBase from './ApiCurryBase';
import axios from 'axios';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import EventBus, { EventNames, } from '@/eventBuses/default';


class TradeService {
  async placeNewOrder(requestBody) {
    /* eslint-disable no-console */
    console.log(requestBody);
    /* eslint-enable no-console */
    let side = 1;
    let amount = requestBody.amount;
    let pair = requestBody.pair;
    if (requestBody.pair =='ANKER/BTC') {
      pair = 'ANKERBTC';
    }
    if (requestBody.pair =='ETH/BTC') {
      pair = 'ETHBTC';
    }
    if (requestBody.bos =='buy') {
      side = 2;
      amount = requestBody.btcamount;
    }
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let params = [mqttKey,pair,side,amount,'0.00','',];
    let type = 'order.put_market';
    if (requestBody.type == 'limit') {
      type = 'order.put_limit';
      params = [mqttKey,pair,side,requestBody.amount,requestBody.price,'0.00','0.00','',];
    }
    let method = {
      'method': type,
      'id':1,
      'params':params,
    };
    //equestBody: {pair: "BTC/USD", type: "market", exc: "bitfinex", bos: "buy", amount: "1", moe: "market"}
    //{"id":2,"method":"order.put_market","params":[1,"ANKERBTC",2,"0.02","0.002",""]}: 
    let responce = (await ApiCurryBase.post('/', method)).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    if (responce.error) {
      responce.status = false;
      responce.data = responce.error;
      responce.data.message = responce.error.message;
    } else {
      responce.status = true;
      responce.data = responce.result;
      responce.data.message = 'success';
      responce.data.volume = responce.result.amount;
    }
    return responce;
  }

  async cancelOrder(requestBody) {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let params = [mqttKey,'ANKERBTC',requestBody.orderId,];
    let method = {
      'method': 'order.cancel',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    /* eslint-disable no-console */
    console.log(responce);
    /* eslint-enable no-console */
    responce.status = true;
    responce.data = responce.result;
    responce.data.message = 'success';
    return responce;
  }

  async getRecentOrders() {
    let mqttKey = LocalStorage.get(Keys.mqtt);

    let response = await ApiCurryBase.post('/', {'method': 'market.user_deals','id':1, 'params':[mqttKey,'ANKERBTC',0,50,],});
    let data = response.data;
    if (data.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
      return {data:[],};
    } else {
      /* eslint-disable no-console */
      console.log(data);
      /* eslint-enable no-console */
      let outputdata = data.result.records.map(rt => ({
        id: rt.id,
        orderId: rt.id,
        placedTime: rt.time,
        amount: rt.amount,
        avgPrice: rt.price,
        buyOrSell: rt.side==2 ? 'buy' : 'sell',
        role: rt.role==1 ? 'Maker' : 'Taker',
        pair: 'ANKERBTC',
        fee: rt.fee,
      }));
      return {data:outputdata,};
    }
  }
  
  async getBalanceHistory() {
    let mqttKey = LocalStorage.get(Keys.mqtt);

    let response = await ApiCurryBase.post('/', {'method': 'balance.history','id':1, 'params':[mqttKey,'','',0,0,0,50,],});
    let data = response.data;
    if (data.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
      return {data:[],};
    } else {
      let outputdata = data.result.records.map(rt => ({
        time: rt.time,
        asset: rt.asset,
        business: rt.business,
        change: rt.change,
        balance: rt.balance,
        detail: rt.detail,
      }));
      return {data:outputdata,};
    }
  }
  async getActiveOrders(exchange = '', pair = '') {
    //get-active-orders
    if (exchange) {
      if (pair) { 
        /* eslint-disable no-console */
        console.log(exchange);
        /* eslint-enable no-console */
      }
    }
    let mqttKey = LocalStorage.get(Keys.mqtt);

    let response = await ApiCurryBase.post('/', {'method': 'order.pending','id':1, 'params':[mqttKey,'ANKERBTC',0,50,],});
    let data = response.data;
    if (data.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
      return {data:[],};
    } else {
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
        filled:  rt.deal_stock,
        status: rt.deal_stock>0 ? 'part.filled' : 'pending',
        pair: rt.market,
      }));
      return {data:outputdata,};
    }
  }
  
  async getOpenPositions(exchange) {
    // return (await ApiCurryBase.post('/get-open-positions', {
    // exchange,
    // })).data;
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let response = await ApiCurryBase.post('/', {'method': 'order.pending','id':1, 'params':[mqttKey,'ANKERBTC',0,50,],});
    let data = response.data;
    /* eslint-disable no-console */
    console.log(data.result.records);
    /* eslint-enable no-console */
    if (data.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
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
    let mqttKey = LocalStorage.get(Keys.mqtt);
    return (await ApiCurryBase.post('/', {'method': 'exchange.fee','id':1, 'params':[mqttKey,],})).data;
  }

  async getLedger() {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let response = await ApiCurryBase.post('/', {'method': 'balance.query','id':1, 'params':[mqttKey,],});
    let arr = [];
    let data = response.data;
    let status = true;
    if (data.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
      status = false;
    } else {
      arr.push({'wallet_type':'exchange','currency':'BTC','locked_bal':Number(data.result.BTC.freeze),'avail_bal':Number(data.result.BTC.available),'total_bal':Number(data.result.BTC.freeze) + Number(Number(data.result.BTC.available)),});
      arr.push({'wallet_type':'exchange','currency':'ANKER','locked_bal':Number(data.result.ANKER.freeze),'avail_bal':Number(data.result.ANKER.available),'total_bal':Number(data.result.ANKER.freeze) + Number(Number(data.result.ANKER.available)),});
      arr.push({'wallet_type':'exchange','currency':'ETH','locked_bal':Number(data.result.ETH.freeze),'avail_bal':Number(data.result.ETH.available),'total_bal':Number(data.result.ETH.freeze) + Number(Number(data.result.ETH.available)),});
    }
    return {'status':status,'message':'Balance','data':arr,};
  }
  
  async getBalanses() {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let response = await ApiCurryBase.post('/', {'method': 'balance.query','id':1, 'params':[mqttKey,],});
    let arr = [];
    let data = response.data;
    let status = true;
    if (data.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
      status = false;
    } 
    return {'status':status,'message':'Balance','data':data.result,};
  }



  async getMarginInfo(body) {
    //return (await ApiCurryBase.post('/bitfinex-margin-info', body)).data;
    if (body) {
      /* eslint-disable no-console */
      console.log(body);
      /* eslint-enable no-console */
    }
    let data = {'user_pl':10,'user_swaps':20,'margin_balance':30,'margin_net':40,'margin_required':50,};
    return {'status':true,'message':'Margin Info','data':data,};
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


  async bitmexClosePosition(symbol) {
    return (await ApiCurryBase.post('/bitmex-close-position', {
      symbol,
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
