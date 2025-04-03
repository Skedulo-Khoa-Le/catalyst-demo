import { AxiosInstance } from "axios";

export interface VocabularyItemDefinition {
  value: string
  label: string
  active : boolean
  defaultValue: boolean
  controllingField?: string
  validFor: string[]
}

export default (schemaName: string, fieldName: string, newVocabularyItems: VocabularyItemDefinition[]) => async (apiServer: AxiosInstance) =>  {
  const url = `/custom/vocabulary/${schemaName}/${fieldName}`
  let { data: { result : existingItems } } = await apiServer.get<{result: Array<VocabularyItemDefinition>}>(url)

  for (const data of existingItems) {
    console.log(`Deactive vocabulary: ${schemaName}/${fieldName}/${data.value}`)
    await apiServer.delete(`${url}/${data.value}`)
  }

  for (const data of newVocabularyItems){
    console.log(`Add vocabulary: ${schemaName}/${fieldName}: ${data.value}`)
    await apiServer.post(url, data)
  }
}
