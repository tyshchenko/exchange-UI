import { parseFullSymbol, } from './helpers.js';

const socket = new window.io('wss://streamer.cryptocompare.com');
const channelToSubscription = new Map();

socket.on('connect', () => {
});

socket.on('disconnect', () => {
});

socket.on('error', () => {
});

socket.on('m', data => {
  const [
    eventTypeStr,
    exchange,
    fromSymbol,
    toSymbol,
    ,
    ,
    tradeTimeStr,
    ,
    tradePriceStr,
  ] = data.split('~');

  if (parseInt(eventTypeStr) !== 0) {
    // skip all non-TRADE events
    return;
  }
  const tradePrice = parseFloat(tradePriceStr);
  const tradeTime = parseInt(tradeTimeStr);
  const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
  const subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem === undefined) {
    return;
  }
  const lastDailyBar = subscriptionItem.lastDailyBar;
  const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);

  let bar;
  if (tradeTime >= nextDailyBarTime) {
    bar = {
      time: nextDailyBarTime,
      open: tradePrice,
      high: tradePrice,
      low: tradePrice,
      close: tradePrice,
    };
  } else {
    bar = {
      ...lastDailyBar,
      high: Math.max(lastDailyBar.high, tradePrice),
      low: Math.min(lastDailyBar.low, tradePrice),
      close: tradePrice,
    };
  }
  subscriptionItem.lastDailyBar = bar;

  // send data to every subscriber of that symbol
  subscriptionItem.handlers.forEach(handler => handler.callback(bar));
});

function getNextDailyBarTime(barTime) {
  const date = new Date(barTime * 1000);
  date.setDate(date.getDate() + 1);
  return date.getTime() / 1000;
}

export function subscribeOnStream(
  symbolInfo,
  resolution,
  onRealtimeCallback,
  subscribeUID,
  onResetCacheNeededCallback,
  lastDailyBar,
) {
  const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
  const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
  const handler = {
    id: subscribeUID,
    callback: onRealtimeCallback,
  };
  let subscriptionItem = channelToSubscription.get(channelString);
  if (subscriptionItem) {
    // already subscribed to the channel, use the existing subscription
    subscriptionItem.handlers.push(handler);
    return;
  }
  subscriptionItem = {
    subscribeUID,
    resolution,
    lastDailyBar,
    handlers: [handler,],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  socket.emit('SubAdd', { subs: [channelString,], });
}

export function unsubscribeFromStream(subscriberUID) {
  // find a subscription with id === subscriberUID
  for (const channelString of channelToSubscription.keys()) {
    const subscriptionItem = channelToSubscription.get(channelString);
    const handlerIndex = subscriptionItem.handlers
			.findIndex(handler => handler.id === subscriberUID);

    if (handlerIndex !== -1) {
      // remove from handlers
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // unsubscribe from the channel, if it was the last handler
        socket.emit('SubRemove', { subs: [channelString,], });
        channelToSubscription.delete(channelString);
        break;
      }
    }
  }
}
