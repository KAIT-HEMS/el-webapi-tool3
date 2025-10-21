// HomeSendRequest で request, statusCode, response を write
// HomeRequestResponse で request, statusCode, response を read
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useReqresStore = defineStore('reqres', () => {
  const request = ref('Request:')
  const statusCode = ref('Response: status code')
  const response = ref('Response: data')

  return { request, statusCode, response }
})
