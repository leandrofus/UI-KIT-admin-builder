/**
 * @fileoverview Service Adapter - Normalizes API service implementations
 * 
 * Provides a standard interface for data services, allowing the UI components
 * to work with any backend/API without modification.
 * 
 * @module adapters/ServiceAdapter
 */

import type { 
  DataRecord, 
  PaginatedResponse, 
  PaginationParams,
  AdvancedFilter 
} from '../core/types';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Standard service response
 */
export interface ServiceResponse<T> {
  /** Response data */
  data: T;
  /** Whether request was successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** HTTP status code */
  status?: number;
}

/**
 * Options for list requests
 * All pagination properties are optional with sensible defaults
 */
export interface ListOptions extends Partial<PaginationParams> {
  /** Search term */
  search?: string;
  /** Advanced filters */
  filters?: AdvancedFilter[];
  /** Additional query params */
  params?: Record<string, unknown>;
}

/**
 * Standard service interface
 */
export interface IServiceAdapter<T extends DataRecord = DataRecord> {
  /** List items with pagination */
  list(options?: ListOptions): Promise<PaginatedResponse<T>>;
  /** Get a single item by ID */
  get(id: string | number): Promise<ServiceResponse<T>>;
  /** Create a new item */
  create(data: Partial<T>): Promise<ServiceResponse<T>>;
  /** Update an existing item */
  update(id: string | number, data: Partial<T>): Promise<ServiceResponse<T>>;
  /** Delete an item */
  delete(id: string | number): Promise<ServiceResponse<void>>;
  /** Custom query (for complex operations) */
  query?<R = unknown>(endpoint: string, params?: Record<string, unknown>): Promise<ServiceResponse<R>>;
}

/**
 * Configuration for creating a service adapter
 */
export interface ServiceAdapterConfig<T extends DataRecord = DataRecord> {
  /** Base URL for API requests */
  baseUrl?: string;
  /** Entity name (used in URL construction) */
  entityName: string;
  /** Custom headers */
  headers?: Record<string, string> | (() => Record<string, string>);
  /** Request interceptor */
  onRequest?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
  /** Response interceptor */
  onResponse?: <R>(response: R, config: RequestConfig) => R;
  /** Error handler */
  onError?: (error: Error, config: RequestConfig) => void;
  /** Transform response data */
  transformResponse?: (data: unknown) => T[];
  /** Transform single item response */
  transformItem?: (data: unknown) => T;
  /** Transform pagination response */
  transformPagination?: (data: unknown) => PaginatedResponse<T>;
  /** Custom fetch implementation */
  fetch?: typeof fetch;
}

/**
 * Request configuration
 */
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  params?: Record<string, unknown>;
}

// =============================================================================
// DEFAULT TRANSFORMERS
// =============================================================================

/**
 * Default pagination transformer
 * Handles common API response formats
 */
function defaultTransformPagination<T>(data: unknown): PaginatedResponse<T> {
  if (!data || typeof data !== 'object') {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  }

  const response = data as Record<string, unknown>;

  // Handle common response formats
  // Format 1: { data: [], total, page, pageSize }
  if (Array.isArray(response.data)) {
    return {
      data: response.data as T[],
      total: (response.total as number) || response.data.length,
      page: (response.page as number) || 1,
      pageSize: (response.pageSize as number) || (response.limit as number) || 10,
      totalPages: (response.totalPages as number) || 
        Math.ceil(((response.total as number) || response.data.length) / 
          ((response.pageSize as number) || (response.limit as number) || 10)),
    };
  }

  // Format 2: { items: [], pagination: { total, page, ... } }
  if (Array.isArray(response.items)) {
    const pagination = (response.pagination as Record<string, number>) || {};
    return {
      data: response.items as T[],
      total: pagination.total || response.items.length,
      page: pagination.page || 1,
      pageSize: pagination.pageSize || pagination.limit || 10,
      totalPages: pagination.totalPages || 
        Math.ceil((pagination.total || response.items.length) / (pagination.pageSize || 10)),
    };
  }

  // Format 3: { rows: [], count }
  if (Array.isArray(response.rows)) {
    return {
      data: response.rows as T[],
      total: (response.count as number) || response.rows.length,
      page: 1,
      pageSize: response.rows.length,
      totalPages: 1,
    };
  }

  // Format 4: Direct array
  if (Array.isArray(response)) {
    return {
      data: response as T[],
      total: response.length,
      page: 1,
      pageSize: response.length,
      totalPages: 1,
    };
  }

  return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
}

