
export interface HasID {
  UID: string
}

export interface BaseObject extends HasID {
  Name: string
}

export type OmitTypeName<T> = Omit<T, '__typename'>

export interface Attachment {
  filePtr: string
  fileName: string
  parentId: string
  downloadUrl: string
}

export interface UserMetadata {
  id: string
  username: string
  fullName: string
  resource: {
    id: string
    category: string
    employeeType: string
    timezone: string
  }
}

export interface TableCellRendererItem<T, K extends keyof T> {
  cell: {
    value: T[K];
  };
  row: {
    original: T;
  };
}

export interface GraphqlListResponse<T> {
  totalCount: number
  edges: Array<{
    cursor: string
    node: T
  }>
  pageInfo: {
    hasNextPage: boolean
  }
}

export type GraphqlConnectionListResponse<T, K extends string = string> = {
  [queryName in K]: {
    edges: {
      node: T
    }[]
    totalCount: number
  }
}

export interface OrderParams {
  orderBy: string
  orderType: 'DESC' | 'ASC'
}

export interface Vocabulary {
  [schema: string]: {
    [field: string]: VocabularyField[]
  }
}

export interface VocabularyField {
  controllingField: string
  label: string
  controller: string
  defaultValue: boolean
  value: string
  validFor: string[]
  active: boolean
}

export interface TransformedListResponse<T> {
  data: T[]
  hasNextPage?: boolean
  totalCount: number
}

export interface OrderParams {
  orderBy: string
  orderType: 'DESC' | 'ASC'
}

export interface GraphqlVariables {
  filter: string
  orderBy?: string
  offset?: number
  first?: number
  rawParams?: Record<string, any>
}
