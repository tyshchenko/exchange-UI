import ApiCurryBase from './ApiCurryBase';

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
