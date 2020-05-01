import ApiCurryBase from './ApiCurryBase';

class WalletService {
  async bitfinexWalletTransfer(body) {
    return (await ApiCurryBase.post('/bitfinex-wallet-transfer-request', body))
            .data;
  }
  async bequantWalletTransfer(body) {

    return (await ApiCurryBase.post('/bequant-wallet-transfer-request', body))
            .data;
  }
  async binanceWalletSummary() {
    //random comment
    return (await ApiCurryBase.post('/binance-wallet-balance-request', ))
            .data;
  }
  async bitfinexWalletSummary() {
    return (await ApiCurryBase.post('/bitfinex-wallet-balance-request', ))
            .data;
  }
  async bequantTradingWalletSummary(exchange) {
    return (await ApiCurryBase.post('/bequant-trading-wallet-balance-request', { exchange, }))
            .data;
  }
  async bequantMainWalletSummary(exchange) {
    return (await ApiCurryBase.post('/bequant-main-wallet-balance-request', { exchange, }))
            .data;
  }
  async refreshWalletBalances() {
    return (await ApiCurryBase.post('/refresh-wallet-balances'))
            .data;
  }
  async bitfinexRefreshWalletBalances() {
    return (await ApiCurryBase.post('/bitfinex-refresh-wallet-balances'))
            .data;
  }
  async bequantRefreshWalletBalances() {
    return (await ApiCurryBase.post('/binance-refresh-wallet-balances'))
            .data;
  }
  async binanceRefreshWalletBalances() {
    return (await ApiCurryBase.post('/bequant-refresh-wallet-balances'))
            .data;
  }

  async bitmexWalletSummary() {
    return (await ApiCurryBase.post('/bitmex-wallet-summary'))
            .data;
  }

  async bitmexWalletDetails() {
    return (await ApiCurryBase.post('/fetch-bitmex-balance'))
            .data;
  }

  async login(requestBody) {
    /* eslint-disable no-console */
    console.log(requestBody);
    /* eslint-enable no-console */
    let params = [requestBody.login,requestBody.password,requestBody.otp,];
    let method = {
      'method': 'auth.login',
      'id':1,
      'params':params,
    };
    let responce = (await ApiCurryBase.post('/', method)).data;
    /* eslint-disable no-console */
    console.log(responce);
    /* eslint-enable no-console */
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
