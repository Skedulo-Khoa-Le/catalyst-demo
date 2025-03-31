
import * as http from 'http'
import * as https from 'https'
import axios from 'axios'

const httpAgent = new http.Agent({ keepAlive: true })
const httpsAgent = new https.Agent({ keepAlive: true })

export const createAxiosFromAccessToken = (baseURL: string, token?: string) => {

  const headers = token ? { Authorization: `Bearer ${token}` } : void 0

  return axios.create({
    baseURL,
    headers,
    httpAgent,
    httpsAgent
  })
}