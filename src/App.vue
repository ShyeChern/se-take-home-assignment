<script setup>
import { ref, reactive } from "vue";
import { OrderLinkedList } from "@/utils/linked-list";
import * as constants from "@/utils/constants";
import Worker from "@/utils/worker?worker";


const id = ref(0);
const bots = reactive([]);
const runningBot = ref(0);
const orders = reactive(new OrderLinkedList());

const addNormalOrder = () => {
  orders.append({ no: ++id.value, type: constants.ORDER_TYPE.NORMAL });
  checkOrder()
};

const addVipOrder = () => {
  orders.prepend({ no: ++id.value, type: constants.ORDER_TYPE.VIP });
  checkOrder()
};


const addBot = () => {
  const currentNo = bots.length
  const worker = new Worker()
  worker.onmessage = (message) => {
    const data = message.data;
    if (data.action === constants.ACTION.DEQUEUE) {
      orders.removeHead();
      if (orders.total < runningBot.value) {
        worker.postMessage({ action: constants.ACTION.STOP });
        bots[currentNo].status = constants.STATUS.IDLE
        runningBot.value--;
      }
    }
  }
  bots.push({ status: constants.STATUS.IDLE, worker, id: bots.length });
  checkOrder();
};

const removeBot = () => {
  if (bots.length === 0) return;
  const bot = bots.pop()
  if (bot.status === constants.STATUS.WORKING) runningBot.value--
  bot.worker.terminate();
  checkOrder()
};

const checkOrder = () => {
  if (orders.total === 0) return;
  if (orders.total <= runningBot.value) return
  if (runningBot.value === bots.length) return

  const bot = bots.find(v => v.status === constants.STATUS.IDLE)
  if (bot) {
    bot.status = constants.STATUS.WORKING
    runningBot.value++
    bot.worker.postMessage({ action: constants.ACTION.START });
  }
}

</script>

<template>
  <div class="container">
    <header class="text-center">
      <h1>McDonald Order Controller</h1>
    </header>

    <main>
      <section>
        <button class="btn btn-primary gap" @click="addNormalOrder">New Normal Order</button>
        <button class="btn btn-warning" @click="addVipOrder">New VIP Order</button>
        <button class="btn btn-danger" @click="removeBot">- Bot</button>
        <button class="btn btn-success" @click="addBot">+ Bot</button>
      </section>

      <section class="d-flex mt-4">
        <div class="card card-body">Total Bot: {{ bots.length }}</div>
        <div class="card card-body">Running Bot: {{ runningBot }}</div>
      </section>
      <section>
        <div class="card">
          <p class="card-header">Pending Order ({{ orders.total }})</p>
          <ul class="card-body list-group d-flex flex-row flex-wrap">
            <li v-for="order in orders.pendingOrders()" :key="order.no" class="list-group-item border"
              :class="{ 'bg-primary': order.type === constants.ORDER_TYPE.NORMAL, 'bg-warning': order.type === constants.ORDER_TYPE.VIP, 'text-white': order.type === constants.ORDER_TYPE.NORMAL }">
              {{ order.no }}
            </li>
          </ul>
        </div>
        <div class="card">
          <p class="card-header">Completed Order ({{ orders.completedOrders.length }})</p>
          <ul class="card-body list-group d-flex flex-row flex-wrap">
            <li v-for="order in orders.completedOrders" :key="order.no" class="list-group-item border"
              :class="{ 'bg-primary': order.type === constants.ORDER_TYPE.NORMAL, 'bg-warning': order.type === constants.ORDER_TYPE.VIP, 'text-white': order.type === constants.ORDER_TYPE.NORMAL }">
              {{ order.no }}
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped></style>
