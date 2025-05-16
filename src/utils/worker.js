import * as constants from "./constants";

self.onmessage = function (message) {
  const data = message.data;

  if (data.action === constants.ACTION.START) {
    setInterval(() => {
      self.postMessage({ action: constants.ACTION.DEQUEUE });
    }, constants.INTERVAL);
  }
};
