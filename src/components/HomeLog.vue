<!-- components/HomeLog.vue -->
<!-- Home page の Log component を作成する -->

<template>
  <div class="homeLog">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-auto h5 mt-2">LOG</div>
          <div class="col"></div>
          <div class="col-auto pl-0">
            <div class="input-group border ml-2">
              <span class="input-group-text">Order</span>
              <!-- ラジオボタン:Normal -->
              <div class="form-check form-check-inline pl-2">
                <input
                  type="radio"
                  class="form-check-input"
                  id="normalOrder"
                  v-model="rbOrder"
                  value="normalOrder"
                  v-on:change="rbOrderIsChanged"
                />
                <label for="normalOrder" class="form-check-label">Normal</label>
              </div>
              <!-- ラジオボタン:Reverse -->
              <div class="form-check form-check-inline pl-0 mr-0">
                <input
                  type="radio"
                  class="form-check-input"
                  id="reverseOrder"
                  v-model="rbOrder"
                  value="reverseOrder"
                  v-on:change="rbOrderIsChanged"
                />
                <label for="reverseOrder" class="form-check-label">Reverse</label>
              </div>
            </div>
          </div>

          <div class="col-auto mt-1 pl-0">
            <!-- CLEARボタン -->
            <button
              type="button"
              class="btn btn-secondary btn-sm fw-bold"
              v-on:click="clearButtonisClicked"
            >
              Clear
            </button>
            <!-- Downloadボタン -->
            <button
              type="button"
              class="btn btn-secondary btn-sm ms-1 fw-bold"
              v-on:click="downloadButtonisClicked"
            >
              Download
            </button>
          </div>
        </div>
      </div>

      <div class="card-body" id="message-monitor-body">
        <div id="message-list-wrapper">
          <ul class="list-group" id="message-list" v-on:keyup.stop v-on:keydown.stop>
            <li
              class="list-group-item d-flex align-items-start"
              id="message-monitor-header"
              tabindex="0"
            >
              <span class="col1">HH MM SS</span>
              <span class="col2">DIR</span>
              <span class="col3">DATA</span>
            </li>
            <li
              v-for="message in logStore.logArray"
              class="list-group-item d-flex align-items-start"
              v-bind:key="message.id"
              tabindex="0"
            >
              <span class="col1">{{ message.timeStamp }}</span>
              <span class="col2">{{ message.direction }}</span>
              <span v-if="message.direction === 'REQ'" class="col3">
                {{ message.data }} {{ message.body }}
              </span>
              <span v-else class="col3"
                >status code: {{ message.statusCode }}
                <pre>{{ message.data }}</pre>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useLogStore } from '@/stores/log'

// import { defineComponent } from 'vue'
import { config } from '../config'

console.log('HomeLog init')
const fileName4Log = config.fileName4Log // log download のファイル名
const rbOrder = ref('normalOrder')
const logStore = useLogStore()

// CLEARボタンがクリックされたときの処理（ログ画面のクリア）
const clearButtonisClicked = () => {
  console.log('clearButtonisClicked')
  logStore.logArray.length = 0
  rbOrder.value = 'normalOrder'
}

// Radioボタンがクリックされたときの処理（ログ表示時間順序の逆転）
const rbOrderIsChanged = () => {
  console.log('rbOrderIsChanged', rbOrder)
  logStore.logArray.reverse()
}

// SAVEボタンがクリックされたときの処理（ログの保存）
const downloadButtonisClicked = () => {
  // g_dataLogArrayから保存用のstringの作成
  let log = ''
  // for (let dataLog of this.g_dataLogArray) {
  for (let dataLog of logStore.logArray) {
    log += dataLog.timeStamp + ',' + dataLog.direction + ','
    if (dataLog.direction == 'REQ') {
      // REQUESTの場合
      log += dataLog.data
      if (dataLog.body == '') {
        log += '\n'
      } else {
        log += ',body:' + dataLog.body + '\n'
      }
    } else {
      // RESPONSEの場合
      log += JSON.stringify(dataLog.data) + '\n'
    }
  }

  const blob = new Blob([log], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  document.body.appendChild(a)
  a.download = fileName4Log
  a.href = url
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

// export default defineComponent({
//   name: 'HomeLog',
//   data() {
//     return {
//       rbOrder: 'normalOrder', // "normalOrder" or "reverseOrder"
//     }
//   },
//   computed: {
//     logId: {
//       get() {
//         return this.$store.getters.logId
//       },
//       set(value) {
//         this.$store.dispatch('setLogId', value)
//       },
//     },
//     logArray: {
//       get() {
//         return this.$store.getters.logArray
//       },
//       set(value) {
//         this.$store.dispatch('setLogArray', value)
//       },
//     },
//   },
//   methods: {
//     rbOrderIsChanged: function () {
//       console.log('rbOrderIsChanged', this.rbOrder)
//       this.logArray.reverse()
//     },

//     // CLEARボタンがクリックされたときの処理（ログ画面のクリア）
//     clearButtonisClicked: function () {
//       console.log('clearButtonisClicked')
//       this.logArray.length = 0
//       this.rbOrder = 'normalOrder'
//     },

//     // SAVEボタンがクリックされたときの処理（ログの保存）
//     downloadButtonisClicked: function () {
//       // g_dataLogArrayから保存用のstringの作成
//       let log = ''
//       // for (let dataLog of this.g_dataLogArray) {
//       for (let dataLog of this.logArray) {
//         log += dataLog.timeStamp + ',' + dataLog.direction + ','
//         if (dataLog.direction == 'REQ') {
//           // REQUESTの場合
//           log += dataLog.data
//           if (dataLog.body == '') {
//             log += '\n'
//           } else {
//             log += ',body:' + dataLog.body + '\n'
//           }
//         } else {
//           // RESPONSEの場合
//           log += JSON.stringify(dataLog.data) + '\n'
//         }
//       }

//       const blob = new Blob([log], { type: 'text/plain' })
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       document.body.appendChild(a)
//       a.download = fileName4Log
//       a.href = url
//       a.click()
//       a.remove()
//       URL.revokeObjectURL(url)
//     },
//   },

onMounted(() => {
  console.log('HomeLog is created')
})

// })
</script>

<style scoped>
.form-check {
  padding-top: 0.5rem;
  padding-left: 2rem;
}
#message-monitor-body {
  margin: 0;
  padding: 0;
}
#message-list-wrapper {
  height: 30em;
  overflow-y: scroll;
}
#message-list li {
  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;
  font-size: 90%;
  padding: 0.2em 1em;
  cursor: pointer;
}
#message-list li span {
  display: inline-block;
}
#message-list li span.col1 {
  width: 5em;
}
#message-list li span.col2 {
  width: 3em;
}
</style>
