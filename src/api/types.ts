// Common API types and interfaces

export interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: string | number | boolean | Date | null | undefined | string[] | number[];
}

export interface QueryParams extends PaginationParams, SortParams {
  filters?: FilterParams;
  search?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown> | string | null;
}

export interface DatabaseError extends ApiError {
  hint?: string;
  details?: string;
}

// Supabase specific types
export interface SupabaseResponse<T> {
  data: T | null;
  error: DatabaseError | null;
  count?: number;
}

// Generic CRUD operations
export interface CrudOperations<T, CreateT = Partial<T>, UpdateT = Partial<T>> {
  getAll: (params?: QueryParams) => Promise<ApiResponse<T[]>>;
  getById: (id: string | number) => Promise<ApiResponse<T>>;
  create: (data: CreateT) => Promise<ApiResponse<T>>;
  update: (id: string | number, data: UpdateT) => Promise<ApiResponse<T>>;
  delete: (id: string | number) => Promise<ApiResponse<boolean>>;
}