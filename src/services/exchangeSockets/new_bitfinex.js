import store from '@/store';
import ExchangeDataEventBus from '@/eventBuses/exchangeData';
import Worker from 'simple-web-worker';
//import serialize from 'serialize-javascript';
import keyMaps from '@/assets/json/keyMaps.js';
import {
  dateToDisplayTime,
} from '@/utils/utility';

class Bitfinex {
  constructor() {
    this.ExchangeDataEventBus = ExchangeDataEventBus;
    this.id = 1;
    this.state = {
      _constants: {
        selectedExchange: store.getters.selectedExchange,
        // selectedPair: store.getters.selectedPair,
        defaultPair: 'BTC/USD',
        selectedPair: 'BTC/USD',
        baseAddress: 'wss://trade.coinbae.org/ws/',
        streams: ['trades', 'candles', 'books', 'ticker', ],
        channelIDs: {
          candles: '',
          trades: '',
          books: '',
          ticker: '',
        },
        candlesIdArray: [],
        precision: 'P1',
        ethdata: {
          name: 'ETH/USD',
          'exchange-traded': 'bitfinex',
          'exchange-listed': 'bitfinex',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          minmov: 1,
          minmov2: 0,
          pointvalue: 1,
          session: '24x7',
          // has_seconds: true,
          has_intraday: true,
          // intraday_multipliers: ['1', '60',],
          // has_weekly_and_monthly: true,
          // volume_precision: 8,
          description: 'Etherium on bitfinex',
          type: 'bitcoin',
          supported_resolutions: ['1', '5', '15', '30', '60', '1440', ],
          // supported_resolutions: ['1', '5', '15', '30', '60',],
          pricescale: 100,
          ticker: 'ETH',
          base_name: ['ETH', ],
          legs: ['BTC', ],
          exchange: 'bitfinex',
          full_name: 'bitfinex',
          pro_name: 'ETH',
          data_status: 'streaming',
        },
        btcdata: {
          name: 'BTC/USD',
          'exchange-traded': 'bitfinex',
          'exchange-listed': 'bitfinex',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          minmov: 1,
          minmov2: 0,
          pointvalue: 1,
          session: '24x7',
          // has_seconds: true,
          has_intraday: true,
          // intraday_multipliers: ['1', '60',],
          // has_weekly_and_monthly: true,
          // volume_precision: 8,
          description: 'bitfinex bitcoin prices',
          type: 'bitcoin',
          supported_resolutions: ['1', '5', '15', '30', '60', '1440', ],
          // supported_resolutions: ['1', '5', '15', '30', '60',],
          pricescale: 100,
          ticker: 'BTC',
          base_name: ['BTC', ],
          legs: ['BTC', ],
          exchange: 'bitfinex',
          full_name: 'bitfinex',
          pro_name: 'BTC',
          data_status: 'streaming',
        },
        neodata: {
          name: 'NEO/USD',
          'exchange-traded': 'bitfinex',
          'exchange-listed': 'bitfinex',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          minmov: 1,
          minmov2: 0,
          pointvalue: 1,
          session: '24x7',
          // has_seconds: true,
          has_intraday: true,
          // intraday_multipliers: ['1', '60',],
          // has_weekly_and_monthly: true,
          // volume_precision: 8,
          description: 'NEO on bitfinex',
          type: 'bitcoin',
          supported_resolutions: ['1', '5', '15', '30', '60', '1440', ],
          // supported_resolutions: ['1', '5', '15', '30', '60',],
          pricescale: 100,
          ticker: 'NEO',
          base_name: ['NEO', ],
          legs: ['NEO', ],
          exchange: 'bitfinex',
          full_name: 'bitfinex',
          pro_name: 'NEO',
          data_status: 'streaming',
        },
      },
      chartData: {},
      connectionFlag: false,
      prevTime: 0,
      get previousTime() {
        return this.prevTime || (Date.now() - 1000);
      },
      set previousTime(value) {
        this.prevTime = value;
      },
    };
    this.actions = [{
      message: 'emit-live-trades',
      func: this.emitLiveTrades,
    }, ];
    this.ctx = {
      close() {},
      readyState: 3,
    };
    this.workers = Worker.create(this.actions);
    this.initListeners();
    this.connectNew();
  }

  subscribePair(currencyPair) {
    let pair = keyMaps[`bitfinex-_-${currencyPair}`];
    this.subscribeOrderBook(pair);
    this.subscribeTicker(pair);
    this.subscribeTrades(pair);
    //this.queryOrderbook(pair);
    this.subscribeOrders(pair);
    //subscribeCandles(pair, '1m');
  }

