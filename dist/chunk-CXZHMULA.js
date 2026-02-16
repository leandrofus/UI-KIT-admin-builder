'use strict';

var chunkG4EIC5OB_js = require('./chunk-G4EIC5OB.js');

// src/adapters/ServiceAdapter.ts
function defaultTransformPagination(data) {
  if (!data || typeof data !== "object") {
    return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
  }
  const response = data;
  if (Array.isArray(response.data)) {
    return {
      data: response.data,
      total: response.total || response.data.length,
      page: response.page || 1,
      pageSize: response.pageSize || response.limit || 10,
      totalPages: response.totalPages || Math.ceil((response.total || response.data.length) / (response.pageSize || response.limit || 10))
    };
  }
  if (Array.isArray(response.items)) {
    const pagination = response.pagination || {};
    return {
      data: response.items,
      total: pagination.total || response.items.length,
      page: pagination.page || 1,
      pageSize: pagination.pageSize || pagination.limit || 10,
      totalPages: pagination.totalPages || Math.ceil((pagination.total || response.items.length) / (pagination.pageSize || 10))
    };
  }
  if (Array.isArray(response.rows)) {
    return {
      data: response.rows,
      total: response.count || response.rows.length,
      page: 1,
      pageSize: response.rows.length,
      totalPages: 1
    };
  }
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: 1,
      pageSize: response.length,
      totalPages: 1
    };
  }
  return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
}
function createServiceAdapter(config) {
  const {
    baseUrl = "",
    entityName,
    headers: configHeaders,
    onRequest,
    onResponse,
    onError,
    transformResponse,
    transformItem,
    transformPagination = defaultTransformPagination,
    fetch: customFetch = fetch
  } = config;
  const buildUrl = (path, params) => {
    const url = new URL(path, baseUrl || window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== void 0 && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((v) => url.searchParams.append(key, String(v)));
          } else {
            url.searchParams.append(key, String(value));
          }
        }
      });
    }
    return url.toString();
  };
  const getHeaders = () => {
    const base = { "Content-Type": "application/json" };
    const custom = typeof configHeaders === "function" ? configHeaders() : configHeaders;
    return { ...base, ...custom };
  };
  const executeRequest = async (requestConfig) => {
    let finalConfig = requestConfig;
    if (onRequest) {
      finalConfig = await onRequest(requestConfig);
    }
    const { url, method, body, params } = finalConfig;
    const fullUrl = buildUrl(url, params);
    try {
      const response = await customFetch(fullUrl, {
        method,
        headers: { ...getHeaders(), ...finalConfig.headers },
        body: body ? JSON.stringify(body) : void 0
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }
      let result = data;
      if (onResponse) {
        result = onResponse(result, finalConfig);
      }
      return {
        data: result,
        success: true,
        status: response.status
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      if (onError) {
        onError(err, finalConfig);
      }
      return {
        data: void 0,
        success: false,
        error: err.message
      };
    }
  };
  const list = async (options = {}) => {
    const { page = 1, pageSize = 10, sortColumn, sortDirection, search, filters, params } = options;
    const queryParams = {
      page,
      limit: pageSize,
      ...params
    };
    if (sortColumn) {
      queryParams.sortBy = sortColumn;
      queryParams.sortOrder = sortDirection?.toUpperCase() || "ASC";
    }
    if (search) {
      queryParams.search = search;
    }
    if (filters && filters.length > 0) {
      queryParams.filters = JSON.stringify(filters);
    }
    const response = await executeRequest({
      url: `${baseUrl}/${entityName}`,
      method: "GET",
      params: queryParams
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
        totalPages: Math.ceil(data.length / pageSize)
      };
    }
    return transformPagination(response.data);
  };
  const get = async (id) => {
    const response = await executeRequest({
      url: `${baseUrl}/${entityName}/${id}`,
      method: "GET"
    });
    if (!response.success) {
      return response;
    }
    const data = transformItem ? transformItem(response.data) : response.data;
    return { ...response, data };
  };
  const create = async (data) => {
    const response = await executeRequest({
      url: `${baseUrl}/${entityName}`,
      method: "POST",
      body: data
    });
    if (!response.success) {
      return response;
    }
    const item = transformItem ? transformItem(response.data) : response.data;
    return { ...response, data: item };
  };
  const update = async (id, data) => {
    const response = await executeRequest({
      url: `${baseUrl}/${entityName}/${id}`,
      method: "PUT",
      body: data
    });
    if (!response.success) {
      return response;
    }
    const item = transformItem ? transformItem(response.data) : response.data;
    return { ...response, data: item };
  };
  const deleteItem = async (id) => {
    return executeRequest({
      url: `${baseUrl}/${entityName}/${id}`,
      method: "DELETE"
    });
  };
  const query = async (endpoint, params) => {
    return executeRequest({
      url: `${baseUrl}/${entityName}/${endpoint}`,
      method: "POST",
      body: params
    });
  };
  return {
    list,
    get,
    create,
    update,
    delete: deleteItem,
    query
  };
}
function createAxiosAdapter(config) {
  const {
    axios,
    endpoint,
    transformPagination = defaultTransformPagination,
    transformItem
  } = config;
  return {
    async list(options = {}) {
      const { page = 1, pageSize = 10, sortColumn, sortDirection, search, filters } = options;
      const params = {
        page,
        limit: pageSize
      };
      if (sortColumn) {
        params.sortBy = sortColumn;
        params.sortOrder = sortDirection?.toUpperCase() || "ASC";
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
        console.error("List error:", error);
        return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
      }
    },
    async get(id) {
      try {
        const response = await axios.get(`${endpoint}/${id}`);
        const data = transformItem ? transformItem(response.data) : response.data;
        return { data, success: true };
      } catch (error) {
        return {
          data: void 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    },
    async create(data) {
      try {
        const response = await axios.post(endpoint, data);
        const item = transformItem ? transformItem(response.data) : response.data;
        return { data: item, success: true };
      } catch (error) {
        return {
          data: void 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    },
    async update(id, data) {
      try {
        const response = await axios.put(`${endpoint}/${id}`, data);
        const item = transformItem ? transformItem(response.data) : response.data;
        return { data: item, success: true };
      } catch (error) {
        return {
          data: void 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    },
    async delete(id) {
      try {
        await axios.delete(`${endpoint}/${id}`);
        return { data: void 0, success: true };
      } catch (error) {
        return {
          data: void 0,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error"
        };
      }
    }
  };
}

// src/adapters/FormAdapter.ts
function createFormAdapter(config = {}) {
  const {
    toForm: customToForm,
    toApi: customToApi,
    fieldTransformers = {},
    apiTransformers = {},
    excludeFields = [],
    includeFields,
    fieldMapping = {},
    computedFields = {},
    defaults = {}
  } = config;
  const toFormValues = (data) => {
    if (!data) return { ...defaults };
    let result = { ...data };
    if (customToForm) {
      result = customToForm(result);
    }
    for (const [fieldName, transformer] of Object.entries(fieldTransformers)) {
      const value = chunkG4EIC5OB_js.getNestedValue(result, fieldName);
      if (value !== void 0) {
        result = chunkG4EIC5OB_js.setNestedValue(result, fieldName, transformer(value, result));
      }
    }
    for (const [key, defaultValue] of Object.entries(defaults)) {
      if (result[key] === void 0 || result[key] === null) {
        result[key] = defaultValue;
      }
    }
    return result;
  };
  const toApiData = (data) => {
    if (!data) return {};
    let result = { ...data };
    for (const [fieldName, transformer] of Object.entries(apiTransformers)) {
      const value = chunkG4EIC5OB_js.getNestedValue(result, fieldName);
      if (value !== void 0) {
        result = chunkG4EIC5OB_js.setNestedValue(result, fieldName, transformer(value, result));
      }
    }
    for (const [fieldName, compute] of Object.entries(computedFields)) {
      result[fieldName] = compute(result);
    }
    if (includeFields && includeFields.length > 0) {
      const filtered = {};
      for (const field of includeFields) {
        if (field in result) {
          filtered[field] = result[field];
        }
      }
      result = filtered;
    } else if (excludeFields.length > 0) {
      for (const field of excludeFields) {
        delete result[field];
      }
    }
    for (const [fromKey, toKey] of Object.entries(fieldMapping)) {
      if (fromKey in result) {
        result[toKey] = result[fromKey];
        delete result[fromKey];
      }
    }
    if (customToApi) {
      result = customToApi(result);
    }
    return result;
  };
  const getInitialValues = (data) => {
    if (!data) return { ...defaults };
    return toFormValues({ ...defaults, ...data });
  };
  const applyComputedFields = (data, fields) => {
    const result = { ...data };
    for (const field of fields) {
      if (field.computed && field.computed.formula) {
        const { formula, deps } = field.computed;
        const hasAllDeps = deps.every((dep) => {
          const value = chunkG4EIC5OB_js.getNestedValue(result, dep);
          return value !== void 0 && value !== null && value !== "";
        });
        if (hasAllDeps) {
          try {
            const computedValue = evaluateFormula(formula, result, deps);
            result[field.name] = computedValue;
          } catch (e) {
            console.warn(`Failed to compute field ${field.name}:`, e);
          }
        }
      }
    }
    return result;
  };
  const getVisibleValues = (data, fields) => {
    const result = {};
    for (const field of fields) {
      if (field.type === "hidden") continue;
      if (field.showWhen && !chunkG4EIC5OB_js.evaluateConditions(field.showWhen, data)) {
        continue;
      }
      const value = chunkG4EIC5OB_js.getNestedValue(data, field.name);
      if (value !== void 0) {
        result[field.name] = value;
      }
    }
    return result;
  };
  return {
    toFormValues,
    toApiData,
    getInitialValues,
    applyComputedFields,
    getVisibleValues
  };
}
function evaluateFormula(formula, data, deps) {
  const context = {};
  for (const dep of deps) {
    const value = chunkG4EIC5OB_js.getNestedValue(data, dep);
    context[dep] = typeof value === "number" ? value : parseFloat(String(value)) || 0;
  }
  let expression = formula;
  for (const [key, value] of Object.entries(context)) {
    expression = expression.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    expression = expression.replace(new RegExp(`\\b${key}\\b`, "g"), String(value));
  }
  const safeExpression = expression.replace(/[^0-9+\-*/().Math\s]/g, "");
  try {
    const fn = new Function(`return ${safeExpression}`);
    const result = fn();
    return typeof result === "number" && !isNaN(result) ? result : 0;
  } catch {
    return 0;
  }
}
var commonTransformers = {
  /** Convert cents to currency */
  centsToDecimal: (value) => {
    if (typeof value === "number") return value / 100;
    return value;
  },
  /** Convert currency to cents */
  decimalToCents: (value) => {
    if (typeof value === "number") return Math.round(value * 100);
    return value;
  },
  /** Parse string to number */
  toNumber: (value) => {
    if (typeof value === "string") return parseFloat(value) || 0;
    return value;
  },
  /** Convert to string */
  toString: (value) => {
    if (value === null || value === void 0) return "";
    return String(value);
  },
  /** Parse ISO date string to Date */
  toDate: (value) => {
    if (typeof value === "string") return new Date(value);
    return value;
  },
  /** Convert Date to ISO string */
  toISOString: (value) => {
    if (value instanceof Date) return value.toISOString();
    return value;
  },
  /** Parse JSON string */
  parseJSON: (value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  },
  /** Stringify to JSON */
  toJSON: (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value;
  },
  /** Trim whitespace */
  trim: (value) => {
    if (typeof value === "string") return value.trim();
    return value;
  },
  /** Convert empty string to null */
  emptyToNull: (value) => {
    if (value === "" || typeof value === "string" && value.trim() === "") {
      return null;
    }
    return value;
  },
  /** Convert null/undefined to empty string */
  nullToEmpty: (value) => {
    if (value === null || value === void 0) return "";
    return value;
  },
  /** Convert boolean string to boolean */
  toBoolean: (value) => {
    if (typeof value === "string") {
      return value.toLowerCase() === "true" || value === "1";
    }
    return Boolean(value);
  }
};

exports.commonTransformers = commonTransformers;
exports.createAxiosAdapter = createAxiosAdapter;
exports.createFormAdapter = createFormAdapter;
exports.createServiceAdapter = createServiceAdapter;
//# sourceMappingURL=chunk-CXZHMULA.js.map
//# sourceMappingURL=chunk-CXZHMULA.js.map