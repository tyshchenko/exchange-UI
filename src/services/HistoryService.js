import ApiCurryBase from './ApiCurryBase';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
const mqttKey = LocalStorage.get(Keys.mqtt);
import EventBus, { EventNames, } from '@/eventBuses/default';

class History {
  async bitfinexTradingHistoryData(exchange) {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    return (await ApiCurryBase.post('/', {'method': 'order.penrding','id':1, 'params':[mqttKey,exchange,],})).data;
  }
  async bitfinexTransactionHistoryData(exchange) {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let responce = (await ApiCurryBase.post('/bitfinex-transaction-history-request', { exchange, })).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userLogout);
    }
    return responce;
  }
  async depositTransactionHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    return (await ApiCurryBase.post('/', {'method': 'deposit.history','id':1, 'params':[mqttKey,],})).data;
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