  subscribeOrderBook(pair) {
    let symbol = pair;
    let data = {
      id: this.id,
      method: 'depth.subscribe',
      params: [symbol,50,'0',], //book
    };
    this.ctx.send(JSON.stringify(data));
    this.id = this.id + 1;
  }
  
  queryOrderbook(pair) {
    let symbol = pair;
    let data = {
      id: this.id,
      method: 'depth.query',
      params: [symbol,50,'0',], //book
    };
    this.ctx.send(JSON.stringify(data));
    this.id = this.id + 1;
  }


  subscribeTrades(pair) {
    let symbol = pair;
    let data = {
      id: this.id,
      method: 'deals.subscribe',
      params: [symbol,], 
    };
    this.ctx.send(JSON.stringify(data));
    this.id = this.id + 1;
  }

  subscribeOrders(pair) {
    let symbol = pair;
    let data = {
      id: this.id,
      method: 'order.subscribe',
      params: [symbol,], 
    };
    this.ctx.send(JSON.stringify(data));
    this.id = this.id + 1;
  }

  subscribeCandles(pair, timeFrame) {
    let key = `trade:${timeFrame}:${pair}`;
    let data = {
      id: this.id,
      method: 'kline.subscribe',
      params: [pair,10,'0',key,], 
    };
    this.ctx.send(JSON.stringify(data));
    this.id = this.id + 1;
  }

  unsubscribe(key) {
    if (key) {
      if (key!='') {
        let data = {
          id: this.id,
          method: key + '.unsubscribe',
          params: [],
        };
        this.ctx.send(JSON.stringify(data));
        this.id = this.id + 1;
      }
    }
  }

  emitLiveTrades(data, obj) {
    /* eslint-disable no-console */
    console.log('emitLiveTrades');
    console.log(data);
    console.log(obj);
    /* eslint-enable no-console */
    const E = eval('(' + obj + ')');
    let arr = data.map((elem) => {
      let obj = {};
      obj.price = Number((elem[3]));
      obj.timeStamp = E.utils.dateToDisplayTime(new Date(elem[1]));
      obj.volume = Math.abs(elem[2]);
      obj.buyOrSell = elem[2] < 0 ? 'sell' : 'buy';
      return obj;
    });
    return arr;
  }

  emitWorkerTrades(data, isSnapShot) {
    if (isSnapShot) {
      let arr = [];
      data.forEach((item) => {
        arr.push({'price':Number(item.price),'timeStamp':dateToDisplayTime(new Date(item.time * 1000)),'volume':Number(item.amount), 'buyOrSell':item.type,});
      });
      this.ExchangeDataEventBus.$emit('liveTrades', arr[0]);
      this.ExchangeDataEventBus.$emit('snapshotTrades', arr);
    } else {
      //{"params": ["BTCUSD", [{"amount": "0.001", "time": 1576245028.9058609, "id": 1, "type": "sell", "price": "8000"}]], "method": "deals.update", "id": null}
      data.forEach((item) => {
        let obj = {};
        obj.price = Number(item.price);
        obj.timeStamp = dateToDisplayTime(new Date(item.time * 1000));
        obj.volume = Number(item.amount);
        obj.buyOrSell = item.type;
        //arr.push({'price':Number(item.price),'timeStamp':dateToDisplayTime(new Date(item.time)),'volume':Number(item.amount), 'buyOrSell':item.type,});
        this.ExchangeDataEventBus.$emit('liveTrades', obj);
      });
      //this.ExchangeDataEventBus.$emit('snapshotTrades', arr);
    }
  }

