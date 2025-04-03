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
  let filteredItems = newVocabularyItems.filter(({value}) => !existingItems.find(schema => schema.value === value))
  for (const data of filteredItems){
    await apiServer.post(url, data)
  }
}
