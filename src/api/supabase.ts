import { supabase } from '../lib/supabase';
import type { ApiResponse, QueryParams } from './types';
import type { PostgrestError } from '@supabase/supabase-js';

interface SupabaseResponse<T> {
  data: T | null;
  error: PostgrestError | null;
  count?: number | null;
  status: number;
  statusText: string;
}

// Base API class for Supabase operations
export class SupabaseApi {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  // Generic query builder
  protected buildQuery(params?: QueryParams) {
    let query = supabase.from(this.tableName).select('*');

    if (params?.search && params.search.trim()) {
      // This would need to be customized per table
      query = query.ilike('name', `%${params.search}%`);
    }

    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    if (params?.sortBy) {
      query = query.order(params.sortBy, { 
        ascending: params.sortOrder === 'asc' 
      });
    }

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    if (params?.offset) {
      query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
    }

    return query;
  }

  // Convert Supabase response to API response
  protected handleResponse<T>(response: SupabaseResponse<T>): ApiResponse<T> {
    if (response.error) {
      return {
        data: null as T,
        error: response.error.message,
        success: false
      };
    }

    return {
      data: response.data as T,
      success: true
    };
  }

  // Generic CRUD operations
  async getAll<T>(params?: QueryParams): Promise<ApiResponse<T[]>> {
    try {
      const query = this.buildQuery(params);
      const response = await query;
      return this.handleResponse<T[]>(response);
    } catch (error) {
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  async getById<T>(id: string | number): Promise<ApiResponse<T>> {
    try {
      const response = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();
      
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  async create<T, CreateT = Partial<T>>(data: CreateT): Promise<ApiResponse<T>> {
    try {
      const response = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();
      
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  async update<T, UpdateT = Partial<T>>(id: string | number, data: UpdateT): Promise<ApiResponse<T>> {
    try {
      const response = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      return this.handleResponse<T>(response);
    } catch (error) {
      return {
        data: null as T,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  async delete(id: string | number): Promise<ApiResponse<boolean>> {
    try {
      const response = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (response.error) {
        return {
          data: false,
          error: response.error.message,
          success: false
        };
      }

      return {
        data: true,
        success: true
      };
    } catch (error) {
      return {
        data: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Count records
  async count(params?: QueryParams): Promise<ApiResponse<number>> {
    try {
      let query = supabase.from(this.tableName).select('*', { count: 'exact', head: true });
      
      if (params?.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
          }
        });
      }

      const response = await query;
      
      if (response.error) {
        return {
          data: 0,
          error: response.error.message,
          success: false
        };
      }

      return {
        data: response.count || 0,
        success: true
      };
    } catch (error) {
      return {
        data: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }
}

// Error handling utilities
export const handleApiError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error?.message) {
    return error.error.message;
  }
  
  return 'Bilinmeyen bir hata oluştu';
};

export const isApiError = (response: ApiResponse<any>): boolean => {
  return !response.success || !!response.error;
};