  emitBooks(data) {
    const {
      chartData,
    } = this.state;
    let asks = [];
    let bids = [];
    if (data.asks) {
      data.asks.forEach((item) => {
        asks.push({'value':Number(item[0]),'volume':Number(item[1]),});
      });
    }
    if (data.bids) {
      data.bids.forEach((item) => {
        bids.push({'value':Number(item[0]),'volume':Number(item[1]),});
      });
    }
    if (chartData.asks && chartData.bids) {
      if (asks) {
        asks.forEach((item) => {
          let fask = chartData.asks.find(x => x.value == item.value);
          if (fask) chartData.asks.find(x => x.value == item.value).volume = item.volume;
        });
      }
      if (bids) {
        bids.forEach((item) => {
          let fbid = chartData.bids.find(x => x.value == item.value);
          if (fbid) chartData.bids.find(x => x.value == item.value).volume = item.volume;
        });
      }
      //chartData.asks.push(...asks);
      //chartData.bids.push(...bids);
      //      if (chartData.asks.length > 9 && chartData.bids.length > 9) {
      //        this.ExchangeDataEventBus.$emit('updateOrderbook', JSON.parse(JSON.stringify(chartData)));
      //      } else {
      //        this.refreshOrderBook();
      //      }
      //this.ExchangeDataEventBus.$emit('snapshotOrderbook', JSON.parse(JSON.stringify(chartData)));
      chartData.asks.sort(function(a, b) {
        return a.value - b.value;
      });
      chartData.bids.sort(function(a, b) {
        return a.value - b.value;
      });
      chartData.asks = chartData.asks.filter(i => i.volume > 0.00001 && i.value > 0.0001).splice(0, 25);
      chartData.bids = chartData.bids.filter(i => i.volume > 0.00001 && i.value > 0.0001).splice(-25);
      this.ExchangeDataEventBus.$emit('updateOrderbook', JSON.parse(JSON.stringify(chartData)));
    } else {
      bids.reverse();
      chartData.asks = asks;
      chartData.bids = bids;
      this.ExchangeDataEventBus.$emit('snapshotOrderbook', JSON.parse(JSON.stringify(chartData)));
    }
    if (chartData.asks) {
      store.state.sellPrice = chartData.asks[0].value;
    }
    if (chartData.bids) {
      store.state.buyPrice = chartData.bids[chartData.bids.length - 1].value;
    }
  }

  refreshOrderBook() {
    this.unsubscribe('depth');
    let pair = this.state._constants.selectedPair.replace('/', '');
    this.subscribeOrderBook(pair);
  }

  updateBars(data) {
    let elem = data;
    let {
      prevTime,
    } = this.state;
    let bar = {
      time: elem[0],
      close: Number(elem[2]),
      open: Number(elem[1]),
      high: Number(elem[3]),
      low: Number(elem[4]),
      volume: Number(elem[5]),
    };
    if (Number(bar.time) >= Number(prevTime)) {
      this.ExchangeDataEventBus.$emit('updateCandles', bar);
      this.state.prevTime = Number(bar.time);
    }
  }

  makeTickerResponse(data) {
    let obj = {};
    let {
      selectedPair,
    } = this.state._constants;
    //if (store.getters.selectedExchange === 'bitfinex') {
    //  store.state.sellPrice = data;
    //  store.state.buyPrice = data;
    //}
    obj.ask = data;
    obj.bid = data;
    obj.high = data;
    obj.low = data;
    obj.last = data;
    obj.volume = 0;
    obj.symbol = selectedPair;
    obj.percentage = 0;
    obj.exchange = 'bitfinex';
    this.ExchangeDataEventBus.$emit('ticker', obj);
  }

  connect() {

  }

  connectNew() {
    const {
      baseAddress,
    } = this.state._constants;
    const bitfinex = new WebSocket(baseAddress);
    bitfinex.onopen = () => this.handleOpen();
    bitfinex.onclose = this.handleClose;
    bitfinex.onerror = this.handleError;
    bitfinex.onmessage = (message) => this.handleMessage(message);
    this.ctx.close();
    this.ctx = bitfinex;
  }

  handleOpen() {
    this.ExchangeDataEventBus.$emit('exchange-connected', store.getters.selectedExchange);
  }

  handleClose() {}

  handleError() {}

