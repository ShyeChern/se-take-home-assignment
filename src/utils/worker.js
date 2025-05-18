import * as constants from "./constants";

let interval
self.onmessage = function (message) {
  const data = message.data;

  if (data.action === constants.ACTION.START) {
    interval = setInterval(() => {
      self.postMessage({ action: constants.ACTION.COMPLETE });
    }, constants.INTERVAL);
  }

  if (data.action === constants.ACTION.STOP) {
    clearInterval(interval);
  }
};
