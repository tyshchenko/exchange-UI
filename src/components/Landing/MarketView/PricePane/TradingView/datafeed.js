import {
  makeApiRequest,
  generateSymbol,
  parseFullSymbol,
} from './helpers.js';
import {
  subscribeOnStream,
  unsubscribeFromStream,
} from './streaming.js';

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ['1D', '1W', '1M',],
  exchanges: [{
    value: 'Bitfinex',
    name: 'CoinBae',
    desc: 'CoinBae',
  },
              {
                // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
                value: 'Kraken',

                // filter name
                name: 'Kraken',

                // full exchange name displayed in the filter popup
                desc: 'Kraken bitcoin exchange',
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
  const data = await makeApiRequest('data/v3/all/exchanges');
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
    }) => full_name === 'Bitfinex:BTC/USD');
    if (!symbolItem) {
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }
    const symbolInfo = {
      name: 'ANKER/BTC',
      description: 'ANKER/BTC',
      type: symbolItem.type,
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: 'CoinBae',
      minmov: 1,
      pricescale: 100,
      has_intraday: false,
      has_no_volume: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
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
      toTs: to,
      limit: 2000,
    };
    const query = Object.keys(urlParameters)
			.map(name => `${name}=${encodeURIComponent(urlParameters[name])}`)
			.join('&');
    try {
      const data = await makeApiRequest(`data/histoday?${query}`);
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
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscribeUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name),
    );
  },

  unsubscribeBars: (subscriberUID) => {
    unsubscribeFromStream(subscriberUID);
  },
};
