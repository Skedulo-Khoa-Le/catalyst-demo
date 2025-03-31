import {flatMap} from 'lodash/fp'

import {AxiosInstance} from 'axios'

export enum WebhookType {
  graphql_deferred= "graphql_deferred",
  graphql = "graphql",
  inbound_sms= "inbound_sms",
  scheduled = "scheduled"
}

interface BaseWebhook {
  name: string
  url: string
  headers: any
}

interface InboundSMSWebhook extends BaseWebhook {
  type: WebhookType.inbound_sms
}

interface GraphQLWebhook extends BaseWebhook{
  type: WebhookType.graphql
  query: string
  customFields?: any
}

interface GraphQLDefferedWebhook extends BaseWebhook{
  type: WebhookType.graphql_deferred
  // schemaName: string,
  field: string
  query: string
  offset: number | { field: string, default?: number } 
  filter: string
  customFields?: any
}
interface ScheduledWebhook extends BaseWebhook {
  type: WebhookType.scheduled,
  cron: string
}

interface ViewWebhook extends BaseWebhook {
    id: string
}

type CreateWebhook = InboundSMSWebhook | GraphQLWebhook | GraphQLDefferedWebhook | ScheduledWebhook

export interface CreateWebhookMap {
    [key: string]: CreateWebhook
}

export default (updateWebhookMap:CreateWebhookMap) => async (apiServer: AxiosInstance) =>  {
    let {data: {result :webhooks}} = await apiServer.get<{result: Array<ViewWebhook>}>('/webhooks') ;
    console.log(JSON.stringify(webhooks));
    let pickWebhook = []
    for (let webhookNamePrefix in updateWebhookMap) {
        let updateDefinition = updateWebhookMap[webhookNamePrefix];
        let oldWebhook = webhooks.find(({name}) => name.toLowerCase().startsWith(webhookNamePrefix.toLowerCase()))
        if (oldWebhook === undefined) {
          pickWebhook.push(updateDefinition)
        }
    }

    return Promise.all(
        flatMap((newWebhookDefinition) => ([
            apiServer.post(`/webhooks`, newWebhookDefinition)
        ]), pickWebhook)
    )

}