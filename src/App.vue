<script setup>
import { ref, reactive } from "vue";
import { OrderLinkedList } from "@/utils/linked-list";
import * as constants from "@/utils/constants";
import Worker from "@/utils/worker?worker";


const id = ref(0);
const totalBot = ref(0);
const bots = reactive([]);
const orders = reactive(new OrderLinkedList());

const addNormalOrder = () => {
  orders.append({ no: ++id.value, type: constants.ORDER_TYPE.NORMAL });
  checkBot()
};

const addVipOrder = () => {
  orders.prepend({ no: ++id.value, type: constants.ORDER_TYPE.VIP });
  checkBot()
};


const addBot = () => {
  totalBot.value++;
  checkBot();
};

const removeBot = () => {
  if (totalBot.value === 0) return;
  totalBot.value--;
  if (bots.length === 0) return
  bots.pop().terminate();
  checkBot()
};

const checkBot = () => {
  if (orders.total === 0) return;
  if (orders.total <= bots.length) return
  if (bots.length === totalBot.value) return;

  const worker = new Worker()
  worker.onmessage = (message) => {
    const data = message.data;
    if (data.action === constants.ACTION.DEQUEUE) {
      orders.removeHead();
      if (orders.total < bots.length) {
        worker.terminate()
        bots.pop()
      }
    }
  }
  worker.postMessage({ action: constants.ACTION.START })
  bots.push(worker);
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
        <div class="card card-body">Total Bot: {{ totalBot }}</div>
        <div class="card card-body">Running Bot: {{ bots.length }}</div>
      </section>
      <section>
        <div class="card">
          <p class="card-header">Pending Order ({{ orders.total }})</p>
          <ul class="card-body list-group d-flex flex-row flex-wrap">
            <li v-for="order in orders.pendingOrders()" :key="order.no" class="list-group-item border" >
              {{ order.no }}
            </li>
          </ul>
        </div>
        <div class="card">
          <p class="card-header">Completed Order ({{ orders.completedOrders.length }})</p>
          <ul class="card-body list-group d-flex flex-row flex-wrap">
            <li v-for="order in orders.completedOrders" :key="order.no" class="list-group-item border" >
              {{ order.no }}
            </li>
          </ul>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped></style>
