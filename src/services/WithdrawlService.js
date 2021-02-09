import ApiCurryBase from './ApiCurryBase';
import LocalStorage, { Keys, } from '@/utils/localStorage.js';

class WithdrawlService {
  async withdrawCrypto(body) {
    return (await ApiCurryBase.post('/save-crypto-withdrawl-request', body))
      .data;
  }
  async sendOTP(body) {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    return (await ApiCurryBase.post('/send-cryptowithdrawl-email-otp',body)).data;
  }
  async getWithdrawalFees() {
    let mqttKey = LocalStorage.get(Keys.mqtt);
    return (await ApiCurryBase.post('/',{'method': 'withdrawal.fee','id':1, 'params':[mqttKey,],})).data;
  }
}

export default new WithdrawlService();
