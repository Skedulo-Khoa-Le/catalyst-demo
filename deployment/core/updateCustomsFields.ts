import { AxiosInstance } from "axios";

interface FieldIndentifier {
  schemaName: string;
  name: string;
}

interface RequiredFieldDefinition extends FieldIndentifier {
  id: string;
  mapping: string;
  fieldType: string;
}

type updateableFieldProperty =
  | "label"
  | "description"
  | "referenceSchemaName"
  | "referenceSchemaFieldName"
  | "required"
  | "upsertKey"
  | "accessMode"
  | "readOnly"
  | "maxLength"
  | "precision"
  | "scale"
  | "isAlert"
  | "showIf"
  | "showDesktop"
  | "showMobile"
  | "editableOnMobile"
  | "requiredOnMobile"
  | "displayOrder";

interface UpdateFieldDefinition extends FieldIndentifier, Partial<Record<updateableFieldProperty, any | string>> {
  
}

interface ExisitngFieldDefinition extends RequiredFieldDefinition, Record<updateableFieldProperty, string> {
}

export default (listField: Array<UpdateFieldDefinition>) => async (
  apiServer: AxiosInstance
) => {
  let {
    data: { result: existingFields }
  } = await apiServer.get<{ result: Array<ExisitngFieldDefinition> }>(
    "/custom/fields"
  );
  const updateData = listField
    .map<UpdateFieldDefinition>(({schemaName, name, ...rest}) => {
      let existingField = existingFields.find((field) => field.schemaName === schemaName && field.name === name)
      if (!existingField) {
        throw new Error(`Can't Find field: schemaName: ${schemaName}, name: ${name}`)
      }
      return {
        ...existingField, 
        ...rest
      }
    })

  return apiServer.post("/custom/fields", updateData);
};
