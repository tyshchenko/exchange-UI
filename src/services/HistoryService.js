import ApiCurryBase from './ApiCurryBase';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import EventBus, { EventNames, } from '@/eventBuses/default';

class History {
  async bitfinexTradingHistoryData(exchange) {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let mqttKey = LocalStorage.get(Keys.mqtt);
    return (await ApiCurryBase.post('/', {'method': 'order.penrding','id':1, 'params':[mqttKey,exchange,],})).data;
  }
  async withdrawalTransactionHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce = (await ApiCurryBase.post('/', {'method': 'withdrawal.history','id':1, 'params':[mqttKey,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userLogout);
    }
    return responce;
  }
  async depositTransactionHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce = (await ApiCurryBase.post('/', {'method': 'deposit.history','id':1, 'params':[mqttKey,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userLogout);
    }
    return responce;
  }
  async bitfinexOrdersHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    return (await ApiCurryBase.post('/bitfinex-order-history-request')).data;
  }
  async bitfinexPositionsHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    return (await ApiCurryBase.post('/bitfinex-positions-history-request')).data;
  }
}

export default new History();
