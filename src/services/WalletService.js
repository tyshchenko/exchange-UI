import ApiCurryBase from './ApiCurryBase';
import EventBus, { EventNames, } from '@/eventBuses/default';

class WalletService {

  async login(requestBody) {
    let params = [requestBody.login,requestBody.password,requestBody.otp,];
    let method = {
      'method': 'auth.login',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    return responce;
  }
  
  async restorerequest(requestBody) {
    let params = [requestBody.login,];
    let method = {
      'method': 'auth.restore',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    return responce;
  }

  async loadkyc(requestBody) {
    let params = [requestBody.login,];
    let method = {
      'method': 'auth.kyc.load',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  
  async loadstatus(requestBody) {
    let params = [requestBody.login,];
    let method = {
      'method': 'auth.user.status',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  
  async savekyc(requestBody) {
    let params = [requestBody.login,requestBody.firstname,requestBody.lastname,requestBody.phone,requestBody.country,];
    let method = {
      'method': 'auth.kyc.save',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    if (responce.Expired==1) {
      EventBus.$emit(EventNames.userSessionExpired);
    }
    return responce;
  }
  

  async register(requestBody) {
    /* eslint-disable no-console */
    console.log(requestBody);
    /* eslint-enable no-console */
    let params = [requestBody.login,requestBody.password,];
    let method = {
      'method': 'auth.register',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    /* eslint-disable no-console */
    console.log(responce);
    /* eslint-enable no-console */
    return responce;
  }

}

export default new WalletService();
