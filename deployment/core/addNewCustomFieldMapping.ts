import { AxiosInstance } from "axios";
import { flow, groupBy, mapValues, keyBy } from "lodash/fp";

export interface FieldMapping {
  name: string
  schemaName: string
  label?: string
  description?: string
  fieldType: "string"|"id"|"calculated"|"email"|"encryptedstring"|"reference"|"textarea"|"htmltextarea"|"combobox"|"multipicklist"|"picklist"|"phone"|"url"|"int"|"double"|"decimal"|"currency"|"percent"|"duration"|"time"|"date"|"datetime"|"boolean"
  mapping: string
  referenceSchemaName?:string
  referenceSchemaFieldName?:string
  required?: boolean
  upsertKey?: boolean
  accessMode?:"read_only"|"read_write"|"insert_only"
  maxLength?: number
  precision?: number
  scale?: number
  showIf?: string
  isAlert?: boolean
  showDesktop?: boolean 
  showMobile?: boolean
  editableOnMobile?: boolean
  requiredOnMobile?: boolean
  displayOrder?: number
}

export default (listField: Array<FieldMapping>) => async (
  apiServer: AxiosInstance
) => {
  let {
    data: { result: existingFields }
  } = await apiServer.get<{ result: Array<FieldMapping> }>(
    "/custom/fields?legacyAlertPrefix=false"
  );

  const existingFieldMap = flow(
    groupBy('schemaName'),
    mapValues(keyBy('name'))
  )(existingFields)
  console.log(existingFieldMap)

  return apiServer.post("/custom/fields", 
    listField
      .filter(
        ({ name, schemaName }) => !(existingFieldMap?.[schemaName]?.[name])
      )
  )
};
