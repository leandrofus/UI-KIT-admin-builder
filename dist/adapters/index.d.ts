import { D as DataRecord, P as PaginatedResponse, n as PaginationParams, A as AdvancedFilter, h as FieldValue, e as FieldConfig } from '../types-L6joewgw.js';

/**
 * @fileoverview Service Adapter - Normalizes API service implementations
 *
 * Provides a standard interface for data services, allowing the UI components
 * to work with any backend/API without modification.
 *
 * @module adapters/ServiceAdapter
 */

/**
 * Standard service response
 */
interface ServiceResponse<T> {
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
interface ListOptions extends Partial<PaginationParams> {
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
interface IServiceAdapter<T extends DataRecord = DataRecord> {
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
interface ServiceAdapterConfig<T extends DataRecord = DataRecord> {
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
interface RequestConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: Record<string, string>;
    body?: unknown;
    params?: Record<string, unknown>;
}
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
declare function createServiceAdapter<T extends DataRecord = DataRecord>(config: ServiceAdapterConfig<T>): IServiceAdapter<T>;
/**
 * Configuration for Axios-based adapter
 */
interface AxiosAdapterConfig<T extends DataRecord = DataRecord> {
    /** Axios instance */
    axios: {
        get: <R = unknown>(url: string, config?: {
            params?: Record<string, unknown>;
        }) => Promise<{
            data: R;
        }>;
        post: <R = unknown>(url: string, data?: unknown) => Promise<{
            data: R;
        }>;
        put: <R = unknown>(url: string, data?: unknown) => Promise<{
            data: R;
        }>;
        delete: <R = unknown>(url: string) => Promise<{
            data: R;
        }>;
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
declare function createAxiosAdapter<T extends DataRecord = DataRecord>(config: AxiosAdapterConfig<T>): IServiceAdapter<T>;

/**
 * @fileoverview Form Adapter - Normalizes form data handling
 *
 * Provides transformation between form values and API data formats,
 * handling computed fields, file uploads, and data normalization.
 *
 * @module adapters/FormAdapter
 */

/**
 * Field transformer function
 */
type FieldTransformer = (value: FieldValue, formData: DataRecord) => FieldValue;
/**
 * Form adapter configuration
 */
interface FormAdapterConfig {
    /** Transform data from API format to form format */
    toForm?: (data: DataRecord) => DataRecord;
    /** Transform data from form format to API format */
    toApi?: (data: DataRecord) => DataRecord;
    /** Field-specific transformers (to form) */
    fieldTransformers?: Record<string, FieldTransformer>;
    /** Field-specific transformers (to API) */
    apiTransformers?: Record<string, FieldTransformer>;
    /** Fields to exclude when sending to API */
    excludeFields?: string[];
    /** Fields to include only (whitelist) */
    includeFields?: string[];
    /** Rename fields when sending to API */
    fieldMapping?: Record<string, string>;
    /** Compute fields before sending to API */
    computedFields?: Record<string, (data: DataRecord) => FieldValue>;
    /** Default values for missing fields */
    defaults?: DataRecord;
}
/**
 * Form adapter interface
 */
interface IFormAdapter {
    /** Transform API data to form values */
    toFormValues: (data: DataRecord) => DataRecord;
    /** Transform form values to API data */
    toApiData: (data: DataRecord) => DataRecord;
    /** Get initial values with defaults */
    getInitialValues: (data?: Partial<DataRecord>) => DataRecord;
    /** Apply computed fields */
    applyComputedFields: (data: DataRecord, fields: FieldConfig[]) => DataRecord;
    /** Get only visible field values */
    getVisibleValues: (data: DataRecord, fields: FieldConfig[]) => DataRecord;
}
/**
 * Create a form adapter with the given configuration
 *
 * @example
 * const productFormAdapter = createFormAdapter({
 *   toForm: (data) => ({
 *     ...data,
 *     price: data.price / 100, // Convert cents to dollars
 *   }),
 *   toApi: (data) => ({
 *     ...data,
 *     price: Math.round(data.price * 100), // Convert back to cents
 *   }),
 *   defaults: {
 *     active: true,
 *     stock: 0,
 *   },
 *   excludeFields: ['_id', 'createdAt', 'updatedAt'],
 * });
 */
declare function createFormAdapter(config?: FormAdapterConfig): IFormAdapter;
/**
 * Common field transformers for reuse
 */
declare const commonTransformers: {
    /** Convert cents to currency */
    centsToDecimal: (value: FieldValue) => FieldValue;
    /** Convert currency to cents */
    decimalToCents: (value: FieldValue) => FieldValue;
    /** Parse string to number */
    toNumber: (value: FieldValue) => FieldValue;
    /** Convert to string */
    toString: (value: FieldValue) => FieldValue;
    /** Parse ISO date string to Date */
    toDate: (value: FieldValue) => FieldValue;
    /** Convert Date to ISO string */
    toISOString: (value: FieldValue) => FieldValue;
    /** Parse JSON string */
    parseJSON: (value: FieldValue) => FieldValue;
    /** Stringify to JSON */
    toJSON: (value: FieldValue) => FieldValue;
    /** Trim whitespace */
    trim: (value: FieldValue) => FieldValue;
    /** Convert empty string to null */
    emptyToNull: (value: FieldValue) => FieldValue;
    /** Convert null/undefined to empty string */
    nullToEmpty: (value: FieldValue) => FieldValue;
    /** Convert boolean string to boolean */
    toBoolean: (value: FieldValue) => FieldValue;
};

export { type AxiosAdapterConfig, type FieldTransformer, type FormAdapterConfig, type IFormAdapter, type IServiceAdapter, type ListOptions, type RequestConfig, type ServiceAdapterConfig, type ServiceResponse, commonTransformers, createAxiosAdapter, createFormAdapter, createServiceAdapter };