  handleMessage(message) {
    let dataObj = JSON.parse(message.data);
    let method = dataObj.method;
    if (method) {
      if (method=='depth.update') {
        let data = dataObj.params[1];
        this.emitBooks(data);
      }
      if (method=='price.update') {
        let data = dataObj.params[1];
        this.makeTickerResponse(data);
      }
      if (method=='deals.update') {
        let data = dataObj.params[1];
        if ( data.length > 2 ) {
          this.emitWorkerTrades(data, true);
        } else {
          this.emitWorkerTrades(data, false);
        }
      }
        
    }
    // let event = dataObj.result;
    // const {
    // _constants,
    // } = this.state;
    // if (event) {
    // //          if (dataObj.channel === 'trades') {
    // _constants.channelIDs.trades = dataObj.chanId;
    // //          } else if (dataObj.channel === 'candles') {
    // _constants.channelIDs.candles = dataObj.chanId;
    // _constants.candlesIdArray.push(dataObj.chanId);
    // //          } else if (dataObj.channel === 'book') {
    // _constants.channelIDs.books = dataObj.chanId;
    // //          } else if (dataObj.channel === 'ticker') {
    // _constants.channelIDs.ticker = dataObj.chanId;
    // }
    // } else {
    // let response = dataObj;
    // if (response[0] == _constants.channelIDs.trades) {
    // if (response[1] == 'tu') {
    // this.emitWorkerTrades(response[2], false);
    // } else if (Array.isArray(response[1])) {
    // this.emitWorkerTrades(response[1], true);
    // }
    // } else if (response[0] == _constants.channelIDs.books) {
    // let data = response[1];
    // this.emitBooks(data);
    // } else if (response[0] == _constants.channelIDs.candles) {
    // if (response[1] != 'hb') {
    // if (Array.isArray(response[1][0])) {
    // let barArray = this.barData(response[1]);
    // this.ExchangeDataEventBus.$emit('snapshotCandles', barArray);
    // } else {
    // this.updateBars(response[1]);
    // }
    // }

    // } else if (response[0] == _constants.channelIDs.ticker) {
    // if (response[1] != 'hb') {
    // this.makeTickerResponse(response[1]);
    // }
    // }
    // }
  }

  subscribeExchange(exchange) {
    let {
      _constants,
      connectionFlag,
    } = this.state;
    _constants.selectedExchange = exchange;
    this.state.chartData = {};
    if (exchange == 'bitfinex') {
      //this.unsubscribe();
      this.subscribePair(_constants.selectedPair);
      this.state.connectionFlag = true;
    } else {
      if (connectionFlag) {
        //this.unsubscribe();
        this.state.connectionFlag = false;
      }
    }
  }

  async subscribeAllTicker() {
    let pair = this.state._constants.selectedPair.replace('/', '');
    let timerId;
    const handler = () => {
      if (WebSocket.OPEN == this.ctx.readyState) {
        this.subscribeTicker(pair);
        clearInterval(timerId);
      }
    };
    timerId = setInterval(handler, 500);
  }

  unsubscribeAllTicker() {
    this.unsubscribe(this.state._constants.channelIDs.ticker);
  }

  changePair(pair) {
    this.state._constants.precision = 'P2';
    this.state._constants.selectedPair = pair;
    if (!this.state.connectionFlag) {
      // console.log('bitfinex not active returning');
      return;
    }
    // let unPair = currentPair || defaultPair;
    //currentPair = pair;
    this.unsubscribe();
    this.subscribePair(pair);
  }

  changeSymbol(pair) {
    this.state.chartData = {};
    if (pair == 'QTUM/USD') {
      pair = 'QTM/USD';
    } else if (pair == 'QTUM/BTC') {
      pair = 'QTM/BTC';
    } else if (pair == 'DASH/BTC') {
      pair = 'DSH/BTC';
    } else if (pair == 'DASH/USD') {
      pair = 'DSH/USD';
    } else if (pair == 'IOTA/USD') {
      pair = 'IOT/USD';
    }
    this.changeTickerPair(pair);
    this.changePair(pair);
  }

  changeTickerPair(pair) {
    this.unsubscribe(this.state._constants.channelIDs.ticker);
    let Cpair = pair.replace('/', '');
    this.subscribeTicker(Cpair);
    return;
  }

  subscribeTicker(pair) {
    let symbol = pair;
    let data = {
      id: this.id,
      method: 'price.subscribe',
      params: [symbol,], 
    };
    this.ctx.send(JSON.stringify(data));
    this.id = this.id + 1;
  }

  subscribeCandleEvent(info) {

    let symbol = info.symbol.name;
    if (symbol == 'QTUM/USD') {
      symbol = 'QTM/USD';
    } else if (symbol == 'QTUM/BTC') {
      symbol = 'QTM/BTC';
    } else if (symbol == 'DASH/BTC') {
      symbol = 'DSH/BTC';
    } else if (symbol == 'DASH/USD') {
      symbol = 'DSH/USD';
    } else if (symbol == 'IOTA/USD') {
      symbol = 'IOT/USD';
    }
    let period = info.period;
    if (!this.state.connectionFlag) {
      return;
    }

    let pair = keyMaps[`bitfinex-_-${symbol}`];

    let xperiod = '1m';

    switch (period) {
      case '1':
        xperiod = '1m';
        break;
      case '5':
        xperiod = '5m';
        break;
      case '15':
        xperiod = '15m';
        break;
      case '30':
        xperiod = '30m';
        break;
      case '60':
        xperiod = '1h';
        break;
      case '1440':
        xperiod = '1D';
        break;
      case '1D':
      case 'D':
        xperiod = '1D';
        break;
      case '1W':
        xperiod = '7D';
        break;
      case '1M':
        xperiod = '1M';
        break;
    }
    this.subscribeCandles(pair, xperiod);
  }

