import {
  makeApiRequest,
  generateSymbol,
  parseFullSymbol,
} from './helpers.js';


const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ['5', '15', '30', '1H', '1D', '1W', '1M',],
  exchanges: [{
    value: 'CoinBae',
    name: 'CoinBae',
    desc: 'CoinBae',
  },
  ],
  symbols_types: [{
    name: 'crypto',

    // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
    value: 'crypto',
  },
    // ...
  ],
};

async function getAllSymbols() {
  const data = await makeApiRequest('api/all/exchanges');
  let allSymbols = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map(rightPairPart => {
        const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
        return {
          symbol: symbol.short,
          full_name: symbol.full,
          description: symbol.short,
          exchange: exchange.value,
          type: 'crypto',
        };
      });
      allSymbols = [...allSymbols, ...symbols,];
    }
  }
  return allSymbols;
}

function getPeriod(resolution) {
  let period;
  switch(resolution) {
    case '5':
      period = '300';
      break;
    case '15':
      period = '900';
      break;
    case '30':
      period = '1800';
      break;
    case '60':
      period = '3600';
      break;
    case '1D':
      period = '86400';
      break;
    case '1W':
      period = '604800';
      break;
    case '1M':
      period = '604800';
      break;
    default:
      throw new Error('unknown interval');
  }
  return period;
}
export default {
  onReady: (callback) => {
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput,
    exchange,
    symbolType,
    onResultReadyCallback,
  ) => {
    const symbols = await getAllSymbols();
    const newSymbols = symbols.filter(symbol => {
      const isExchangeValid = exchange === '' || symbol.exchange === exchange;
      const isFullSymbolContainsInput = symbol.full_name
				.toLowerCase()
				.indexOf(userInput.toLowerCase()) !== -1;
      return isExchangeValid && isFullSymbolContainsInput;
    });
    onResultReadyCallback(newSymbols);
  },

  resolveSymbol: async (
    symbolName,
    onSymbolResolvedCallback,
    onResolveErrorCallback,
  ) => {
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({
      full_name,
    }) => full_name === symbolName);
    if (!symbolItem) {
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }
    const symbolInfo = {
      name: symbolItem.symbol,
      ticker: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      has_empty_bars: true,
      intraday_multipliers: ['5', '15', '30', '60', 'D', 'W', 'M',],
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 7,
      data_status: 'streaming',
    };

    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) => {
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    const urlParameters = {
      e: parsedSymbol.exchange,
      fsym: parsedSymbol.fromSymbol,
      tsym: parsedSymbol.toSymbol,
      fromTS: from,
      toTs: to,
      limit: 2000,
      resolution: getPeriod(resolution),
    };
    const query = Object.keys(urlParameters)
			.map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
			.join('&');
    try {
      const data = await makeApiRequest(`api/kline?${query}`);
      if (data.Response && data.Response === 'Error' || data.Data.length === 0) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      let bars = [];
      data.Data.forEach(bar => {
        if (bar.time >= from && bar.time < to) {
          bars = [...bars, {
            time: bar.time * 1000,
            low: bar.low,
            high: bar.high,
            open: bar.open,
            close: bar.close,
            volume: bar.volumefrom,
          },];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      onErrorCallback(error);
    }
  },

  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
  ) => {
    
  },

  unsubscribeBars: (subscriberUID) => {
    
  },
  
  
  // optional methods
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {},

  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},

  getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {},

  getServerTime: cb => {},
  


};
