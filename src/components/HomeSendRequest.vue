<!-- components/HomeSendRequest.vue -->
<!-- Home page の Send Request component を作成する -->
<!-- Send ボタンの処理では、送信だけでなく受信処理も含む -->
<!-- Web socket の処理も含む -->

<template>
  <div class="homeSendRequest">
    <div class="card">
      <div class="card-header">
        <div class="row">
          <div class="col-auto h5 mt-2">Send Request</div>
          <div class="col-auto"></div>
          <!-- Display server URL -->
          <div class="col-auto mt-2">{{ serverUrl }}</div>
          <!-- Connect web socket ボタン for 実証システム-->
          <template v-if="serverUrl === 'https://www.smarthouse-center.org/elapi/v1'">
            <div class="col-auto mt-1 pl-0">
              <button
                type="button"
                class="btn btn-secondary btn-sm fw-bold mr-1"
                title="Connect web socket"
                v-on:click="connectButtonIsClicked"
                v-bind:disabled="webSocketIsConnected"
              >
                Connect web socket
              </button>
              <!-- web socket が接続されたら、「リンク」アイコンを表示する -->
              <a class="btn" title="Web Socket Is Connected">
                <i v-if="webSocketIsConnected" class="bi bi-link" style="color: #000000"></i>
              </a>
            </div>
          </template>
          <div class="col"></div>
          <!-- SENDボタン -->
          <div class="col-auto mt-1 pl-0">
            <button
              type="button"
              class="btn btn-secondary btn-sm fw-bold"
              title="Send request"
              v-on:click="sendButtonIsClicked"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      <div class="card-body pt-2 pb-2">
        <form>
          <div class="row g-1">
            <!-- Method selection -->
            <div class="col-md-1">
              <label for="inputMethod">Method</label>
              <select
                id="inputMethod"
                class="form-control"
                v-model="methodSelected"
                v-on:change="methodIsUpdated"
                v-bind:style="methodStyle"
              >
                <option v-for="method in methodList" :key="method.id">
                  {{ method }}
                </option>
              </select>
            </div>
            <!-- Service selection -->
            <div class="col-md-2">
              <label for="inputService">Service</label>
              <select
                id="inputService"
                class="form-control"
                v-model="serviceSelected"
                v-on:change="serviceIsUpdated"
                v-bind:style="serviceStyle"
              >
                <option v-for="service in serviceList" :key="service.id">
                  {{ service }}
                </option>
              </select>
            </div>
            <!-- Id selection -->
            <div class="col-md-2">
              <label for="inputId">Id</label>
              <select
                id="inputId"
                class="form-control"
                title="Id"
                v-model="idSelected"
                v-on:change="idIsUpdated"
              >
                <option
                  v-for="idInfo in idInfoList"
                  v-bind:title="idInfo.deviceType"
                  :key="idInfo.id"
                >
                  {{ idInfo.id }}
                </option>
              </select>
            </div>
            <!-- Resource type selection -->
            <div class="col-md-2">
              <label for="inputResourceType">Resource Type</label>
              <select
                id="inputResourceType"
                class="form-control"
                v-model="resourceTypeSelected"
                v-on:change="resourceTypeIsUpdated"
                v-bind:style="resourceTypeStyle"
              >
                <option v-for="resourceType in resourceTypeList" :key="resourceType.id">
                  {{ resourceType }}
                </option>
              </select>
            </div>
            <!-- Resource name selection -->
            <div class="col-md-3">
              <label for="inputResourceName">Resource Name</label>
              <select
                id="inputResourceName"
                class="form-control"
                v-model="resourceNameSelected"
                v-on:change="resourceNameIsUpdated"
                v-bind:style="resourceNameStyle"
              >
                <option v-for="resourceName in resourceNameList" :key="resourceName.id">
                  {{ resourceName }}
                </option>
              </select>
            </div>
            <!-- URL parameters input -->
            <div class="col-md-2">
              <label for="inputQuery">URL Parameters</label>
              <input
                type="text"
                class="form-control"
                id="inputQuery"
                v-model="query"
                v-bind:style="queryStyle"
              />
            </div>
          </div>

          <!-- Display device type -->
          <div class="row" id="second-line">
            <div class="col-md-3"></div>
            <div class="col-md-2">
              <label>{{ deviceType }}</label>
            </div>
          </div>

          <div class="input-group mb-2">
            <span class="input-group-text">Body data</span>
            <input
              type="text"
              class="form-control"
              id="inputBody"
              v-model="body"
              v-bind:style="bodyStyle"
            />
            <button
              type="button"
              class="btn btn-secondary btn-sm fw-bold"
              title="Copy from Response"
              v-on:click="copyFromResponseButtonIsClicked"
            >
              Copy from Response
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-sm fw-bold ms-1"
              title="Clear"
              v-on:click="clearBodyButtonIsClicked"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// localStorage: serverUrl, apiKeyType, apiKey, serverSelection(選択中のserver 0,1,2, )
