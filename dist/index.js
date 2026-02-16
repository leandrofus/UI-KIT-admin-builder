'use strict';

var chunkMXJF2CTP_js = require('./chunk-MXJF2CTP.js');
var chunkHBWXWLG3_js = require('./chunk-HBWXWLG3.js');
var chunkA7QXEUVF_js = require('./chunk-A7QXEUVF.js');
var chunkSVD7KPU6_js = require('./chunk-SVD7KPU6.js');
var chunkG2IQSWID_js = require('./chunk-G2IQSWID.js');
var chunkBHNUSCJS_js = require('./chunk-BHNUSCJS.js');
var chunkGUG6HX7G_js = require('./chunk-GUG6HX7G.js');

// src/index.ts
var VERSION = "0.1.0";
var LIB_INFO = {
  name: "@dnstyle/dynamic-ui-kit",
  version: VERSION,
  description: "JSON-driven dynamic UI components for React",
  repository: "https://github.com/leandrofus/dnstyle-whatsappcrm"
};
/**
 * @fileoverview Dynamic UI Kit - Main Entry Point
 * 
 * A framework-agnostic, JSON-driven UI component library for building
 * dynamic tables, forms, and modals. Built with React but designed
 * for maximum flexibility and reusability.
 * 
 * @module @dnstyle/dynamic-ui-kit
 * @version 0.1.0
 * @license MIT
 * 
 * @example
 * // Basic import
 * import { usePaginatedData, useFormState } from '@dnstyle/dynamic-ui-kit';
 * 
 * // Import specific modules
 * import { validateConfig } from '@dnstyle/dynamic-ui-kit/config';
 * import { createServiceAdapter } from '@dnstyle/dynamic-ui-kit/adapters';
 * import { FieldRegistry } from '@dnstyle/dynamic-ui-kit/fields';
 */

