<!-- components/HomeNotification.vue -->
<!-- Home page の Notification component を作成する -->

<template>
  <div class="homeNotification">
    <!-- 実証システムの場合のみ表示 -->
    <template v-if="serverSelection === 'server2'">
      <div class="card">
        <div class="card-header">
          <div class="row">
            <div class="col-auto h5 mt-2">Notification</div>
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

        <div class="card-body" id="notification-body">
          <div id="notification-wrapper">
            <ul class="list-group" id="notification-list">
              <li class="list-group-item">Path: {{ notificationData.path }}</li>
              <li class="list-group-item">
                <pre>{{ notificationData.body }}</pre>
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
import { onMounted } from 'vue'

// import { defineComponent } from "vue";
// import { NotificationData } from "../global.d";

console.log('HomeNotification init')

// export default defineComponent({
//   name: "HomeNotification",
//   computed: {
//     serverSelection: {
//       get() {
//         return this.$store.getters.serverSelection;
//       },
//       set(value) {
//         this.$store.dispatch("setServerSelection", value);
//       },
//     },
//     notificationData: {
//       get() {
//         return this.$store.getters.notificationData;
//       },
//       set(value) {
//         this.$store.dispatch("setNotificationData", value);
//       },
//     },
//   },
//   methods: {
//     // CLEARボタンがクリックされたときの処理（ログ画面のクリア）
//     clearButtonisClicked: function () {
//       console.log("clearButtonisClicked");
//       const notificationData: NotificationData = {
//         path: "Path: ",
//         body: "Body: ",
//       };
//       this.notificationData = notificationData;
//     },
//   },

onMounted(() => {
  console.log('HomeNotification is created')
})

// });
</script>

<style scoped>
#notification-body {
  margin: 0;
  padding: 0;
}
#notification-wrapper {
  height: 10em;
  overflow-y: scroll;
}
#notification-list li {
  font-family: Consolas, 'Courier New', Courier, Monaco, monospace;
  font-size: 90%;
  padding: 0.2em 1em;
}
</style>
