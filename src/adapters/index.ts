/**
 * @fileoverview Adapters module exports
 * 
 * @module adapters
 */

// Service Adapter
export { 
  createServiceAdapter, 
  createAxiosAdapter,
} from './ServiceAdapter';
export type {
  ServiceResponse,
  ListOptions,
  IServiceAdapter,
  ServiceAdapterConfig,
  RequestConfig,
  AxiosAdapterConfig,
} from './ServiceAdapter';

// Form Adapter
export { 
  createFormAdapter,
  commonTransformers,
} from './FormAdapter';
export type {
  FieldTransformer,
  FormAdapterConfig,
  IFormAdapter,
} from './FormAdapter';
