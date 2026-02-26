// UserRole type — used for workspace_roles DB shape (renamed from Role to avoid clash with Role namespace)
export interface UserRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
  updatedAt?: string;
}
