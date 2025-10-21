// HomeSendRequest で request, statusCode, response を write
// HomeLog で logId, logArray を read
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLogStore = defineStore('log', () => {
  const logId = ref(0)
  const logArray = ref([])

  return { logId, logArray }
})
