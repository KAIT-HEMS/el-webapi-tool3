// store/index.ts
// VueX を利用して global に値の受け渡しを実現する

import { createStore } from "vuex";
import { config } from "../config";
import { Log, NotificationData } from "../global.d";

const storedServerSelection =
  localStorage.getItem("serverSelection") ?? "server1";
const serverSelection =
  storedServerSelection == "server1" ? "server1" : "server2";
const serverUrl =
  serverSelection == "server1" ? config.serverUrl1 : config.serverUrl2;
const apiKey1 = localStorage.getItem("apiKey1") ?? "";
const apiKey2 = localStorage.getItem("apiKey2") ?? "";
const apiKey = serverSelection == "server1" ? apiKey1 : apiKey2;
console.log("store init:", { serverSelection }, { serverUrl }, { apiKey });
const logArray: Log[] = []; // logを格納するarray
const notificationData: NotificationData = {
  path: "",
  body: "Body: ",
};

export default createStore({
  state: {
    serverSelection: serverSelection, // "server1":実験サーバー, "server2":実証システム
    serverUrl: serverUrl,
    apiKey: apiKey,
    request: "Request:",
    statusCode: "Response: status code",
    response: "Response: data",
    logId: 0,
    logArray: logArray,
    notificationData: notificationData,
    webSocketIsConnected: false,
  },
  getters: {
    serverSelection: (state) => state.serverSelection,
    serverUrl: (state) => state.serverUrl,
    apiKey: (state) => state.apiKey,
    request: (state) => state.request,
    statusCode: (state) => state.statusCode,
    response: (state) => state.response,
    logId: (state) => state.logId,
    logArray: (state) => state.logArray,
    notificationData: (state) => state.notificationData,
    webSocketIsConnected: (state) => state.webSocketIsConnected,
  },
  mutations: {
    setServerSelection: function (state, value) {
      state.serverSelection = value;
    },
    setServerUrl: function (state, value) {
      state.serverUrl = value;
    },
    setApiKey: function (state, value) {
      state.apiKey = value;
    },
    setRequest: function (state, value) {
      state.request = value;
    },
    setStatusCode: function (state, value) {
      state.statusCode = value;
    },
    setResponse: function (state, value) {
      state.response = value;
    },
    setLogId: function (state, value) {
      state.logId = value;
    },
    setLogArray: function (state, value) {
      state.logArray = value;
    },
    setNotificationData: function (state, value) {
      state.notificationData = value;
    },
    setWebSocketIsConnected: function (state, value) {
      state.webSocketIsConnected = value;
    },
  },
  actions: {
    setServerSelection: function ({ commit }, value) {
      commit("setServerSelection", value);
    },
    setServerUrl: function ({ commit }, value) {
      commit("setServerUrl", value);
    },
    setApiKey: function ({ commit }, value) {
      commit("setApiKey", value);
    },
    setRequest: function ({ commit }, value) {
      commit("setRequest", value);
    },
    setStatusCode: function ({ commit }, value) {
      commit("setStatusCode", value);
    },
    setResponse: function ({ commit }, value) {
      commit("setResponse", value);
    },
    setLogId: function ({ commit }, value) {
      commit("setLogId", value);
    },
    setLogArray: function ({ commit }, value) {
      commit("setLogArray", value);
    },
    setNotificationData: function ({ commit }, value) {
      commit("setNotificationData", value);
    },
    setWebSocketIsConnected: function ({ commit }, value) {
      commit("setWebSocketIsConnected", value);
    },
  },
  modules: {},
});
