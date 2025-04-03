import {flatMap} from 'lodash/fp'

import {AxiosInstance} from 'axios'

interface BaseWebhook {
    id: string
    name: string
    query: string
    url: string
    customFields: any
    offset: number
    headers: any
}

interface ViewWebhook extends BaseWebhook {
    fieldName?: String
}

interface CreateWebhook extends BaseWebhook {
    field?: String
}

interface UpdateWebhook {
    overide: {
        [Property in keyof BaseWebhook]?: BaseWebhook[Property]
    }
}

export interface UpdateWebhookMap {
    [key: string]: UpdateWebhook
}

const fieldMappings: {from: keyof ViewWebhook, to: keyof CreateWebhook}[] = [{
    from: 'fieldName',
    to: 'field'
}]

export default (updateWebhookMap:UpdateWebhookMap) => async (apiServer: AxiosInstance) =>  {
    let {data: {result :webhooks}} = await apiServer.get<{result: Array<ViewWebhook>}>('/webhooks') ;
    console.log(JSON.stringify(webhooks));
    let pickWebhook = []
    for (let webhookNamePrefix in updateWebhookMap) {
        let updateDefinition = updateWebhookMap[webhookNamePrefix];
        let oldWebhook = webhooks.find(({name}) => name.toLowerCase().startsWith(webhookNamePrefix.toLowerCase()))
        if (oldWebhook === undefined) {
            console.log(webhookNamePrefix)
            throw new Error(`can't found old webhook`)
        }

        pickWebhook.push({
            oldId : oldWebhook.id,
            newWebhookDefinition: {
                ...oldWebhook,
                name: `${webhookNamePrefix}${(+oldWebhook.name.replace(webhookNamePrefix, '') || 0) + 1}`, // update name field
                ...fieldMappings.reduce((acc, {from, to})=> ({
                    ...acc,
                    ...(oldWebhook && oldWebhook[from] ? {
                        [to]: oldWebhook[from]
                    }: {})
                }), {}),
                ...updateDefinition.overide
            }
        })
    }

    return Promise.all(
        flatMap(({oldId, newWebhookDefinition}) => ([
            apiServer.delete(`/webhooks/${oldId}`),
            apiServer.post(`/webhooks`, newWebhookDefinition)
        ]), pickWebhook)
    )

}