// localStorage: apiKey0, apiKey1, apiKey2
// store reqresStore: HomeSendRequest.vue から HomeRequestResponse.vue へ
// store logStore: HomeSendRequest.vue から HomeLog.vue へ
import { ref } from 'vue'
import { onMounted } from 'vue'
import { useReqresStore } from '@/stores/reqres'
const reqresStore = useReqresStore()
import { useLogStore } from '@/stores/log'
const logStore = useLogStore()
console.log('HomeSendRequest.vue init')
console.log('serverSelection: ', localStorage.getItem('serverSelection'))

let g_thingInfo = {} // { [key: string]: ThingInfo }

const methodList = ['GET', 'PUT', 'POST', 'DELETE']
const methodSelected = ref('GET')
const serviceList = ref(['']) // [/devices, /groups]
const serviceSelected = ref('') // /devices
const idInfoList = ref([]) // [{deviceType:"/aircon", id:"0123"},... ] GET /devices, groups, bulk, histories のレスポンスを利用
const idSelected = ref('')
const deviceType = ref('')
const resourceTypeList = ref(['']) // [/properties, /actions]
const resourceTypeSelected = ref('') // /properties
const resourceNameList = ref(['']) // [/airFlowLevel, /roomTemperature,...]
const resourceNameSelected = ref('') //  /airFlowLevel
const query = ref('')
const body = ref('')

const serverUrl = ref(localStorage.getItem('serverUrl') ?? '')
let apiKey = localStorage.getItem('apiKey') ?? 'initial key'
let apiKeyType = localStorage.getItem('apiKeyType') ?? 'initial keyType'
console.log('init: serverUrl', serverUrl.value, 'apiKey: ', apiKey, 'apiKeyType', apiKeyType)
const notificationData = ref('')
const webSocketIsConnected = ref(false)

