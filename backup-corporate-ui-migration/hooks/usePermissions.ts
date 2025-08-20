import { useCallback } from 'react';
import { useAuth } from './useAuth';
import { Permission, Role, UserRole, ROLE_PERMISSIONS } from '../types/permissions';

interface PermissionCheck {
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

interface RoleCheck {
  hasRole: boolean;
  isLoading: boolean;
  error: string | null;
}

interface UsePermissionsReturn {
  permissions: Permission[];
  checkPermission: (permission: Permission) => PermissionCheck;
  checkRole: (role: Role) => RoleCheck;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasAllRoles: (roles: Role[]) => boolean;
  canManageUsers: boolean;
  isLoading: boolean;
  error: string | null;
}

export const usePermissions = (): UsePermissionsReturn => {
  const { user, isLoading: authLoading } = useAuth();

  // Get user permissions based on role
  const userPermissions = user?.role ? ROLE_PERMISSIONS[user.role as UserRole] || [] : [];

  const checkPermission = useCallback((permission: Permission): PermissionCheck => {
    if (!user) {
      return {
        hasPermission: false,
        isLoading: authLoading,
        error: 'User not authenticated'
      };
    }

    const hasPermission = userPermissions.includes(permission);

    return {
      hasPermission,
      isLoading: authLoading,
      error: null
    };
  }, [user, authLoading, userPermissions]);

  const hasPermission = useCallback((permission: Permission): boolean => {
    return userPermissions.includes(permission);
  }, [userPermissions]);

  const checkRole = useCallback((role: Role): RoleCheck => {
    if (!user) {
      return {
        hasRole: false,
        isLoading: authLoading,
        error: 'User not authenticated'
      };
    }

    const hasRole = user.role === role;

    return {
      hasRole,
      isLoading: authLoading,
      error: null
    };
  }, [user, authLoading]);

  const hasAnyPermission = useCallback((permissions: Permission[]): boolean => {
    return permissions.some(permission => userPermissions.includes(permission));
  }, [userPermissions]);

  const hasAllPermissions = useCallback((permissions: Permission[]): boolean => {
    return permissions.every(permission => userPermissions.includes(permission));
  }, [userPermissions]);

  const hasAnyRole = useCallback((roles: Role[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role as Role);
  }, [user]);

  const hasAllRoles = useCallback((roles: Role[]): boolean => {
    if (!user?.role) return false;
    return roles.every(role => user.role === role);
  }, [user]);

  const canManageUsers = userPermissions.includes('users:manage_roles');

  return {
    permissions: userPermissions,
    checkPermission,
    checkRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAnyRole,
    hasAllRoles,
    canManageUsers,
    isLoading: authLoading,
    error: null
  };
};
