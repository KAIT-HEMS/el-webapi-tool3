<!-- components/SettingServerAndDevice.vue -->
<!-- Setting page の Server 設定 と Device 設定 component を作成する -->

<template>
  <div class="settingServerAndDevice">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-auto h5 mt-2">ECHONET Lite WebAPI Server の設定</div>
          <div class="col"></div>
          <div class="col-auto"></div>
        </div>
      </div>

      <div class="card-body pt-2 pb-2">
        <form>
          <!-- Server-0 -->
          <div class="input-group">
            <!-- ラジオボタン -->
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="rbSeverSelection"
                value="0"
                v-model="serverSelection"
                v-on:change="rbServerOnChange($event)"
              />
            </div>
            <div class="col-4 mt-2">{{ servers[0].url }}</div>

            <!-- apiKey 入力 -->
            <input
              type="text"
              class="form-control"
              id="apiKey0"
              v-model="apiKey0"
              v-on:change="apiKeyOnChange($event)"
            />

            <!-- 確認ボタン -->
            <button
              type="button"
              id="btnV0"
              class="btn btn-outline-secondary btn-sm"
              v-on:click="updateButtonIsClicked($event)"
            >
              確認
            </button>

            <!-- ステータス表示 -->
            <span class="input-group-text">{{ verify0 }}</span>
          </div>

          <!-- Server-1 -->
          <div class="input-group">
            <!-- ラジオボタン -->
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="rbSeverSelection"
                value="1"
                v-model="serverSelection"
                v-on:change="rbServerOnChange($event)"
              />
            </div>
            <div class="col-4 mt-2">{{ servers[1].url }}</div>

            <!-- apiKey 入力 -->
            <input
              type="text"
              class="form-control"
              id="apiKey1"
              v-model="apiKey1"
              v-on:change="apiKeyOnChange($event)"
            />

            <!-- 確認ボタン -->
            <button
              type="button"
              id="btnV1"
              class="btn btn-outline-secondary btn-sm"
              v-on:click="updateButtonIsClicked($event)"
            >
              確認
            </button>

            <!-- ステータス表示 -->
            <span class="input-group-text">{{ verify1 }}</span>
          </div>

          <!-- Server-2 -->
          <div class="input-group">
            <!-- ラジオボタン -->
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="rbSeverSelection"
                value="2"
                v-model="serverSelection"
                v-on:change="rbServerOnChange($event)"
              />
            </div>
            <div class="col-4 mt-2">{{ servers[2].url }}</div>

            <!-- apiKey 入力 -->
            <input
              type="text"
              class="form-control"
              id="apiKey2"
              v-model="apiKey2"
              v-on:change="apiKeyOnChange($event)"
            />

            <!-- 確認ボタン -->
            <button
              type="button"
              id="btnV2"
              class="btn btn-outline-secondary btn-sm"
              v-on:click="updateButtonIsClicked($event)"
            >
              確認
            </button>

            <!-- ステータス表示 -->
            <span class="input-group-text">{{ verify2 }}</span>
          </div>
        </form>
      </div>
    </div>

    <!-- 実験クラウドの場合のみ表示 -->
    <template v-if="serverSelection !== '2'">
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
                  id="btnUpdate"
                  class="btn btn-secondary btn-sm"
                  v-on:click="updateButtonIsClicked($event)"
                >
                  UPDATE
                </button>
              </div>
            </div>
          </form>
        </div>

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
// localStorage: serverUrl, apiKeyType, apiKey, apiKey0, apiKey1, apiKey2,
// localStorage: serverSelection(選択中のserver '0','1','2')
// sessionStorage: verify0, verify1, verify2(connection status 'OK' or 'NG')
import { ref } from 'vue'
import { config } from '../config'
import { onMounted, onBeforeUnmount } from 'vue'
console.log('SettingServerAndDevice.vue init')

