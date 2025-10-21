<!-- components/HomeRequestResponse.vue -->
<!-- Home page の Request & Response component を作成する -->

<template>
  <div class="homeRequestResponse">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-auto h5 mt-2">Request & Response</div>
          <div class="col"></div>
          <div class="col-auto mt-1 pl-0">
            <!-- CLEARボタン -->
            <button
              type="button"
              class="btn btn-secondary btn-sm fw-bold"
              v-on:click="clearButtonisClicked"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div class="card-body" id="request-response-body">
        <div id="request-response-wrapper">
          <ul class="list-group" id="request-response-list">
            <li class="list-group-item">{{ reqresStore.request }}</li>
            <li class="list-group-item">{{ reqresStore.statusCode }}</li>
            <li class="list-group-item d-flex align-items-start">
              <span>
                <pre>{{ reqresStore.response }}</pre>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useReqresStore } from '@/stores/reqres'

console.log('HomeRequestResponse init')
const reqresStore = useReqresStore()

// CLEARボタンがクリックされたときの処理（ログ画面のクリア）
const clearButtonisClicked = () => {
  console.log('clearButtonisClicked')
  reqresStore.request = 'Request:'
  reqresStore.statusCode = 'Response: status code'
  reqresStore.response = 'Response: data'
}

onMounted(() => {
  console.log('HomeRequestResponse is created')
})
</script>

<style scoped>
#request-response-body {
  margin: 0;
  padding: 0;
}
#request-response-wrapper {
  height: 20em;
  overflow-y: scroll;
}
#request-response-list li {
  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;
  font-size: 90%;
  padding: 0.2em 1em;
}
</style>
