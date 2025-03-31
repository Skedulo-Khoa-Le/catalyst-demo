import { AxiosInstance } from 'axios'

import onjobAfterInserted from './onjobAfterInserted'



export default async (apiServer: AxiosInstance, apiEndpoint: string, apiToken: string, devEndpoint: string) => {
 
  await onjobAfterInserted(apiServer, apiEndpoint, apiToken, devEndpoint)

}
