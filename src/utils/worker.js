import * as constants from "./constants";

let interval
let remainingTime
let id
self.onmessage = function (message) {
  const data = message.data;
  if (data.id) id = data.id

  if (data.action === constants.ACTION.START) {
    remainingTime = constants.INTERVAL / 1000
    checkTimer()
  }

  if (data.action === constants.ACTION.STOP) {
    clearInterval(interval);
  }
};

const checkTimer = () => {
  if (remainingTime === 0) {
    self.postMessage({ action: constants.ACTION.COMPLETE, id });
  }

  if (remainingTime > 0)
    setTimeout(() => {
      remainingTime--
      self.postMessage({ action: constants.ACTION.UPDATE_TIMER, remainingTime, id });
      checkTimer();
    }, 1000);
}