const servers = config.servers
const apiKey0 = ref(localStorage.getItem('apiKey0') ?? '')
const apiKey1 = ref(localStorage.getItem('apiKey1') ?? '')
const apiKey2 = ref(localStorage.getItem('apiKey2') ?? '')
const serverSelection = ref(localStorage.getItem('serverSelection') ?? '0') // '0','1','2'
if (serverSelection.value != '0' && serverSelection.value != '1' && serverSelection.value != '2') {
  serverSelection.value = '0'
}
const serverUrl = ref(servers[parseInt(serverSelection.value)].url ?? 'xxx.xxx.xxx')
const verify0 = ref('NG')
const verify1 = ref('NG')
const verify2 = ref('NG')
const addDevice = ref(config.addDeviceList[30]) // デバイス追加で選択されたデバイス名。初期値はエアコン
const addDeviceList = ref(config.addDeviceList)
const idInfoList = ref([]) // [{deviceType:"/aircon", id:"0123"},... ] GET /devices のレスポンスを利用

console.log('apiKey0: ', apiKey0.value)
console.log('apiKey1: ', apiKey1.value)
console.log('apiKey2: ', apiKey2.value)
console.log('serverSelection: ', serverSelection.value)
console.log('serverUrl: ', serverUrl.value)

// API key 入力時の method
// input event.target.value: <string> 入力値
// input event.target.id: <string> 入力欄のid, 'apiKey0', 'apiKey0', 'apiKey2'
// function: apiKey を localStorage に set する
const apiKeyOnChange = (event) => {
  const apiKey = event.target.value
  const id = event.target.id
  console.log('apiKeyOnChange', id, apiKey)
  if (id == 'apiKey0') {
    localStorage.setItem('apiKey0', apiKey)
  } else if (id == 'apiKey1') {
    localStorage.setItem('apiKey1', apiKey)
  } else if (id == 'apiKey2') {
    localStorage.setItem('apiKey2', apiKey)
  } else {
    console.log('event.target.id is wrong', id)
  }
}

// ラジオボタン rbSeverSelection が選択された場合の処理
// input: event.target.value <string> '0', '1', '2'
// function: serverSelection, apiKey を localStorage に set
const rbServerOnChange = (event) => {
  console.log('rbServerOnChange: event.target.value: ', event.target.value)
  if (event.target instanceof HTMLInputElement) {
    const selection = event.target.value
    console.log('rbServerOnChange', { selection })
    let apiKey = 'xxx'
    if (selection == '0') {
      apiKey = apiKey0.value
    } else if (selection == '1') {
      apiKey = apiKey1.value
    } else if (selection == '2') {
      apiKey = apiKey2.value
    } else {
      console.log('selection is wrong!', event.target.value)
    }
    localStorage.setItem('serverSelection', selection)
    localStorage.setItem('apiKey', apiKey)
  }
}

// デバイス削除ボタン(Trash can)がクリックされたときの method
// input: index <number>
// function: Web APIを利用してデバイスを削除し、デバイスリストを更新する
const deleteDeviceButtonIsClicked = (index) => {
  console.log('deleteDeviceButtonIsClicked, index:', index)
  const deviceId = idInfoList.value[index].id
  const url = config.servers[parseInt(serverSelection.value)].url + '/config/device' + deviceId
  let apiKey = ''
  if (serverSelection.value == '0') {
    apiKey = localStorage.getItem('apiKey0')
  } else if (serverSelection.value == '1') {
    apiKey = localStorage.getItem('apiKey1')
  }
  console.log('Delete device, ', { url })

  const headers = new Headers({
    'X-Elapi-key': apiKey,
  })
  const option = {
    method: 'DELETE',
    headers: headers,
  }

  fetch(url, option)
    .then((response) => {
      console.log('Delete: response.status', response.status)
      const event = { target: { id: 'btnDelete' } }
      updateButtonIsClicked(event)
    })
    .catch((error) => {
      console.error('Delete Error:', error)
    })
}

// デバイス追加ボタンがクリックされたときの method
// input: index <number>
// function: Web APIを利用してデバイスを追加し、デバイスリストを更新する
const addDeviceButtonIsClicked = () => {
  console.log('addDeviceButtonIsClicked')
  const url = config.servers[parseInt(serverSelection.value)].url + '/config/device/'
  let apiKey = ''
  if (serverSelection.value == '0') {
    apiKey = localStorage.getItem('apiKey0')
  } else if (serverSelection.value == '1') {
    apiKey = localStorage.getItem('apiKey1')
  }
  console.log('Add device, ', { url }, addDevice.value)

  const bodyData = '{"deviceType":"' + addDevice.value + '"}'
  const headers = new Headers({
    'X-Elapi-key': apiKey,
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
      const event = { target: { id: 'btnAdd' } }
      updateButtonIsClicked(event)
    })
    .catch((error) => {
      console.error('Add Error:', error)
    })
}