  unsubscribeCandleEvent() {
    if (!this.state.connectionFlag) {
      return;
    }
    this.unsubscribe(this.state._constants.channelIDs.candles);
  }

  getDataBySymbol(symbol) {
    let pair = symbol.split('/')[0];
    let datareturn = {
      name: symbol,
      'exchange-traded': 'bitfinex',
      'exchange-listed': 'bitfinex',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      session: '24x7',
      // has_seconds: true,
      has_intraday: true,
      // intraday_multipliers: ['1', '60',],
      // has_weekly_and_monthly: true,
      // volume_precision: 8,
      description: pair + ' on bitfinex',
      type: 'bitcoin',
      supported_resolutions: ['1', '5', '15', '30', '60', '1440', ],
      // supported_resolutions: ['1', '5', '15', '30', '60',],
      pricescale: 100,
      ticker: pair,
      base_name: [pair, ],
      legs: [pair, ],
      exchange: 'bitfinex',
      full_name: 'bitfinex',
      pro_name: pair,
      data_status: 'streaming',
    };
    return datareturn;
  }

  resolveSymbolFn(symbol) {
    const {
      _constants,
    } = this.state;
    if (!this.state.connectionFlag) {
      return;
    }
    switch (symbol) {
      case 'BTC':
        this.ExchangeDataEventBus.$emit('candle-symbol-resolved', _constants.btcdata);
        break;
      case 'ETH':
        this.ExchangeDataEventBus.$emit('candle-symbol-resolved', _constants.ethdata);
        break;
      case 'NEO':
        this.ExchangeDataEventBus.$emit('candle-symbol-resolved', _constants.neodata);
        break;
      default:
        this.ExchangeDataEventBus.$emit('candle-symbol-resolved', this.getDataBySymbol(symbol));
    }
    return;
  }

  symbolData() {
    if (!this.state.connectionFlag) {
      return;
    }
    let arr = ['btcusd', 'ltcusd', 'ltcbtc', 'ethusd', 'ethbtc', 'etcbtc', 'etcusd', 'rrtusd', 'rrtbtc', 'zecusd', 'zecbtc', 'xmrusd', 'xmrbtc', 'dshusd', 'dshbtc', 'btceur', 'btcjpy', 'xrpusd', 'xrpbtc', 'iotusd', 'iotbtc', 'ioteth', 'eosusd', 'eosbtc', 'eoseth', 'sanusd', 'sanbtc', 'saneth', 'omgusd', 'omgbtc', 'omgeth', 'bchusd', 'bchbtc', 'bcheth', 'neousd', 'neobtc', 'neoeth', 'etpusd', 'etpbtc', 'etpeth', 'qtmusd', 'qtmbtc', 'qtmeth', 'avtusd', 'avtbtc', 'avteth', 'edousd', 'edobtc', 'edoeth', 'btgusd', 'btgbtc', 'datusd', 'datbtc', 'dateth', 'qshusd', 'qshbtc', 'qsheth', 'yywusd', 'yywbtc', 'yyweth', 'gntusd', 'gntbtc', 'gnteth', 'sntusd', 'sntbtc', 'snteth', 'ioteur', 'batusd', 'batbtc', 'bateth', 'mnausd', 'mnabtc', 'mnaeth', 'funusd', 'funbtc', 'funeth', 'zrxusd', 'zrxbtc', 'zrxeth', 'tnbusd', 'tnbbtc', 'tnbeth', 'spkusd', 'spkbtc', 'spketh', 'trxusd', 'trxbtc', 'trxeth', 'rcnusd', 'rcnbtc', 'rcneth', 'rlcusd', 'rlcbtc', 'rlceth', 'aidusd', 'aidbtc', 'aideth', 'sngusd', 'sngbtc', 'sngeth', 'repusd', 'repbtc', 'repeth', 'elfusd', 'elfbtc', 'elfeth', 'btcgbp', 'etheur', 'ethjpy', 'ethgbp', 'neoeur', 'neojpy', 'neogbp', 'eoseur', 'eosjpy', 'eosgbp', 'iotjpy', 'iotgbp', 'iosusd', 'iosbtc', 'ioseth', 'aiousd', 'aiobtc', 'aioeth', 'requsd', 'reqbtc', 'reqeth', 'rdnusd', 'rdnbtc', 'rdneth', 'lrcusd', 'lrcbtc', 'lrceth', 'waxusd', 'waxbtc', 'waxeth', 'daiusd', 'daibtc', 'daieth', 'cfiusd', 'cfibtc', 'cfieth', 'agiusd', 'agibtc', 'agieth', 'bftusd', 'bftbtc', 'bfteth', 'mtnusd', 'mtnbtc', 'mtneth', 'odeusd', 'odebtc', 'odeeth', 'antusd', 'antbtc', 'anteth', 'dthusd', 'dthbtc', 'dtheth', 'mitusd', 'mitbtc', 'miteth', 'stjusd', 'stjbtc', 'stjeth', 'xlmusd', 'xlmeur', 'xlmjpy', 'xlmgbp', 'xlmbtc', 'xlmeth', 'xvgusd', 'xvgeur', 'xvgjpy', 'xvggbp', 'xvgbtc', 'xvgeth', 'bciusd', 'bcibtc', 'mkrusd', 'mkrbtc', 'mkreth', 'venusd', 'venbtc', 'veneth', 'kncusd', 'kncbtc', 'knceth', 'poausd', 'poabtc', 'poaeth', ];
    let newArray = [];
    arr.forEach(elem => {
      let sym = elem.substr(0, 3).toUpperCase();
      let pair = elem.substr(3, 3).toUpperCase();
      let obj = {
        symbol: sym + '/' + pair,
        full_name: sym,
        description: '',
        type: sym,
        exchange: 'bitfinex',
      };
      newArray.push(obj);
    });
    //emit event for symbol data
    this.ExchangeDataEventBus.$emit('all-symbols', newArray);
  }