Object.defineProperty(exports, "DynamicModal", {
  enumerable: true,
  get: function () { return chunkMXJF2CTP_js.DynamicModal; }
});
Object.defineProperty(exports, "FormRenderer", {
  enumerable: true,
  get: function () { return chunkMXJF2CTP_js.FormRenderer; }
});
Object.defineProperty(exports, "TableRenderer", {
  enumerable: true,
  get: function () { return chunkMXJF2CTP_js.TableRenderer; }
});
Object.defineProperty(exports, "TableToolbar", {
  enumerable: true,
  get: function () { return chunkMXJF2CTP_js.TableToolbar; }
});
Object.defineProperty(exports, "useColumnConfig", {
  enumerable: true,
  get: function () { return chunkHBWXWLG3_js.useColumnConfig; }
});
Object.defineProperty(exports, "useFormState", {
  enumerable: true,
  get: function () { return chunkHBWXWLG3_js.useFormState; }
});
Object.defineProperty(exports, "usePaginatedData", {
  enumerable: true,
  get: function () { return chunkHBWXWLG3_js.usePaginatedData; }
});
Object.defineProperty(exports, "useTableSelection", {
  enumerable: true,
  get: function () { return chunkHBWXWLG3_js.useTableSelection; }
});
Object.defineProperty(exports, "commonTransformers", {
  enumerable: true,
  get: function () { return chunkA7QXEUVF_js.commonTransformers; }
});
Object.defineProperty(exports, "createAxiosAdapter", {
  enumerable: true,
  get: function () { return chunkA7QXEUVF_js.createAxiosAdapter; }
});
Object.defineProperty(exports, "createFormAdapter", {
  enumerable: true,
  get: function () { return chunkA7QXEUVF_js.createFormAdapter; }
});
Object.defineProperty(exports, "createServiceAdapter", {
  enumerable: true,
  get: function () { return chunkA7QXEUVF_js.createServiceAdapter; }
});
Object.defineProperty(exports, "CheckboxField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.CheckboxField; }
});
Object.defineProperty(exports, "CurrencyField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.CurrencyField; }
});
Object.defineProperty(exports, "FieldRegistry", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.FieldRegistry; }
});
Object.defineProperty(exports, "FieldRegistryContext", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.FieldRegistryContext; }
});
Object.defineProperty(exports, "HiddenField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.HiddenField; }
});
Object.defineProperty(exports, "NumberField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.NumberField; }
});
Object.defineProperty(exports, "SelectField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.SelectField; }
});
Object.defineProperty(exports, "SwitchField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.SwitchField; }
});
Object.defineProperty(exports, "TextField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.TextField; }
});
Object.defineProperty(exports, "TextareaField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.TextareaField; }
});
Object.defineProperty(exports, "baseFields", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.baseFields; }
});
Object.defineProperty(exports, "createFieldFactory", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.createFieldFactory; }
});
Object.defineProperty(exports, "getDefaultRegistry", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.getDefaultRegistry; }
});
Object.defineProperty(exports, "getField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.getField; }
});
Object.defineProperty(exports, "registerField", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.registerField; }
});
Object.defineProperty(exports, "registerFields", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.registerFields; }
});
Object.defineProperty(exports, "setDefaultRegistry", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.setDefaultRegistry; }
});
Object.defineProperty(exports, "useFieldFactory", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.useFieldFactory; }
});
Object.defineProperty(exports, "useFieldRegistry", {
  enumerable: true,
  get: function () { return chunkSVD7KPU6_js.useFieldRegistry; }
});
Object.defineProperty(exports, "ConfigLoader", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.ConfigLoader; }
});
Object.defineProperty(exports, "assertValidConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.assertValidConfig; }
});
Object.defineProperty(exports, "createConfigLoader", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.createConfigLoader; }
});
Object.defineProperty(exports, "formatValidationErrors", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.formatValidationErrors; }
});
Object.defineProperty(exports, "parseConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.parseConfig; }
});
Object.defineProperty(exports, "parseFormConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.parseFormConfig; }
});
Object.defineProperty(exports, "parseTableConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.parseTableConfig; }
});
Object.defineProperty(exports, "validateConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.validateConfig; }
});
Object.defineProperty(exports, "validateFormConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.validateFormConfig; }
});
Object.defineProperty(exports, "validateTableConfig", {
  enumerable: true,
  get: function () { return chunkG2IQSWID_js.validateTableConfig; }
});
Object.defineProperty(exports, "calculatePagination", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.calculatePagination; }
});
Object.defineProperty(exports, "cn", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.cn; }
});
Object.defineProperty(exports, "compareValues", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.compareValues; }
});
Object.defineProperty(exports, "debounce", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.debounce; }
});
Object.defineProperty(exports, "deepMerge", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.deepMerge; }
});
Object.defineProperty(exports, "evaluateConditions", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.evaluateConditions; }
});
Object.defineProperty(exports, "filterBySearchTerm", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.filterBySearchTerm; }
});
Object.defineProperty(exports, "formatDate", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.formatDate; }
});
Object.defineProperty(exports, "formatPhone", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.formatPhone; }
});
Object.defineProperty(exports, "formatValue", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.formatValue; }
});
Object.defineProperty(exports, "generateId", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.generateId; }
});
Object.defineProperty(exports, "getNestedValue", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.getNestedValue; }
});
Object.defineProperty(exports, "getRowKey", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.getRowKey; }
});
Object.defineProperty(exports, "hasNestedValue", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.hasNestedValue; }
});
Object.defineProperty(exports, "matchesSearchTerm", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.matchesSearchTerm; }
});
Object.defineProperty(exports, "omit", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.omit; }
});
Object.defineProperty(exports, "paginateData", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.paginateData; }
});
Object.defineProperty(exports, "pick", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.pick; }
});
Object.defineProperty(exports, "setNestedValue", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.setNestedValue; }
});
Object.defineProperty(exports, "sortData", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.sortData; }
});
Object.defineProperty(exports, "throttle", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.throttle; }
});
Object.defineProperty(exports, "validateEmail", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateEmail; }
});
Object.defineProperty(exports, "validateField", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateField; }
});
Object.defineProperty(exports, "validateForm", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateForm; }
});
Object.defineProperty(exports, "validateMax", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateMax; }
});
Object.defineProperty(exports, "validateMaxLength", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateMaxLength; }
});
Object.defineProperty(exports, "validateMin", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateMin; }
});
Object.defineProperty(exports, "validateMinLength", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateMinLength; }
});
Object.defineProperty(exports, "validatePattern", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validatePattern; }
});
Object.defineProperty(exports, "validateRequired", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateRequired; }
});
Object.defineProperty(exports, "validateUrl", {
  enumerable: true,
  get: function () { return chunkBHNUSCJS_js.validateUrl; }
});
Object.defineProperty(exports, "I18n", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.I18n; }
});
Object.defineProperty(exports, "I18nContext", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.I18nContext; }
});
Object.defineProperty(exports, "I18nProvider", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.I18nProvider; }
});
Object.defineProperty(exports, "defaultEnTranslations", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.defaultEnTranslations; }
});
Object.defineProperty(exports, "defaultEsTranslations", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.defaultEsTranslations; }
});
Object.defineProperty(exports, "getI18n", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.getI18n; }
});
Object.defineProperty(exports, "initI18n", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.initI18n; }
});
Object.defineProperty(exports, "t", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.t; }
});
Object.defineProperty(exports, "tp", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.tp; }
});
Object.defineProperty(exports, "useI18n", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.useI18n; }
});
Object.defineProperty(exports, "useTranslatedValidation", {
  enumerable: true,
  get: function () { return chunkGUG6HX7G_js.useTranslatedValidation; }
});
exports.LIB_INFO = LIB_INFO;
exports.VERSION = VERSION;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map