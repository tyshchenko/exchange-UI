import ApiCurryBase from './ApiCurryBase';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';
import EventBus, { EventNames, } from '@/eventBuses/default';

class WithdrawlService {
  async withdrawCrypto(body) {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce = (await ApiCurryBase.post('/', {'method': 'withdrawal.confirm','id':1, 'params':[mqttKey,body.amount,body.recievingAddress,body.coin,body.id,body.emailOtp],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  async sendOTP(body) {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce =  (await ApiCurryBase.post('/',{'method': 'withdrawal.sendotp','id':1, 'params':[mqttKey,body.amount,body.recievingAddress,body.coin,body.id,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  async getWithdrawalFees() {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    let responce =  (await ApiCurryBase.post('/',{'method': 'withdrawal.fee','id':1, 'params':[mqttKey,],})).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
}

export default new WithdrawlService();