// =============================================================================
// SERVICE ADAPTER FACTORY
// =============================================================================

/**
 * Create a service adapter with the given configuration
 * 
 * @example
 * const productsService = createServiceAdapter({
 *   baseUrl: '/api',
 *   entityName: 'products',
 *   headers: () => ({
 *     'Authorization': `Bearer ${getToken()}`,
 *   }),
 * });
 * 
 * // Use the service
 * const { data, total } = await productsService.list({
 *   page: 1,
 *   pageSize: 20,
 *   search: 'widget',
 * });
 */
export function createServiceAdapter<T extends DataRecord = DataRecord>(
  config: ServiceAdapterConfig<T>
): IServiceAdapter<T> {
  const {
    baseUrl = '',
    entityName,
    headers: configHeaders,
    onRequest,
    onResponse,
    onError,
    transformResponse,
    transformItem,
    transformPagination = defaultTransformPagination,
    fetch: customFetch = fetch,
  } = config;

  // Build URL with query params
  const buildUrl = (path: string, params?: Record<string, unknown>): string => {
    const url = new URL(path, baseUrl || window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    
    return url.toString();
  };

  // Get headers
  const getHeaders = (): Record<string, string> => {
    const base = { 'Content-Type': 'application/json' };
    const custom = typeof configHeaders === 'function' ? configHeaders() : configHeaders;
    return { ...base, ...custom };
  };

  // Execute request
  const executeRequest = async <R>(requestConfig: RequestConfig): Promise<ServiceResponse<R>> => {
    let finalConfig = requestConfig;

    // Apply request interceptor
    if (onRequest) {
      finalConfig = await onRequest(requestConfig);
    }

    const { url, method, body, params } = finalConfig;
    const fullUrl = buildUrl(url, params);

    try {
      const response = await customFetch(fullUrl, {
        method,
        headers: { ...getHeaders(), ...finalConfig.headers },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      let result = data as R;

      // Apply response interceptor
      if (onResponse) {
        result = onResponse(result, finalConfig);
      }

      return {
        data: result,
        success: true,
        status: response.status,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      if (onError) {
        onError(err, finalConfig);
      }

      return {
        data: undefined as unknown as R,
        success: false,
        error: err.message,
      };
    }
  };

  // ==========================================================================
  // SERVICE METHODS
  // ==========================================================================

  const list = async (options: ListOptions = {}): Promise<PaginatedResponse<T>> => {
    const { page = 1, pageSize = 10, sortColumn, sortDirection, search, filters, params } = options;

    const queryParams: Record<string, unknown> = {
      page,
      limit: pageSize,
      ...params,
    };

    if (sortColumn) {
      queryParams.sortBy = sortColumn;
      queryParams.sortOrder = sortDirection?.toUpperCase() || 'ASC';
    }

    if (search) {
      queryParams.search = search;
    }

    if (filters && filters.length > 0) {
      queryParams.filters = JSON.stringify(filters);
    }

    const response = await executeRequest<unknown>({
      url: `${baseUrl}/${entityName}`,
      method: 'GET',
      params: queryParams,
    });

    if (!response.success) {
      return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
    }

    if (transformResponse) {
      const data = transformResponse(response.data);
      return {
        data,
        total: data.length,
        page,
        pageSize,
        totalPages: Math.ceil(data.length / pageSize),
      };
    }

    return transformPagination(response.data);
  };

  const get = async (id: string | number): Promise<ServiceResponse<T>> => {
    const response = await executeRequest<unknown>({
      url: `${baseUrl}/${entityName}/${id}`,
      method: 'GET',
    });

    if (!response.success) {
      return response as ServiceResponse<T>;
    }

    const data = transformItem 
      ? transformItem(response.data)
      : response.data as T;

    return { ...response, data };
  };

  const create = async (data: Partial<T>): Promise<ServiceResponse<T>> => {
    const response = await executeRequest<unknown>({
      url: `${baseUrl}/${entityName}`,
      method: 'POST',
      body: data,
    });

    if (!response.success) {
      return response as ServiceResponse<T>;
    }

    const item = transformItem 
      ? transformItem(response.data)
      : response.data as T;

    return { ...response, data: item };
  };

  const update = async (id: string | number, data: Partial<T>): Promise<ServiceResponse<T>> => {
    const response = await executeRequest<unknown>({
      url: `${baseUrl}/${entityName}/${id}`,
      method: 'PUT',
      body: data,
    });

    if (!response.success) {
      return response as ServiceResponse<T>;
    }

    const item = transformItem 
      ? transformItem(response.data)
      : response.data as T;

    return { ...response, data: item };
  };

  const deleteItem = async (id: string | number): Promise<ServiceResponse<void>> => {
    return executeRequest<void>({
      url: `${baseUrl}/${entityName}/${id}`,
      method: 'DELETE',
    });
  };

  const query = async <R = unknown>(
    endpoint: string, 
    params?: Record<string, unknown>
  ): Promise<ServiceResponse<R>> => {
    return executeRequest<R>({
      url: `${baseUrl}/${entityName}/${endpoint}`,
      method: 'POST',
      body: params,
    });
  };

  return {
    list,
    get,
    create,
    update,
    delete: deleteItem,
    query,
  };
}

// =============================================================================
// AXIOS ADAPTER FACTORY
// =============================================================================

/**
 * Configuration for Axios-based adapter
 */
export interface AxiosAdapterConfig<T extends DataRecord = DataRecord> {
  /** Axios instance */
  axios: {
    get: <R = unknown>(url: string, config?: { params?: Record<string, unknown> }) => Promise<{ data: R }>;
    post: <R = unknown>(url: string, data?: unknown) => Promise<{ data: R }>;
    put: <R = unknown>(url: string, data?: unknown) => Promise<{ data: R }>;
    delete: <R = unknown>(url: string) => Promise<{ data: R }>;
  };
  /** Entity endpoint */
  endpoint: string;
  /** Transform pagination response */
  transformPagination?: (data: unknown) => PaginatedResponse<T>;
  /** Transform single item */
  transformItem?: (data: unknown) => T;
}

/**
 * Create a service adapter using an Axios instance
 * 
 * @example
 * import axios from 'axios';
 * 
 * const api = axios.create({ baseURL: '/api' });
 * 
 * const productsService = createAxiosAdapter({
 *   axios: api,
 *   endpoint: '/products',
 * });
 */
export function createAxiosAdapter<T extends DataRecord = DataRecord>(
  config: AxiosAdapterConfig<T>
): IServiceAdapter<T> {
  const { 
    axios, 
    endpoint,
    transformPagination = defaultTransformPagination,
    transformItem,
  } = config;

  return {
    async list(options: ListOptions = {}): Promise<PaginatedResponse<T>> {
      const { page = 1, pageSize = 10, sortColumn, sortDirection, search, filters } = options;

      const params: Record<string, unknown> = {
        page,
        limit: pageSize,
      };

      if (sortColumn) {
        params.sortBy = sortColumn;
        params.sortOrder = sortDirection?.toUpperCase() || 'ASC';
      }

      if (search) {
        params.search = search;
      }

      if (filters && filters.length > 0) {
        params.filters = JSON.stringify(filters);
      }

      try {
        const response = await axios.get(endpoint, { params });
        return transformPagination(response.data);
      } catch (error) {
        console.error('List error:', error);
        return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
      }
    },

    async get(id: string | number): Promise<ServiceResponse<T>> {
      try {
        const response = await axios.get(`${endpoint}/${id}`);
        const data = transformItem ? transformItem(response.data) : response.data as T;
        return { data, success: true };
      } catch (error) {
        return { 
          data: undefined as unknown as T, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },

    async create(data: Partial<T>): Promise<ServiceResponse<T>> {
      try {
        const response = await axios.post(endpoint, data);
        const item = transformItem ? transformItem(response.data) : response.data as T;
        return { data: item, success: true };
      } catch (error) {
        return { 
          data: undefined as unknown as T, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },

    async update(id: string | number, data: Partial<T>): Promise<ServiceResponse<T>> {
      try {
        const response = await axios.put(`${endpoint}/${id}`, data);
        const item = transformItem ? transformItem(response.data) : response.data as T;
        return { data: item, success: true };
      } catch (error) {
        return { 
          data: undefined as unknown as T, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },

    async delete(id: string | number): Promise<ServiceResponse<void>> {
      try {
        await axios.delete(`${endpoint}/${id}`);
        return { data: undefined, success: true };
      } catch (error) {
        return { 
          data: undefined, 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    },
  };
}

export default createServiceAdapter;
