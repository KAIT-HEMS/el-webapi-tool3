// HomeSendRequest で request, statusCode, response を write
// HomeRequestResponse で request, statusCode, response を read
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useReqresStore = defineStore('reqres', () => {
  const request = ref('REQ:')
  const statusCode = ref('status code')
  const response = ref('RES: data')

  return { request, statusCode, response }
})
