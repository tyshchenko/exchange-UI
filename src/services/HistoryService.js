import ApiCurryBase from './ApiCurryBase';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import EventBus, { EventNames, } from '@/eventBuses/default';

class History {
  async withdrawalTransactionHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce = (await ApiCurryBase.post('/', {'method': 'withdrawal.history','id':1, 'params':[mqttKey,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  async depositTransactionHistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce = (await ApiCurryBase.post('/', {'method': 'deposit.history','id':1, 'params':[mqttKey,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  async authhistoryData() {
    // console.log((await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body)).data)
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce = (await ApiCurryBase.post('/', {'method': 'auth.history','id':1, 'params':[mqttKey,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
}

export default new History();
