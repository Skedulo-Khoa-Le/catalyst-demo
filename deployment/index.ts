import * as readline from 'readline'
import { decode } from './core/jwt'
import { createAxiosFromAccessToken } from './core/createAxiosInstance'

import starterMigration from './starterMigration'

const rl = readline.createInterface(process.stdin, process.stdout)

const questionAsync = async (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, resolve)
  })
}

const main = async () => {
  try {
    let API_TOKEN = await questionAsync(`API_TOKEN:`)
    const { iss } = decode(API_TOKEN).payload;
    const DEFAULT_API_ENDPOINT = iss.slice(0, iss.indexOf('/auth'));
    let API_ENDPOINT = (await questionAsync(`API_ENDPOINT (${DEFAULT_API_ENDPOINT}):`)) || DEFAULT_API_ENDPOINT

    if (!API_TOKEN) {
      throw new Error('Missing API_ENDPOINT')
    }
    let DEV_ENDPOINT = await questionAsync(`DEV_ENDPOINT:`)
    let ASSET = await questionAsync(`AVAILABLE ASSETS:\n
    [0] All available assets\n
    [1] Starter Migration\n
Please choose number: `)
    let decodeJwt = decode(API_TOKEN)

    let vendor = decodeJwt?.payload?.['https://api.skedulo.com/vendor']

    const apiServer = createAxiosFromAccessToken(API_ENDPOINT, API_TOKEN)
    if (vendor === 'salesforce') {
    } else {
      switch (ASSET) {
        case '0':
          await starterMigration(apiServer, API_ENDPOINT, API_TOKEN, DEV_ENDPOINT)
          break;
        case '1':
          await starterMigration(apiServer, API_ENDPOINT, API_TOKEN, DEV_ENDPOINT)
          break;
        default:
          throw new Error('Chosen asset is not available')
      }
    }
  } catch (err) {
    console.log(err)
    console.log(JSON.stringify(err.response.data))
  } finally {
    rl.close()
  }
}

main()
