<!-- components/SettingServerAndDevice.vue -->
<!-- Setting page の Server 設定 と Device 設定 component を作成する -->

<template>
  <div class="settingServerAndDevice">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-auto h5 mt-2">ECHONET Lite WebAPI Server の設定</div>
          <div class="col"></div>
          <div class="col-auto mt-2">{{ serverUrl }}</div>
          <div class="col-auto"></div>
        </div>
      </div>
      <div class="card-body pt-2 pb-2">
        <form>
          <!-- Input: API key -->
          <div class="input-group">
            <span class="input-group-text">API key for 実験クラウド</span>
            <input
              type="text"
              class="form-control"
              id="inputApiKey"
              v-model="apiKey"
              v-on:change="apiKeyOnChange"
            />
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              v-on:click="updateButtonIsClicked"
            >
              確認
            </button>
            <span class="input-group-text">{{ verifyApiKey }}</span>
          </div>
        </form>
      </div>
    </div>

    <!-- 実験クラウドの場合のみ表示 -->
    <template v-if="serverUrl === 'https://webapiechonet.com/elapi/v1'">
      <div class="card">
        <div class="card-header">
          <form>
            <div class="row">
              <div class="col-auto h5 mt-2">デバイスエミュレーションの設定</div>
              <div class="col"></div>
              <div class="col-auto">
                <select id="selectAddDevice" class="form-control" v-model="addDevice">
                  <option v-for="device in addDeviceList" v-bind:key="device.id">
                    {{ device }}
                  </option>
                </select>
              </div>
              <!-- デバイス追加ボタン -->
              <div class="col-auto mt-1 pl-0">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  v-on:click="addDeviceButtonIsClicked"
                >
                  デバイス追加
                </button>
              </div>
              <!-- UPDATEボタン -->
              <div class="col-auto mt-1 pl-0">
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  v-on:click="updateButtonIsClicked"
                >
                  UPDATE
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- body -->
        <div class="card-body" id="setting-devices-body">
          <div id="setting-devices-list-wrapper">
            <ul class="list-group" id="setting-devices-list">
              <li class="list-group-item d-flex align-items-start" id="devices-header" tabindex="0">
                <span class="col1">Device Type</span>
                <span class="col2">Device Id</span>
                <span class="col3">削除</span>
              </li>
              <li
                v-for="(idInfo, index) in idInfoList"
                class="list-group-item d-flex align-items-start"
                v-bind:key="idInfo.id"
                tabindex="0"
              >
                <span class="col1">{{ idInfo.deviceType }}</span>
                <span class="col2">{{ idInfo.id }}</span>
                <span class="col3">
                  <button
                    class="btn btn-secondary btn-sm"
                    type="button"
                    v-on:click="deleteDeviceButtonIsClicked(index)"
                  >
                    <i class="bi bi-trash" style="color: #eeeeee"></i>
                  </button>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { config } from '../config'
import { onMounted } from 'vue'
console.log('SettingServerAndDevice init')

const serverUrl = ref(config.serverUrl)
const apiKey = ref(localStorage.getItem('apiKey') ?? '')
const verifyApiKey = ref('NG')
const addDevice = ref(config.addDeviceList[25]) // デバイス追加で選択されたデバイス名。初期値はエアコン
const addDeviceList = ref(config.addDeviceList)
const idInfoList = ref([]) // [{deviceType:"/aircon", id:"0123"},... ] GET /devices のレスポンスを利用

console.log('serverUrl: ', serverUrl.value, 'apikey: ', apiKey.value)

// API key 入力時の method
const apiKeyOnChange = () => {
  localStorage.setItem('apiKey', apiKey.value)
  console.log('apiKeyOnChange:', apiKey.value)
}

// apiKey 確認ボタンがクリックされたときの method
const verifyApiKeyButtonisCliked = () => {
  const url = config.serverUrl + '/devices'
  console.log('Verify apikey, ', { url })
  const headers = new Headers({
    'X-Elapi-key': apiKey.value,
    // Authorization: 'Bearer ' + apiKey.value,
  })
  let option = {
    method: 'GET',
    headers: headers,
  }

  console.log('fetch url: ', url, 'option: ', option)
  fetch(url, option)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log('Update devices', data)
      if (data.type == 'referenceError') {
        verifyApiKey.value = 'NG'
      } else {
        verifyApiKey.value = 'OK'
      }
    })
    .catch((error) => {
      console.error('Update Error:', error)
    })
}

// デバイス削除ボタン(Trash can)がクリックされたときの method
// input: value <number>
const deleteDeviceButtonIsClicked = (value) => {
  const deviceId = idInfoList.value[value].id
  const url = config.serverUrl + '/config/device' + deviceId
  console.log('Delete device, ', { url })

  const headers = new Headers({
    'X-Elapi-key': apiKey.value,
  })

  const option = {
    method: 'DELETE',
    headers: headers,
  }

  fetch(url, option)
    .then((response) => {
      console.log('Delete', response.status)
      updateButtonIsClicked()
    })
    .catch((error) => {
      console.error('Delete Error:', error)
    })
}

