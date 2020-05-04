import ApiCurryBase from './ApiCurryBase';

class DepositService {
  async fetchDespositAddress(userid, currency) {
    let method = 'user.deposit_address';
    return (await ApiCurryBase.post('/', {
      userid,
      currency,
      method,

    }));
  }
}

export default new DepositService();