  barData(data) {
    let barsObject = {};
    let bars = [];
    for (let i = data.length - 1; i >= 0; i--) {
      let elem = data[i];
      let bar = {
        time: elem[0],
        close: Number(elem[2]),
        open: Number(elem[1]),
        high: Number(elem[3]),
        low: Number(elem[4]),
        volume: Number(elem[5]),
      };
      bars.push(JSON.parse(JSON.stringify(bar)));
    }
    let meta = {
      noData: true,
    };
    barsObject.meta = meta;
    barsObject.bars = bars;
    return JSON.parse(JSON.stringify(barsObject));
  }

  changePrecision(keyObj) {
    const {
      _constants,
      connectionFlag,
    } = this.state;
    let {
      key,
    } = keyObj;
    if (!connectionFlag) {
      return;
    }
    this.unsubscribe(_constants.channelIDs.books);
    let keys = ['P0', 'P1', 'P2', 'P3', ];
    let index = keys.indexOf(_constants.precision);
    if (key == 'minus') {
      if (index != 0) {
        _constants.precision = keys[index - 1];
      }
    } else {
      if (index != 3) {
        _constants.precision = keys[index + 1];
      }
    }
    let pair = _constants.selectedPair.replace('/', '');
    this.subscribeOrderBook(pair);
  }

  initListeners() {
    // this.ExchangeDataEventBus.$on('exchange-connect', () => this.connect());
    this.ExchangeDataEventBus.$on('precision', (keyObj) => this.changePrecision(keyObj));
    this.ExchangeDataEventBus.$on('subscribe-exchange', (ex) => this.subscribeExchange(ex));
    this.ExchangeDataEventBus.$on('subscribe-all-ticker', () => this.subscribeAllTicker());
    this.ExchangeDataEventBus.$on('unsubscribe-all-ticker', () => this.unsubscribeAllTicker());
    this.ExchangeDataEventBus.$on('change-symbol', (pair) => this.changeSymbol(pair));
    this.ExchangeDataEventBus.$on('subscribe-candles', (info) => this.subscribeCandleEvent(info));
    this.ExchangeDataEventBus.$on('unsubscribe-candles', () => this.unsubscribeCandleEvent());
    this.ExchangeDataEventBus.$on('resolve-candle-symbol', (symbol) => this.resolveSymbolFn(symbol));
    this.ExchangeDataEventBus.$on('get-all-symbols', () => this.symbolData());
  }
}

const _Bitfinex = new Bitfinex();

// _Bitfinex.connect();

export default _Bitfinex;
