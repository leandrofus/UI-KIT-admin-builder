'use strict';

var chunkUURDXYLH_js = require('./chunk-UURDXYLH.js');
var chunkJGIGTIL4_js = require('./chunk-JGIGTIL4.js');
var chunkCXZHMULA_js = require('./chunk-CXZHMULA.js');
var chunkQ7VXORTP_js = require('./chunk-Q7VXORTP.js');
var chunk2TXOJY2D_js = require('./chunk-2TXOJY2D.js');
var chunkUSZU7PLJ_js = require('./chunk-USZU7PLJ.js');
var chunkG4EIC5OB_js = require('./chunk-G4EIC5OB.js');
require('./chunk-T5TTRS5M.js');
var chunkJOGM2EW4_js = require('./chunk-JOGM2EW4.js');

// src/index.ts
var VERSION = "0.1.0";
var LIB_INFO = {
  name: "dynamic-ui-kit",
  version: VERSION,
  description: "JSON-driven dynamic UI components for React",
  repository: "https://github.com/leandrofus/UI-KIT-admin-builder"
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

Object.defineProperty(exports, "AdvancedSearchModal", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.AdvancedSearchModal; }
});
Object.defineProperty(exports, "DynamicModal", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.DynamicModal; }
});
Object.defineProperty(exports, "FormRenderer", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.FormRenderer; }
});
Object.defineProperty(exports, "KanbanRenderer", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.KanbanRenderer; }
});
Object.defineProperty(exports, "SidebarRenderer", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.SidebarRenderer; }
});
Object.defineProperty(exports, "TabRenderer", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.TabRenderer; }
});
Object.defineProperty(exports, "TableRenderer", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.TableRenderer; }
});
Object.defineProperty(exports, "TableToolbar", {
  enumerable: true,
  get: function () { return chunkUURDXYLH_js.TableToolbar; }
});
Object.defineProperty(exports, "useColumnConfig", {
  enumerable: true,
  get: function () { return chunkJGIGTIL4_js.useColumnConfig; }
});
Object.defineProperty(exports, "useFormState", {
  enumerable: true,
  get: function () { return chunkJGIGTIL4_js.useFormState; }
});
Object.defineProperty(exports, "usePaginatedData", {
  enumerable: true,
  get: function () { return chunkJGIGTIL4_js.usePaginatedData; }
});
Object.defineProperty(exports, "useServerTableData", {
  enumerable: true,
  get: function () { return chunkJGIGTIL4_js.useServerTableData; }
});
Object.defineProperty(exports, "useTableSelection", {
  enumerable: true,
  get: function () { return chunkJGIGTIL4_js.useTableSelection; }
});
Object.defineProperty(exports, "commonTransformers", {
  enumerable: true,
  get: function () { return chunkCXZHMULA_js.commonTransformers; }
});
Object.defineProperty(exports, "createAxiosAdapter", {
  enumerable: true,
  get: function () { return chunkCXZHMULA_js.createAxiosAdapter; }
});
Object.defineProperty(exports, "createFormAdapter", {
  enumerable: true,
  get: function () { return chunkCXZHMULA_js.createFormAdapter; }
});
Object.defineProperty(exports, "createServiceAdapter", {
  enumerable: true,
  get: function () { return chunkCXZHMULA_js.createServiceAdapter; }
});
Object.defineProperty(exports, "CheckboxField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.CheckboxField; }
});
Object.defineProperty(exports, "CurrencyField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.CurrencyField; }
});
Object.defineProperty(exports, "FieldRegistry", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.FieldRegistry; }
});
Object.defineProperty(exports, "FieldRegistryContext", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.FieldRegistryContext; }
});
Object.defineProperty(exports, "HiddenField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.HiddenField; }
});
Object.defineProperty(exports, "NumberField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.NumberField; }
});
Object.defineProperty(exports, "SelectField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.SelectField; }
});
Object.defineProperty(exports, "SwitchField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.SwitchField; }
});
Object.defineProperty(exports, "TextField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.TextField; }
});
Object.defineProperty(exports, "TextareaField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.TextareaField; }
});
Object.defineProperty(exports, "baseFields", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.baseFields; }
});
Object.defineProperty(exports, "createFieldFactory", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.createFieldFactory; }
});
Object.defineProperty(exports, "getDefaultRegistry", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.getDefaultRegistry; }
});
Object.defineProperty(exports, "getField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.getField; }
});
Object.defineProperty(exports, "registerField", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.registerField; }
});
Object.defineProperty(exports, "registerFields", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.registerFields; }
});
Object.defineProperty(exports, "setDefaultRegistry", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.setDefaultRegistry; }
});
Object.defineProperty(exports, "useFieldFactory", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.useFieldFactory; }
});
Object.defineProperty(exports, "useFieldRegistry", {
  enumerable: true,
  get: function () { return chunkQ7VXORTP_js.useFieldRegistry; }
});
Object.defineProperty(exports, "assertValidConfig", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.assertValidConfig; }
});
Object.defineProperty(exports, "formatValidationErrors", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.formatValidationErrors; }
});
Object.defineProperty(exports, "isLikelyTranslationKey", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.isLikelyTranslationKey; }
});
Object.defineProperty(exports, "translateConfig", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.translateConfig; }
});
Object.defineProperty(exports, "validateConfig", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.validateConfig; }
});
Object.defineProperty(exports, "validateFormConfig", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.validateFormConfig; }
});
Object.defineProperty(exports, "validateTableConfig", {
  enumerable: true,
  get: function () { return chunk2TXOJY2D_js.validateTableConfig; }
});
Object.defineProperty(exports, "ConfigLoader", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.ConfigLoader; }
});
Object.defineProperty(exports, "createConfigLoader", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.createConfigLoader; }
});
Object.defineProperty(exports, "getModalSubmitLabel", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.getModalSubmitLabel; }
});
Object.defineProperty(exports, "getModalTitle", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.getModalTitle; }
});
Object.defineProperty(exports, "parseConfig", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.parseConfig; }
});
Object.defineProperty(exports, "parseFormConfig", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.parseFormConfig; }
});
Object.defineProperty(exports, "parseModalConfig", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.parseModalConfig; }
});
Object.defineProperty(exports, "parseTableConfig", {
  enumerable: true,
  get: function () { return chunkUSZU7PLJ_js.parseTableConfig; }
});
Object.defineProperty(exports, "calculatePagination", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.calculatePagination; }
});
Object.defineProperty(exports, "cn", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.cn; }
});
Object.defineProperty(exports, "compareValues", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.compareValues; }
});
Object.defineProperty(exports, "debounce", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.debounce; }
});
Object.defineProperty(exports, "deepMerge", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.deepMerge; }
});
Object.defineProperty(exports, "evaluateConditions", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.evaluateConditions; }
});
Object.defineProperty(exports, "filterBySearchTerm", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.filterBySearchTerm; }
});
Object.defineProperty(exports, "formatDate", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.formatDate; }
});
Object.defineProperty(exports, "formatPhone", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.formatPhone; }
});
Object.defineProperty(exports, "formatValue", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.formatValue; }
});
Object.defineProperty(exports, "generateId", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.generateId; }
});
Object.defineProperty(exports, "getNestedValue", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.getNestedValue; }
});
Object.defineProperty(exports, "getRowKey", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.getRowKey; }
});
Object.defineProperty(exports, "hasNestedValue", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.hasNestedValue; }
});
Object.defineProperty(exports, "matchesSearchTerm", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.matchesSearchTerm; }
});
Object.defineProperty(exports, "omit", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.omit; }
});
Object.defineProperty(exports, "paginateData", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.paginateData; }
});
Object.defineProperty(exports, "pick", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.pick; }
});
Object.defineProperty(exports, "setNestedValue", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.setNestedValue; }
});
Object.defineProperty(exports, "sortData", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.sortData; }
});
Object.defineProperty(exports, "throttle", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.throttle; }
});
Object.defineProperty(exports, "validateEmail", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateEmail; }
});
Object.defineProperty(exports, "validateField", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateField; }
});
Object.defineProperty(exports, "validateForm", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateForm; }
});
Object.defineProperty(exports, "validateMax", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateMax; }
});
Object.defineProperty(exports, "validateMaxLength", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateMaxLength; }
});
Object.defineProperty(exports, "validateMin", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateMin; }
});
Object.defineProperty(exports, "validateMinLength", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateMinLength; }
});
Object.defineProperty(exports, "validatePattern", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validatePattern; }
});
Object.defineProperty(exports, "validateRequired", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateRequired; }
});
Object.defineProperty(exports, "validateUrl", {
  enumerable: true,
  get: function () { return chunkG4EIC5OB_js.validateUrl; }
});
Object.defineProperty(exports, "I18n", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.I18n; }
});
Object.defineProperty(exports, "I18nContext", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.I18nContext; }
});
Object.defineProperty(exports, "I18nProvider", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.I18nProvider; }
});
Object.defineProperty(exports, "getI18n", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.getI18n; }
});
Object.defineProperty(exports, "initI18n", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.initI18n; }
});
Object.defineProperty(exports, "resolveLabel", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.resolveLabel; }
});
Object.defineProperty(exports, "t", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.t; }
});
Object.defineProperty(exports, "tp", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.tp; }
});
Object.defineProperty(exports, "tx", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.tx; }
});
Object.defineProperty(exports, "useI18n", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.useI18n; }
});
Object.defineProperty(exports, "useTranslatedValidation", {
  enumerable: true,
  get: function () { return chunkJOGM2EW4_js.useTranslatedValidation; }
});
exports.LIB_INFO = LIB_INFO;
exports.VERSION = VERSION;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map