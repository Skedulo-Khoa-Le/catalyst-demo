import { AxiosInstance } from "axios";

interface FieldPermission {
  read: boolean,
  create: boolean,
  update: boolean,
}
interface ObjectPermission {
  permissions: {
    read: boolean,
    create: boolean,
    update: boolean,
    delete: boolean,

  }
  fields: {
    [key: string]: FieldPermission
  }
}

export interface RoleOveridePermision {
  [key: string]: ObjectPermission | null
}

type Role = 'administrator' | 'scheduler' | 'resource'


export default (role: Role, permission: RoleOveridePermision) => async (
  apiServer: AxiosInstance
) => await apiServer.post(`standalone/permissions/role/${role}`, {objects: permission})