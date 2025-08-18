import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

// Permission checking middleware
export const requirePermission = (resource: string, action: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      // Check if user has the required permission
      const { data, error } = await supabase.rpc('user_has_permission', {
        p_user_id: req.user.id,
        p_resource: resource,
        p_action: action
      });

      if (error) {
        console.error('Permission check error:', error);
        return res.status(500).json({ error: 'Permission check failed' });
      }

      if (!data) {
        return res.status(403).json({ 
          error: `Insufficient permissions. Required: ${resource}.${action}` 
        });
      }

      next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      res.status(500).json({ error: 'Permission validation failed' });
    }
  };
};

// Get user permissions
export const getUserPermissions = async (userId: string): Promise<string[]> => {
  try {
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!userProfile) {
      return [];
    }

    const { data: permissions } = await supabase
      .from('role_permissions')
      .select(`
        permissions (
          name,
          resource,
          action
        )
      `)
      .eq('role', userProfile.role);

    return permissions?.map(p => p.permissions.name) || [];
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
};

// Check specific permission
export const hasPermission = async (
  userId: string, 
  resource: string, 
  action: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('user_has_permission', {
      p_user_id: userId,
      p_resource: resource,
      p_action: action
    });

    if (error) {
      console.error('Permission check error:', error);
      return false;
    }

    return data || false;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};

// Multiple permissions check (user must have ALL permissions)
export const requireAllPermissions = (...permissions: Array<[string, string]>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const permissionChecks = permissions.map(([resource, action]) =>
        hasPermission(req.user!.id, resource, action)
      );

      const results = await Promise.all(permissionChecks);
      const hasAllPermissions = results.every(result => result === true);

      if (!hasAllPermissions) {
        const missingPermissions = permissions
          .filter((_, index) => !results[index])
          .map(([resource, action]) => `${resource}.${action}`)
          .join(', ');

        return res.status(403).json({ 
          error: `Insufficient permissions. Missing: ${missingPermissions}` 
        });
      }

      next();
    } catch (error) {
      console.error('Multiple permissions check error:', error);
      res.status(500).json({ error: 'Permission validation failed' });
    }
  };
};

// Any permission check (user must have AT LEAST ONE permission)
export const requireAnyPermission = (...permissions: Array<[string, string]>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const permissionChecks = permissions.map(([resource, action]) =>
        hasPermission(req.user!.id, resource, action)
      );

      const results = await Promise.all(permissionChecks);
      const hasAnyPermission = results.some(result => result === true);

      if (!hasAnyPermission) {
        const requiredPermissions = permissions
          .map(([resource, action]) => `${resource}.${action}`)
          .join(' OR ');

        return res.status(403).json({ 
          error: `Insufficient permissions. Required: ${requiredPermissions}` 
        });
      }

      next();
    } catch (error) {
      console.error('Any permissions check error:', error);
      res.status(500).json({ error: 'Permission validation failed' });
    }
  };
};

// Resource ownership check
export const requireResourceOwnership = (
  resourceTable: string,
  ownershipField: string = 'created_by'
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return res.status(400).json({ error: 'Resource ID required' });
      }

      // Check if user owns the resource
      const { data, error } = await supabase
        .from(resourceTable)
        .select(ownershipField)
        .eq('id', resourceId)
        .single();

      if (error) {
        console.error('Ownership check error:', error);
        return res.status(500).json({ error: 'Ownership check failed' });
      }

      if (!data || data[ownershipField] !== req.user.id) {
        // Check if user has admin privileges to bypass ownership
        const isAdmin = await hasPermission(req.user.id, 'system', 'admin');
        if (!isAdmin) {
          return res.status(403).json({ 
            error: 'Access denied. You can only access your own resources.' 
          });
        }
      }

      next();
    } catch (error) {
      console.error('Resource ownership check error:', error);
      res.status(500).json({ error: 'Ownership validation failed' });
    }
  };
};

export default {
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  requireResourceOwnership,
  getUserPermissions,
  hasPermission
};
