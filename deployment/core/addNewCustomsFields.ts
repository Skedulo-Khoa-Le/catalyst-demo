import { AxiosInstance } from "axios";
import { FieldMapping } from "./addNewCustomFieldMapping";
import { flow, groupBy, mapValues, keyBy } from "lodash/fp";

export enum AccessMode {
  read_only = "read_only",
  read_write = "read_write",
  insert_only = "insert_only"
}

export enum ColumnType {
  date = "date",
  decimal = "decimal",
  boolean = "boolean",
  string = "string",
  url = "url",
  textarea = "textarea",
  time = "time",
  datetime = "datetime",
  picklist = "picklist",
  multipicklist = "multipicklist",
  reference = "reference"
}

interface BaseColumnDefinition {
  required?: boolean;
  defaultValue?: string;
  temporaryDefaultValue?: boolean;
}

interface DateColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.date;
}

interface DecimalColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.decimal;
  precision: number;
  scale: number;
}

interface BooleanColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.boolean;
  default: boolean;
}

interface StringColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.string;
  unique?: boolean;
  maxLength?: number
}

interface TimeColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.time;
}

interface DateTimeColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.datetime;
}

type PicklistValue = string
type PicklistLabel = string
type PickListItem = [PicklistValue, PicklistLabel]

interface PickListColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.picklist;
  items: PickListItem[];
}

interface MultiPickListColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.multipicklist;
  items: PickListItem[];
}

interface TextareaColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.textarea
  maxLength?: number
}

interface UrlColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.url
  maxLength?: number
}

interface ReferenceColumnDefinition extends BaseColumnDefinition {
  type: ColumnType.reference;
  referenceSchemaName: string;
  referenceSchemaFieldName?: string;
}

export type ColumnDefinition =
  | DateColumnDefinition
  | TimeColumnDefinition
  | DateTimeColumnDefinition
  | PickListColumnDefinition
  | MultiPickListColumnDefinition
  | ReferenceColumnDefinition
  | StringColumnDefinition
  | DecimalColumnDefinition
  | BooleanColumnDefinition
  | TextareaColumnDefinition
  | UrlColumnDefinition;

export interface CustomFieldsDefinition {
  name: string;
  schemaName: string;
  label?: string;
  description?: string;
  accessMode?: AccessMode;
  showDesktop?: boolean;
  showMobile?: boolean;
  editableOnMobile?: boolean;
  requiredOnMobile?: boolean;
  displayOrder?: number;
  isAlert?: boolean
  column: ColumnDefinition;
}

export default (listField: Array<CustomFieldsDefinition>) => async (
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
  return Promise.all(
    listField
      .filter(
        ({ name, schemaName }) =>!(existingFieldMap?.[schemaName]?.[name])
      )
      .map(data => apiServer.post(`/custom/standalone/fields`, data))
  );
};
