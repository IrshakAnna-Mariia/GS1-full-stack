export type ShareResourceType = 'folder' | 'file'
export type SharePermission = 'view' | 'edit'
export type ShareType = 'user' | 'link'

export type ShareDto = {
  id: string
  resourceType: ShareResourceType
  resourceId: string
  permission: SharePermission
  type: ShareType
  userId: string | null
  token: string | null
  createdBy: string
  createdAt: string
}