// 確認ボタンまたはUPDATEボタンがクリックされたときの method
// deleteDeviceButtonIsClicked, addDeviceButtonIsClicked からも呼ばれる
// input: event.target.id クリックされたボタンのid
//   btnV0:確認0, btnV1:確認1, btnV2:確認2, btnUpdate:Update
const updateButtonIsClicked = (event) => {
  console.log('updateButtonIsClicked, ', event.target.id)
  let btnNumber = 0
  let url = ''
  let apiKey = ''
  let apiKeyType = ''
  if (event.target.id == 'btnV0') {
    btnNumber = 0
    url = config.servers[0].url + '/devices'
    apiKeyType = config.servers[0].apiKeyType
    apiKey = localStorage.getItem('apiKey0')
  } else if (event.target.id == 'btnV1') {
    btnNumber = 1
    url = config.servers[1].url + '/devices'
    apiKeyType = config.servers[1].apiKeyType
    apiKey = localStorage.getItem('apiKey1')
  } else if (event.target.id == 'btnV2') {
    btnNumber = 2
    url = config.servers[2].url + '/devices'
    apiKeyType = config.servers[2].apiKeyType
    apiKey = localStorage.getItem('apiKey2')
  } else {
    // UPDATEボタン url, apiKey は現在選択中のserverに対応するもの
    url = config.servers[parseInt(serverSelection.value)].url + '/devices'
    apiKeyType = config.servers[parseInt(serverSelection.value)].apiKeyType
    const keyName = 'apiKey' + serverSelection.value
    apiKey = localStorage.getItem(keyName)
  }

  console.log('Update devices, ', { url, apiKeyType, apiKey })
  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (apiKeyType == 'X-Elapi-key') {
    headers.append('X-Elapi-key', apiKey)
  } else if (apiKeyType == 'Authorization') {
    headers.append('Authorization', 'Bearer ' + apiKey)
  } else {
    console.log('apiKeyType is wrong!', apiKeyType)
  }

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
        if (btnNumber == 0) {
          verify0.value = 'NG'
        } else if (btnNumber == 1) {
          verify1.value = 'NG'
        } else if (btnNumber == 2) {
          verify2.value = 'NG'
        }
      } else {
        if (btnNumber == 0) {
          verify0.value = 'OK'
        } else if (btnNumber == 1) {
          verify1.value = 'OK'
        } else if (btnNumber == 2) {
          verify2.value = 'OK'
        }
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

// page が表示されるときの処理
// function: status を表示する
onMounted(() => {
  console.log('Setting page, onMounted')
  verify0.value = sessionStorage.getItem('verify0') ?? 'NG'
  verify1.value = sessionStorage.getItem('verify1') ?? 'NG'
  verify2.value = sessionStorage.getItem('verify2') ?? 'NG'
})

// 他のページへ移るときの処理
// function: serverUrl, apiKey, apiKeyType を localStorage に set
// verify0, verify1, verify2 を sessionStorage に set
onBeforeUnmount(() => {
  console.log('Setting page, onBeforeUnmount')
  console.log('serverSelection: ', serverSelection.value)
  const serverUrl = servers[parseInt(serverSelection.value)].url
  let apiKey = ''
  if (serverSelection.value == '0') {
    apiKey = localStorage.getItem('apiKey0')
  } else if (serverSelection.value == '1') {
    apiKey = localStorage.getItem('apiKey1')
  } else if (serverSelection.value == '2') {
    apiKey = localStorage.getItem('apiKey2')
  } else {
    console.log('serverSelection is wrong!: ', serverSelection.value)
  }
  const apiKeyType = servers[parseInt(serverSelection.value)].apiKeyType
  console.log('onBeforeUnmount', { serverUrl, apiKey, apiKeyType })

  localStorage.setItem('serverUrl', serverUrl)
  localStorage.setItem('apiKey', apiKey)
  localStorage.setItem('apiKeyType', apiKeyType)
  sessionStorage.setItem('verify0', verify0.value)
  sessionStorage.setItem('verify1', verify1.value)
  sessionStorage.setItem('verify2', verify2.value)
})
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