// デバイス追加ボタンがクリックされたときの method
const addDeviceButtonIsClicked = () => {
  const url = config.serverUrl + '/config/device/'
  console.log('Add device, ', { url }, addDevice.value)
  const bodyData = '{"deviceType":"' + addDevice.value + '"}'

  const headers = new Headers({
    'X-Elapi-key': apiKey.value,
    'Content-Type': 'application/json',
    'Content-Length': bodyData.length.toString(),
  })

  let option = {
    method: 'POST',
    headers: headers,
    body: bodyData,
  }

  fetch(url, option)
    .then((response) => response.json())
    .then((data) => {
      console.log('Add Success:', data)
      updateButtonIsClicked()
    })
    .catch((error) => {
      console.error('Add Error:', error)
    })
}

// UPDATEボタンがクリックされたときの method
const updateButtonIsClicked = () => {
  const url = config.serverUrl + '/devices'
  console.log('Update devices, ', { url })
  const headers = new Headers({
    'X-Elapi-key': apiKey.value,
  })
  let option = {
    method: 'GET',
    headers: headers,
  }

  console.log('fetch url: ', url, 'option: ', option)
  fetch(url, option)
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      console.log('Update devices', data)
      if (data.type == 'authError') {
        verifyApiKey.value = 'NG'
      } else {
        verifyApiKey.value = 'OK'
      }
      // idInfoListを作成する
      const service = 'devices'
      idInfoList.value = []
      if (data[service] !== undefined) {
        for (let thing of data[service]) {
          const deviceType = thing.deviceType !== undefined ? thing.deviceType : ''
          const idInfo = { id: '/' + thing.id, deviceType: deviceType }
          idInfoList.value.push(idInfo)
        }
      }
      idInfoList.value.sort(function (a, b) {
        var nameA = a.deviceType.toUpperCase() // 大文字と小文字を無視する
        var nameB = b.deviceType.toUpperCase() // 大文字と小文字を無視する
        if (nameA < nameB) {
          return -1
        }
        if (nameA > nameB) {
          return 1
        }
        return 0
      })
    })
    .catch((error) => {
      console.error('Update Error:', error)
    })
}

onMounted(() => {
  console.log('Setting page: Server and Device is created')
  console.log('apiKey:', apiKey.value)
  updateButtonIsClicked()
  verifyApiKeyButtonisCliked()
})

// export default defineComponent({
//   name: "SettingServerAndDevice",
//   data() {
//     return {
//       forConsortium: forConsortium,

//       apiKey1: localStorage.getItem("apiKey1") ?? "",
//       apiKey2: localStorage.getItem("apiKey2") ?? "",
//       verifyApiKey1: "NG",
//       verifyApiKey2: "NG",
//       addDevice: config.addDeviceList[25], // デバイス追加で選択されたデバイス名。初期値はエアコン
//       addDeviceList: config.addDeviceList,
//       idInfoList: idInfoList, // [{deviceType:"/aircon", id:"0123"},... ] GET /devices のレスポンスを利用
//     };
//   },
//   computed: {
//     serverSelection: {
//       get() {
//         return this.$store.getters.serverSelection;
//       },
//       set(value) {
//         this.$store.dispatch("setServerSelection", value);
//       },
//     },
//     serverUrl: {
//       get() {
//         return this.$store.getters.serverUrl;
//       },
//       set(value) {
//         this.$store.dispatch("setServerUrl", value);
//       },
//     },
//     apiKey: {
//       get() {
//         return this.$store.getters.apiKey;
//       },
//       set(value) {
//         this.$store.dispatch("setApiKey", value);
//       },
//     },
//   },
//   methods: {
//     // Select a server のラジオボタンの処理
//     rbServerOnChange: function (event: Event) {
//       if (event.target instanceof HTMLInputElement) {
//         const serverSelection = event.target.value;
//         console.log("rbServerOnChange", serverSelection);
//         localStorage.setItem("serverSelection", serverSelection);
//         this.serverSelection = serverSelection;
//         this.serverUrl =
//           serverSelection == "server1" ? config.serverUrl1 : config.serverUrl2;
//         this.apiKey =
//           serverSelection == "server1" ? this.apiKey1 : this.apiKey2;
//       }
//     },

//     // API key for 実験クラウド の入力時の処理
//     apiKeyOnChange1: function () {
//       localStorage.setItem("apiKey1", this.apiKey1);
//       this.apiKey =
//         this.serverSelection == "server1" ? this.apiKey1 : this.apiKey2;
//       console.log("apiKeyOnChange1:", this.apiKey1);
//     },

