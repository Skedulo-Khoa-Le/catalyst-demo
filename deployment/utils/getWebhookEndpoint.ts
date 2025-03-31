export type WebhookConfig = {
  WEBHOOK_NAME: string
  WEBHOOK_QUERY: string
  ROUTE_NAME: string
  FUNCTION_NAME: string
  PACKAGE_NAME_ENDPOINT: string
}

/**
 * Get Webhook base on config and Env
 * @param webhookConfig 
 * @param apiEndpoint 
 * @param devEndpoint 
 * @returns 
 */
const getEndpointUrl = (
  webhookConfig: Omit<WebhookConfig, 'WEBHOOK_NAME' | 'WEBHOOK_QUERY'>,
  apiEndpoint: string,
  devEndpoint?: string
): string => {
  const { ROUTE_NAME, PACKAGE_NAME_ENDPOINT, FUNCTION_NAME } = webhookConfig
  const devUrl = `${devEndpoint}/${ROUTE_NAME}`
  const apiUrl = `${apiEndpoint}/function/${PACKAGE_NAME_ENDPOINT}/${FUNCTION_NAME}/${ROUTE_NAME}`
  const url = devEndpoint ? devUrl : apiUrl
  return url
}

export default getEndpointUrl