// SENDボタンがクリックされたときの処理
const sendButtonIsClicked = () => {
  // UI から path, url の作成
  let path = ''
  if (serviceSelected.value !== '') {
    path += serviceSelected.value
    if (idSelected.value !== '') {
      path += idSelected.value
      if (resourceTypeSelected.value !== '') {
        path += resourceTypeSelected.value
        if (resourceNameSelected.value !== '') {
          path += resourceNameSelected.value
          if (query.value !== '') {
            path += '?' + query.value
          }
        }
      }
    }
  }
  const url = serverUrl.value + path
  console.log('sendButtonIsClicked', { url, apiKey, apiKeyType })

  const headers = new Headers({
    'Content-Type': 'application/json',
  })

  if (apiKeyType == 'X-Elapi-key') {
    console.log('X-Elapi-key', apiKey)
    headers.append('X-Elapi-key', apiKey)
  } else if (apiKeyType == 'Authorization') {
    console.log('Authorization', apiKey)
    headers.append('Authorization', 'Bearer ' + apiKey)
  } else {
    console.log('apiKeyType is wrong!', apiKeyType)
  }

  let option = {
    method: methodSelected.value,
    headers: headers,
  }
  if (methodSelected.value !== 'GET') {
    option.body = body.value
  }

  // Request の内容を、store "reqresStore.request" に代入
  reqresStore.request = 'REQ: ' + methodSelected.value + ' ' + url + '\n' + body.value

  // Request を LOGに追加
  let log = {
    // id: String(logStore.logId++),
    timeStamp: timeStamp(),
    direction: 'REQ',
    statusCode: '',
    data: methodSelected.value + ' ' + url,
    body: body.value,
  }
  logStore.logArray.push(log)

  // ECHONET Lite WebAPI Server へのアクセス
  console.log('fetch url: ', url, 'option: ', option)
  fetch(url, option)
    .then((response) => {
      console.log('response: ', { response })
      // Response 内容設定
      reqresStore.statusCode = 'status: ' + response.status + ' ' + response.statusText
      if (methodSelected.value == 'DELETE') {
        response.value = ''
        return
      } else {
        return response.json()
      }
    })
    .then((data) => {
      console.log('Success:', { data })
      // Response の data 内容設定
      reqresStore.response = data
      // RESPONSE を LOG に追加
      let log = {
        timeStamp: timeStamp(),
        direction: 'RES',
        statusCode: reqresStore.statusCode,
        data: data,
        body: '',
      }
      logStore.logArray.push(log)

      // ECHONET Lite WebApi Serverからの response 処理
      if (methodSelected.value == 'GET') {
        // GET /elapi/v1 の場合
        // serviceListを新規に作成する
        let regex = /\/v1$/ // 正規表現：行末が'/v1'
        if (regex.test(url)) {
          let serviceListTmp = ['']
          if (data.v1 !== undefined) {
            for (let service of data.v1) {
              serviceListTmp.push('/' + service.name)
            }
          }
          console.log('GET /elapi/v1 serviceListの更新:', serviceList)
          serviceList.value = serviceListTmp
          // 入力フィールドserviceの表示項目の更新
          serviceSelected.value = serviceList.value[1] ? serviceList.value[1] : ''
        }

        // GET /elapi/v1/devices, groups, bulks, histories, resHistories, groupHistories の場合
        // idInfoListを新規に作成する
        let service = ''
        regex = /\/devices$/ // 正規表現：行末が'/devices'
        if (regex.test(url)) {
          service = 'devices'
        }
        regex = /\/groups$/ // 正規表現：行末が'/groups'
        if (regex.test(url)) {
          service = 'groups'
        }
        regex = /\/bulks$/ // 正規表現：行末が'/bulks'
        if (regex.test(url)) {
          service = 'bulks'
        }
        regex = /\/histories$/ // 正規表現：行末が'/histories'
        if (regex.test(url)) {
          service = 'histories'
        }
        regex = /\/resHistories$/ // 正規表現：行末が'/resHistories'
        if (regex.test(url)) {
          service = 'resHistories'
        }
        regex = /\/groupHistories$/ // 正規表現：行末が'/groupHistories'
        if (regex.test(url)) {
          service = 'groupHistories'
        }

        if (service !== '') {
          idInfoList.value = [{ deviceType: '', id: '' }]
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
          console.log('GET /elapi/v1/devices idInfoListの更新:', idInfoList.value)

          // 入力フィールドidの表示項目の更新
          idSelected.value = idInfoList.value[1] ? idInfoList.value[1].id : ''
          // Device Typeの表示項目の更新
          deviceType.value = updateDeviceType(idSelected.value.slice(1))
          console.log('call updateDeviceType()', idSelected.value.slice(1))
        }

        // GET /elapi/v1/devices, groups, bulks, histories, resHistories, groupHistories/<id> の場合
        // responseはthing (device/group/bulk/history) description -> g_thingInfoに情報を追加
        // this.resourceTypeListにresource typeをpushする
        // this.resourceNameListにresource nameをpushする
        service = ''
        regex = /\/devices\/([0-9]|[a-z]|[A-Z]|-|-)+$/ // 正規表現'/devices/'の後、行末まで英数字
        if (regex.test(url)) {
          service = 'devices'
        }
        regex = /\/groups\/([0-9]|[a-z]|[A-Z]|-)+$/ // 正規表現'/groups/'の後、行末まで英数字
        if (regex.test(url)) {
          service = 'groups'
        }
        regex = /\/bulks\/([0-9]|[a-z]|[A-Z]|-)+$/ // 正規表現'/bulks/'の後、行末まで英数字
        if (regex.test(url)) {
          service = 'bulks'
        }
        regex = /\/histories\/([0-9]|[a-z]|[A-Z]|-)+$/ // 正規表現'/histories/'の後、行末まで英数字
        if (regex.test(url)) {
          service = 'histories'
        }
        regex = /\/resHistories\/([0-9]|[a-z]|[A-Z]|-)+$/ // 正規表現'/resHistories/'の後、行末まで英数字
        if (regex.test(url)) {
          service = 'resHistories'
        }
        regex = /\/groupHistories\/([0-9]|[a-z]|[A-Z]|-)+$/ // 正規表現'/groupHistories/'の後、行末まで英数字
        if (regex.test(url)) {
          service = 'groupHistories'
        }
        console.log('GET /elapi/v1/', service, '/<id>')

        if (service !== '') {
          const pathElements = url.split('/') // pathを'/'で分割して要素を配列にする
          const thingId = pathElements[pathElements.length - 1] // 配列の最後の要素が <id>

          // Thing Desvription をもとに g_thingInfo を更新する
          const thingDescription = data
          const dt = thingDescription.deviceType !== undefined ? thingDescription.deviceType : ''
          let thingInfo = {
            deviceType: dt,
            propertyList: [''],
            // propertyListWritable: [''],
            actionList: [''],
          }

          // propertyListの作成
          if (thingDescription.properties !== undefined) {
            for (let resourceName of Object.keys(thingDescription.properties)) {
              thingInfo.propertyList.push('/' + resourceName)
            }
          }

          // actionListの作成
          if (thingDescription.actions !== undefined) {
            for (let resourceName of Object.keys(thingDescription.actions)) {
              thingInfo.actionList.push('/' + resourceName)
            }
          }

          thingInfo.propertyList.sort()
          // thingInfo.propertyListWritable.sort()
          thingInfo.actionList.sort()
          g_thingInfo[thingId] = thingInfo
          console.log({ thingId }, { thingInfo }, { g_thingInfo })

          // resourceTypeListを新規に作成する
          let rtl = ['']
          if (data.properties !== undefined) {
            rtl.push('/properties')
          }
          if (data.actions !== undefined) {
            rtl.push('/actions')
          }
          if (data.events !== undefined) {
            rtl.push('/events')
          }
          resourceTypeList.value = rtl
          console.log('resourceTypeListの更新:', { rtl })

          // 入力フィールドResouce TypeとResource Nameの表示項目の更新
          const urn = updateResourceName('GET', thingId, '/properties')
          resourceNameSelected.value = urn[0]
          resourceNameList.value = urn[1]
          resourceTypeSelected.value = rtl[1] ? rtl[1] : ''
          // 入力フィールドidの下のdeviceTypeの更新
          deviceType.value = data.deviceType
        }
      }
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}

// Connect web socketボタンがクリックされたときの処理
// function: 実証システムに web socket を接続する
const connectButtonIsClicked = () => {
  console.log('Connect Web Socket button is clicked')
  const url = 'wss://www.smarthouse-center.org/ws/elapi'
  const ws = new WebSocket(url, ['echonetlite-protocol', apiKey])

  ws.addEventListener('open', () => {
    console.log('WebSocket が接続されました。')
    webSocketIsConnected.value = true
  })
  ws.addEventListener('close', () => {
    console.log('WebSocket が切断されました。')
    webSocketIsConnected.value = false
    setTimeout(() => {
      connectButtonIsClicked()
    }, 1000)
  })
  ws.addEventListener('error', () => {
    console.log('WebSocket 接続に失敗しました。')
  })
  ws.addEventListener('message', (event) => {
    console.log('Web socket メッセージを受信しました。')
    notificationData.value = JSON.parse(event.data)
    console.log('Web socket', notificationData.value)
  })
}

// Copy from responseボタンがクリックされたときの処理
// input: <string> reqresStore.response
// function: reqresStore.response の値を body.value に代入する
const copyFromResponseButtonIsClicked = () => {
  body.value = JSON.stringify(reqresStore.response)
}

// Clear Body ボタンがクリックされたときの処理
// function: body をクリアする
const clearBodyButtonIsClicked = () => {
  body.value = ''
}

// 入力フィールド Method の値が変更された場合の処理
// resourceTypeListとresourceNameListをupdate
const methodIsUpdated = () => {
  // serviceとdevice idがblankでなく、device descriptionが存在する場合
  if (serviceSelected.value !== '' && idSelected.value !== '') {
    console.log('methodIsUpdated:idSelected', idSelected.value)
    const thingId = idSelected.value.slice(1) // remove "/" from idSelected
    let resourceNameList = ['']
    if (g_thingInfo[thingId] !== undefined) {
      switch (methodSelected.value) {
        case 'GET':
        case 'PUT':
          // body.value = "";
          resourceNameList = g_thingInfo[thingId].propertyList
          resourceTypeSelected.value = '/properties'
          break
        // case "PUT":
        //   resourceNameList = g_thingInfo[thingId].propertyListWritable;
        //   resourceTypeSelected.value = "/properties";
        //   break;
        case 'POST':
          resourceNameList = g_thingInfo[thingId].actionList
          resourceTypeSelected.value = '/actions'
          break
        case 'DELETE':
          break
      }
      if (resourceTypeSelected.value !== '') {
        resourceNameList.value = resourceNameList
      }
    }
  }
}

// 入力フィールド service の値が変更された場合の処理
const serviceIsUpdated = () => {
  // idInfoList.value = [{}];
  resourceTypeList.value = ['']
  resourceNameList.value = ['']
  idSelected.value = ''
  resourceTypeSelected.value = ''
  resourceNameSelected.value = ''
  deviceType.value = ''
  body.value = ''
}

// 入力フィールド id の値が変更された場合の処理
// deviceType.valueをidInfoList.valueを利用してupdateする
// 選択されたidのdevice descriptionが存在する場合は、resourceTypeとresourceNameを更新する
const idIsUpdated = () => {
  console.log('method: idIsUpdated')
  const thingId = idSelected.value.slice(1) // remove "/"
  resourceTypeList.value = ['']
  resourceNameList.value = ['']
  deviceType.value = ''
  resourceTypeSelected.value = ''
  resourceNameSelected.value = ''
  deviceType.value = updateDeviceType(thingId)
  const deviceInfo = g_thingInfo[thingId]
  if (deviceInfo !== undefined) {
    let resourceTypeList = ['']
    if (deviceInfo.propertyList !== undefined) {
      resourceTypeList.push('/properties')
    }
    if (deviceInfo.actionList !== undefined) {
      resourceTypeList.push('/actions')
    }
    resourceTypeList.value = resourceTypeList
    resourceTypeSelected.value = resourceTypeList[1] ? resourceTypeList[1] : ''
    updateResourceName(methodSelected.value, thingId, resourceTypeSelected.value)
    resourceNameSelected.value = resourceNameList.value[1] ? resourceNameList.value[1] : ''
  }
}

// 入力フィールド resourceType の値が変更された場合の処理
//  resourceNameListをupdateする
const resourceTypeIsUpdated = () => {
  const urn = updateResourceName(
    methodSelected.value,
    idSelected.value.slice(1),
    resourceTypeSelected.value,
  )
  resourceNameSelected.value = urn[0]
  resourceNameList.value = urn[1]
}

// 入力フィールド resourceName の値が変更された場合の処理
const resourceNameIsUpdated = () => {
  console.log('resourceNameIsUpdated')
}

onMounted(() => {
  console.log('HomeSendRequest.vue onMounted')
  serverUrl.value = localStorage.getItem('serverUrl') ?? ''
  apiKey = localStorage.getItem('apiKey') ?? ''
  apiKeyType = localStorage.getItem('apiKeyType') ?? ''
  console.log('serverUrl', serverUrl.value, 'apiKey: ', apiKey, 'apiKeyType', apiKeyType)
})

// input: deviceId <string>
// output: <string>
function updateDeviceType(deviceId) {
  for (const idInfo of idInfoList.value) {
    if (idInfo.id == '/' + deviceId) {
      return idInfo.deviceType
    }
  }
  return ''
}

// return value: resourceNameList
// input: methodSelected <string>
// input: idSelected <string>
// input: resourceTypeSelected <string>
// output: [string, string[]]
function updateResourceName(methodSelected, idSelected, resourceTypeSelected) {
  let resourceNameList = [] // string[]
  let resourceNameSelected = ''
  if (resourceTypeSelected !== '') {
    const thingInfo = g_thingInfo[idSelected]
    if (thingInfo !== undefined) {
      if (resourceTypeSelected == '/properties' && methodSelected == 'GET') {
        resourceNameList = thingInfo.propertyList
      }
      if (resourceTypeSelected == '/properties' && methodSelected == 'PUT') {
        // resourceNameList = thingInfo.propertyListWritable
        resourceNameList = thingInfo.propertyList
      }
      if (resourceTypeSelected == '/actions' && methodSelected == 'POST') {
        resourceNameList = thingInfo.actionList
      }
      resourceNameSelected = resourceNameList[1] ? resourceNameList[1] : ''
      console.log({ resourceNameSelected }, { resourceNameList })
    }
  }
  console.log(
    'function updateResourceName(',
    { methodSelected },
    { idSelected },
    { resourceTypeSelected },
    ')',
    { resourceNameSelected },
    { resourceNameList },
  )
  return [resourceNameSelected, resourceNameList]
}

// function: 現在時刻を取得する
// output: <string>
function timeStamp() {
  const date = new Date()
  let hour = date.getHours().toString()
  let minute = date.getMinutes().toString()
  let second = date.getSeconds().toString()
  hour = hour.length == 1 ? '0' + hour : hour
  minute = minute.length == 1 ? '0' + minute : minute
  second = second.length == 1 ? '0' + second : second
  return hour + ':' + minute + ':' + second
}
</script>

<style scoped></style>