//     // API key for 実証システム の入力時の処理
//     apiKeyOnChange2: function () {
//       localStorage.setItem("apiKey2", this.apiKey2);
//       this.apiKey =
//         this.serverSelection == "server1" ? this.apiKey1 : this.apiKey2;
//       console.log("apiKeyOnChange2:", this.apiKey2);
//     },

//     // デバイス削除ボタン(Trash can)がクリックされたときの処理
//     deleteDeviceButtonIsClicked: function (value: number) {
//       const deviceId = this.idInfoList[value].id;
//       const url = config.serverUrl1 + "/config/device" + deviceId;
//       console.log("Delete device, ", { url });

//       const headers = new Headers({
//         "X-Elapi-key": this.apiKey,
//       });

//       const option = {
//         method: "DELETE",
//         headers: headers,
//       };

//       fetch(url, option)
//         .then((response) => {
//           console.log("Delete", response.status);
//           this.updateButtonIsClicked();
//         })
//         .catch((error) => {
//           console.error("Delete Error:", error);
//         });
//     },

//     // デバイス追加ボタンがクリックされたときの処理
//     addDeviceButtonIsClicked: function () {
//       const url = config.serverUrl1 + "/config/device/";
//       console.log("Add device, ", { url }, this.addDevice);
//       const bodyData = '{"deviceType":"' + this.addDevice + '"}';

//       const headers = new Headers({
//         "X-Elapi-key": this.apiKey,
//         "Content-Type": "application/json",
//         "Content-Length": bodyData.length.toString(),
//       });

//       let option = {
//         method: "POST",
//         headers: headers,
//         body: bodyData,
//       };

//       fetch(url, option)
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("Add Success:", data);
//           this.updateButtonIsClicked();
//         })
//         .catch((error) => {
//           console.error("Add Error:", error);
//         });
//     },

//     // UPDATEボタンがクリックされたときの処理
//     updateButtonIsClicked: function () {
//       const url = config.serverUrl1 + "/devices";
//       console.log("Update devices, ", { url });
//       const headers = new Headers({
//         "X-Elapi-key": this.apiKey1,
//       });
//       let option = {
//         method: "GET",
//         headers: headers,
//       };

//       fetch(url, option)
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Update devices", data);
//           if (data.type == "authError") {
//             this.verifyApiKey1 = "NG";
//           } else {
//             this.verifyApiKey1 = "OK";
//           }
//           // idInfoListを作成する
//           const service = "devices";
//           this.idInfoList = [];
//           if (data[service] !== undefined) {
//             for (let thing of data[service]) {
//               const deviceType =
//                 thing.deviceType !== undefined ? thing.deviceType : "";
//               const idInfo = { id: "/" + thing.id, deviceType: deviceType };
//               this.idInfoList.push(idInfo);
//             }
//           }
//           this.idInfoList.sort(function (a, b) {
//             var nameA = a.deviceType.toUpperCase(); // 大文字と小文字を無視する
//             var nameB = b.deviceType.toUpperCase(); // 大文字と小文字を無視する
//             if (nameA < nameB) {
//               return -1;
//             }
//             if (nameA > nameB) {
//               return 1;
//             }
//             return 0;
//           });
//         })
//         .catch((error) => {
//           console.error("Update Error:", error);
//         });
//     },
//     // apiKey2 確認ボタンがクリックされたときの処理
//     verifyApiKey2ButtonisCliked: function () {
//       const url = config.serverUrl2 + "/devices";
//       console.log("Verify apikey2, ", { url });
//       const headers = new Headers({
//         Authorization: "Bearer " + this.apiKey2,
//       });
//       let option = {
//         method: "GET",
//         headers: headers,
//       };

//       fetch(url, option)
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           console.log("Update devices", data);
//           if (data.type == "referenceError") {
//             this.verifyApiKey2 = "NG";
//           } else {
//             this.verifyApiKey2 = "OK";
//           }
//         })
//         .catch((error) => {
//           console.error("Update Error:", error);
//         });
//     },
//   },

//   created: function () {
//     console.log("Setting page: Server and Device is created");
//     console.log(
//       "serverSelection:",
//       this.serverSelection,
//       "apiKey1:",
//       this.apiKey1,
//       "apiKey2:",
//       this.apiKey2
//     );
//     this.updateButtonIsClicked();
//     this.verifyApiKey2ButtonisCliked();
//   },
// });
</script>

<style scoped>
.input-group {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
.form-check {
  padding-top: 0.5rem;
  padding-left: 2rem;
}
#setting-devices-body {
  margin: 0;
  padding: 0;
}
#setting-devices-list-wrapper {
  height: 30em;
  overflow-y: scroll;
}
#setting-devices-list li {
  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;
  font-size: 90%;
  padding: 0.2em 1em;
  cursor: pointer;
}
#setting-devices-list li span {
  display: inline-block;
}
#setting-devices-list li span.col1 {
  width: 20em;
}
#setting-devices-list li span.col2 {
  width: 30em;
}
#setting-devices-list li span.col3 {
  width: 4em;
}
</style>
