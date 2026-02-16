// src/core/validators.ts
function isEmpty(value) {
  if (value === null || value === void 0) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}
function isNotEmpty(value) {
  return !isEmpty(value);
}
function validateRequired(value, message) {
  const valid = isNotEmpty(value);
  return {
    valid,
    message: valid ? void 0 : message || "Este campo es requerido"
  };
}
function validateMin(value, min, message) {
  if (isEmpty(value)) return { valid: true };
  const numValue = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(numValue)) return { valid: true };
  const valid = numValue >= min;
  return {
    valid,
    message: valid ? void 0 : message || `El valor debe ser mayor o igual a ${min}`
  };
}
function validateMax(value, max, message) {
  if (isEmpty(value)) return { valid: true };
  const numValue = typeof value === "number" ? value : parseFloat(String(value));
  if (isNaN(numValue)) return { valid: true };
  const valid = numValue <= max;
  return {
    valid,
    message: valid ? void 0 : message || `El valor debe ser menor o igual a ${max}`
  };
}
function validateMinLength(value, minLength, message) {
  if (isEmpty(value)) return { valid: true };
  const length = typeof value === "string" ? value.length : Array.isArray(value) ? value.length : 0;
  const valid = length >= minLength;
  return {
    valid,
    message: valid ? void 0 : message || `Debe tener al menos ${minLength} caracteres`
  };
}
function validateMaxLength(value, maxLength, message) {
  if (isEmpty(value)) return { valid: true };
  const length = typeof value === "string" ? value.length : Array.isArray(value) ? value.length : 0;
  const valid = length <= maxLength;
  return {
    valid,
    message: valid ? void 0 : message || `No debe exceder ${maxLength} caracteres`
  };
}
function validatePattern(value, pattern, message) {
  if (isEmpty(value)) return { valid: true };
  const regex = typeof pattern === "string" ? new RegExp(pattern) : pattern;
  const valid = regex.test(String(value));
  return {
    valid,
    message: valid ? void 0 : message || "El formato no es v\xE1lido"
  };
}
function validateEmail(value, message) {
  if (isEmpty(value)) return { valid: true };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const valid = emailRegex.test(String(value));
  return {
    valid,
    message: valid ? void 0 : message || "El email no es v\xE1lido"
  };
}
function validateUrl(value, message) {
  if (isEmpty(value)) return { valid: true };
  try {
    new URL(String(value), window.location.origin);
    return { valid: true };
  } catch {
    return {
      valid: false,
      message: message || "La URL no es v\xE1lida"
    };
  }
}
function validatePhone(value, message) {
  if (isEmpty(value)) return { valid: true };
  const phoneRegex = /^\+?[\d\s\-()]{6,20}$/;
  const valid = phoneRegex.test(String(value));
  return {
    valid,
    message: valid ? void 0 : message || "El tel\xE9fono no es v\xE1lido"
  };
}
function applyValidationRule(value, rule, formData) {
  switch (rule.type) {
    case "required":
      return validateRequired(value, rule.message);
    case "min":
      return validateMin(value, rule.value, rule.message);
    case "max":
      return validateMax(value, rule.value, rule.message);
    case "minLength":
      return validateMinLength(value, rule.value, rule.message);
    case "maxLength":
      return validateMaxLength(value, rule.value, rule.message);
    case "pattern":
      return validatePattern(value, rule.value, rule.message);
    case "email":
      return validateEmail(value, rule.message);
    case "url":
      return validateUrl(value, rule.message);
    case "custom":
      if (rule.validate) {
        const result = rule.validate(value, formData);
        if (typeof result === "boolean") {
          return { valid: result, message: result ? void 0 : rule.message };
        }
        return { valid: false, message: result };
      }
      return { valid: true };
    default:
      return { valid: true };
  }
}
function validateField(value, field, formData) {
  if (field.required) {
    const requiredResult = validateRequired(value);
    if (!requiredResult.valid) {
      return requiredResult;
    }
  }
  if (isEmpty(value)) {
    return { valid: true };
  }
  if (field.validation) {
    for (const rule of field.validation) {
      const result = applyValidationRule(value, rule, formData);
      if (!result.valid) {
        return result;
      }
    }
  }
  return { valid: true };
}
function validateForm(formData, fields) {
  const errors = {};
  let valid = true;
  for (const field of fields) {
    if (field.type === "hidden" || field.disabled) {
      continue;
    }
    if (field.showWhen && !evaluateConditions(field.showWhen, formData)) {
      continue;
    }
    const value = formData[field.name];
    const result = validateField(value, field, formData);
    if (!result.valid && result.message) {
      errors[field.name] = result.message;
      valid = false;
    }
  }
  return { valid, errors };
}
function evaluateCondition(condition, formData, featureFlags = {}) {
  const operator = condition.op || condition.operator;
  if (condition.feature) {
    const isEnabled = !!featureFlags[condition.feature];
    if (operator === "on") return isEnabled;
    if (operator === "off") return !isEnabled;
    if (operator === "equals" || operator === "=") return isEnabled === !!condition.value;
    return isEnabled;
  }
  if (!condition.field) return true;
  const fieldValue = formData[condition.field];
  const compareValue = condition.value;
  switch (operator) {
    case "equals":
    case "=":
      return String(fieldValue) === String(compareValue);
    case "notEquals":
    case "!=":
      return String(fieldValue) !== String(compareValue);
    case "contains":
      if (typeof fieldValue === "string" && typeof compareValue === "string") {
        return fieldValue.toLowerCase().includes(compareValue.toLowerCase());
      }
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(compareValue);
      }
      return false;
    case "gt":
    case ">":
      return Number(fieldValue) > Number(compareValue);
    case "lt":
    case "<":
      return Number(fieldValue) < Number(compareValue);
    case "gte":
    case ">=":
      return Number(fieldValue) >= Number(compareValue);
    case "lte":
    case "<=":
      return Number(fieldValue) <= Number(compareValue);
    case "in":
      if (Array.isArray(compareValue)) {
        return compareValue.map(String).includes(String(fieldValue));
      }
      return false;
    case "notIn":
      if (Array.isArray(compareValue)) {
        return !compareValue.map(String).includes(String(fieldValue));
      }
      return true;
    case "isEmpty":
    case "empty":
      return isEmpty(fieldValue);
    case "isNotEmpty":
    case "notEmpty":
      return isNotEmpty(fieldValue);
    default:
      return true;
  }
}
function evaluateConditions(conditions, formData, featureFlags = {}) {
  const conditionArray = Array.isArray(conditions) ? conditions : [conditions];
  return conditionArray.every((c) => evaluateCondition(c, formData, featureFlags));
}
function validateFieldConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object") {
    errors.push("Field config must be an object");
    return { valid: false, errors };
  }
  const field = config;
  if (!field.name || typeof field.name !== "string") {
    errors.push('Field must have a "name" property (string)');
  }
  if (!field.type || typeof field.type !== "string") {
    errors.push('Field must have a "type" property (string)');
  }
  if (!field.label || typeof field.label !== "string") {
    errors.push('Field must have a "label" property (string)');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
function validateColumnConfig(config) {
  const errors = [];
  if (!config || typeof config !== "object") {
    errors.push("Column config must be an object");
    return { valid: false, errors };
  }
  const column = config;
  if (!column.key || typeof column.key !== "string") {
    errors.push('Column must have a "key" property (string)');
  }
  if (!column.accessor) {
    errors.push('Column must have an "accessor" property');
  }
  if (!column.header || typeof column.header !== "string") {
    errors.push('Column must have a "header" property (string)');
  }
  if (!column.type || typeof column.type !== "string") {
    errors.push('Column must have a "type" property (string)');
  }
  return {
    valid: errors.length === 0,
    errors
  };
}

// src/core/utils.ts
function getNestedValue(obj, path, defaultValue) {
  if (!obj || !path) {
    return defaultValue;
  }
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current === null || current === void 0) {
      return defaultValue;
    }
    if (typeof current === "object") {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  return current ?? defaultValue;
}
function setNestedValue(obj, path, value) {
  const keys = path.split(".");
  const result = { ...obj };
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = current[key] ? { ...current[key] } : {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}
function hasNestedValue(obj, path) {
  const value = getNestedValue(obj, path);
  return value !== void 0 && value !== null;
}
var DEFAULT_LOCALE = {
  locale: "es-AR",
  currency: "ARS",
  timezone: "America/Argentina/Buenos_Aires"
};
function formatValue(value, type, options) {
  if (value === null || value === void 0) {
    return "";
  }
  const { locale, currency, decimals } = { ...DEFAULT_LOCALE, ...options };
  switch (type) {
    case "text":
      return String(value);
    case "number":
      if (typeof value === "number" || !isNaN(Number(value))) {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimals ?? 0,
          maximumFractionDigits: decimals ?? 2
        }).format(Number(value));
      }
      return String(value);
    case "currency":
      if (typeof value === "number" || !isNaN(Number(value))) {
        return new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: decimals ?? 2,
          maximumFractionDigits: decimals ?? 2
        }).format(Number(value));
      }
      return String(value);
    case "percent":
      if (typeof value === "number" || !isNaN(Number(value))) {
        return new Intl.NumberFormat(locale, {
          style: "percent",
          minimumFractionDigits: decimals ?? 0,
          maximumFractionDigits: decimals ?? 2
        }).format(Number(value) / 100);
      }
      return String(value);
    case "date":
      return formatDate(value, { locale, includeTime: false });
    case "datetime":
      return formatDate(value, { locale, includeTime: true });
    case "boolean":
      return value ? "S\xED" : "No";
    default:
      return String(value);
  }
}
function formatDate(value, options) {
  if (!value) return "";
  const { locale = "es-AR", includeTime = false } = options || {};
  let date;
  if (value instanceof Date) {
    date = value;
  } else if (typeof value === "string" || typeof value === "number") {
    date = new Date(value);
  } else {
    return String(value);
  }
  if (isNaN(date.getTime())) {
    return String(value);
  }
  const dateOptions = includeTime ? {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  } : {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };
  return new Intl.DateTimeFormat(locale, dateOptions).format(date);
}
function formatPhone(value) {
  if (!value) return "";
  const digits = String(value).replace(/\D/g, "");
  if (digits.startsWith("549") && digits.length >= 12) {
    const area = digits.slice(3, 5);
    const part1 = digits.slice(5, 9);
    const part2 = digits.slice(9);
    return `+54 9 ${area} ${part1}-${part2}`;
  }
  if (digits.length >= 10) {
    const area = digits.slice(0, 2);
    const part1 = digits.slice(2, 6);
    const part2 = digits.slice(6);
    return `${area} ${part1}-${part2}`;
  }
  return String(value);
}
function compareValues(a, b, direction = "asc", type) {
  if (a === null || a === void 0) return direction === "asc" ? 1 : -1;
  if (b === null || b === void 0) return direction === "asc" ? -1 : 1;
  let comparison = 0;
  if (type === "number" || type === "currency" || type === "percent") {
    comparison = Number(a) - Number(b);
  } else if (type === "date" || type === "datetime") {
    comparison = new Date(a).getTime() - new Date(b).getTime();
  } else if (type === "boolean") {
    comparison = (a ? 1 : 0) - (b ? 1 : 0);
  } else {
    comparison = String(a).toLowerCase().localeCompare(String(b).toLowerCase());
  }
  return direction === "desc" ? -comparison : comparison;
}
function sortData(data, column, direction, type) {
  if (!direction) return data;
  return [...data].sort((a, b) => {
    const valueA = getNestedValue(a, column);
    const valueB = getNestedValue(b, column);
    return compareValues(valueA, valueB, direction, type);
  });
}
function matchesSearchTerm(value, term) {
  if (value === null || value === void 0) return false;
  const stringValue = String(value).toLowerCase();
  const searchTerm = term.toLowerCase().trim();
  return stringValue.includes(searchTerm);
}
function filterBySearchTerm(data, term, columns) {
  if (!term.trim()) return data;
  return data.filter(
    (row) => columns.some((column) => {
      const value = getNestedValue(row, column);
      return matchesSearchTerm(value, term);
    })
  );
}
function calculatePagination(total, page, pageSize) {
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  return {
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
    startIndex,
    endIndex,
    displayRange: total > 0 ? `${startIndex + 1}-${endIndex} de ${total}` : "0 resultados"
  };
}
function paginateData(data, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  return data.slice(startIndex, startIndex + pageSize);
}
function generateId(prefix = "duk") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
function getRowKey(row, rowKey = "id") {
  const value = getNestedValue(row, String(rowKey));
  return value !== void 0 ? value : generateId("row");
}
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = result[key];
      if (sourceValue !== null && typeof sourceValue === "object" && !Array.isArray(sourceValue) && targetValue !== null && typeof targetValue === "object" && !Array.isArray(targetValue)) {
        result[key] = deepMerge(
          targetValue,
          sourceValue
        );
      } else {
        result[key] = sourceValue;
      }
    }
  }
  return result;
}
function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
function omit(obj, keys) {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
function debounce(fn, delay) {
  let timeoutId = null;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
function cn(...classes) {
  return classes.filter((c) => typeof c === "string" && c.length > 0).join(" ");
}

export { applyValidationRule, calculatePagination, cn, compareValues, debounce, deepMerge, evaluateCondition, evaluateConditions, filterBySearchTerm, formatDate, formatPhone, formatValue, generateId, getNestedValue, getRowKey, hasNestedValue, isEmpty, isNotEmpty, matchesSearchTerm, omit, paginateData, pick, setNestedValue, sortData, throttle, validateColumnConfig, validateEmail, validateField, validateFieldConfig, validateForm, validateMax, validateMaxLength, validateMin, validateMinLength, validatePattern, validatePhone, validateRequired, validateUrl };
//# sourceMappingURL=chunk-ZYRLE26I.mjs.map
//# sourceMappingURL=chunk-ZYRLE26I.mjs.map