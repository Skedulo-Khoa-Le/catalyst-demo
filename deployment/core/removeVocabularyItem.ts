import { AxiosInstance } from "axios";
import { VocabularyItemDefinition } from "./addVocabularyItem";

export default (schemaName: string, fieldName: string, vocabularyItems: string[]) => async (apiServer: AxiosInstance) =>  {
  const url = `/custom/vocabulary/${schemaName}/${fieldName}`
  let { data: { result : existingItems } } = await apiServer.get<{result: Array<VocabularyItemDefinition>}>(url)
  let filteredItems = vocabularyItems.filter(value => existingItems.find(schema => schema.value === value && schema.active))
  console.log('filteredItems: ', filteredItems);
  for (const vocabularyItem of filteredItems){
    await apiServer.delete(`${url}/${vocabularyItem}`)
  }
}
