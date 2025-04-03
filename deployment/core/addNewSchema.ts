import { CustomFieldsDefinition } from "./addNewCustomsFields";
import { AxiosInstance } from "axios";

export interface SchemaDefinition {
  name: string
  label: string
  description? : string
  fields?: Omit<CustomFieldsDefinition, "schemaName">[]
}


export default (newSchemas : SchemaDefinition[]) => async (apiServer: AxiosInstance) =>  {
    let {data: {result : existingSchemas}} = await apiServer.get<{result: Array<SchemaDefinition>}>('/custom/schemas')
    let filterSchema = newSchemas.filter(({name}) => !existingSchemas.find(schema => schema.name === name))
    for (const data of filterSchema){ 
        await apiServer.post(`/custom/standalone/schemas`, data)
    }
}