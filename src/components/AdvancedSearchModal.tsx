import React, { useEffect, useState } from 'react';
import { useI18n, t } from '../i18n/I18n';
import { cn } from '../core/utils';

export type FieldType = 'string' | 'number' | 'date' | 'select' | 'boolean' | 'range' | 'entity';

export interface FieldOption { value: string | number; label: string }

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: FieldOption[];
  colSpan?: number;
  excludeFromAdvancedSearch?: boolean;
  entityType?: string;
}

export interface AdvancedSearchModalProps {
  open: boolean;
  title?: string;
  fields: FieldConfig[];
  currentFilters?: any[]; // format: { field, operator, value, label? }
  onClose: () => void;
  onApply: (filters: any[]) => void;
  onFilterChange?: (filters: any[]) => void;
  /** If true, doesn't render the external overlay; useful for embedding inside another modal */
  inline?: boolean;
  /** List of field names to exclude from this specific instance */
  excludeFields?: string[];
  /** Custom field renderer */
  renderField?: (field: FieldConfig, value: any, onChange: (val: any) => void) => React.ReactNode;
}

export function AdvancedSearchModal({ 
  open, 
  title = '', 
  fields, 
  currentFilters = [], 
  onClose, 
  onApply, 
  onFilterChange, 
  inline = false,
  excludeFields = [],
  renderField
}: AdvancedSearchModalProps) {
  const { t } = useI18n();
  const modalTitle = title || t('advanced_search.title', { default: 'Búsqueda Avanzada' });
  
  // Local state for each field
  const [state, setState] = useState<Record<string, any>>({});
  const [operators, setOperators] = useState<Record<string, string>>({});

  // Filter out excluded fields
  const visibleFields = fields.filter(f => 
    !f.excludeFromAdvancedSearch && !excludeFields.includes(f.name)
  );

  const OPERATORS_BY_TYPE: Record<string, { value: string; label: string }[]> = {
    string: [
      { value: 'contains', label: t('operators.contains', { default: 'Contiene' }) },
      { value: 'equals', label: t('operators.equals', { default: 'Igual a' }) },
      { value: 'startsWith', label: t('operators.startsWith', { default: 'Empieza con' }) },
      { value: 'endsWith', label: t('operators.endsWith', { default: 'Termina con' }) },
      { value: 'ne', label: t('operators.ne', { default: 'Distinto de' }) }
    ],
    number: [
      { value: 'equals', label: t('operators.equals', { default: 'Igual a' }) },
      { value: 'gt', label: t('operators.gt', { default: 'Mayor que' }) },
      { value: 'gte', label: t('operators.gte', { default: 'Mayor o igual' }) },
      { value: 'lt', label: t('operators.lt', { default: 'Menor que' }) },
      { value: 'lte', label: t('operators.lte', { default: 'Menor o igual' }) },
      { value: 'between', label: t('operators.between', { default: 'Entre' }) },
      { value: 'ne', label: t('operators.ne', { default: 'Distinto de' }) }
    ],
    range: [
      { value: 'between', label: t('operators.between', { default: 'Entre' }) },
      { value: 'equals', label: t('operators.equals', { default: 'Igual a' }) },
      { value: 'gt', label: t('operators.gt', { default: 'Mayor que' }) },
      { value: 'gte', label: t('operators.gte', { default: 'Mayor o igual' }) },
      { value: 'lt', label: t('operators.lt', { default: 'Menor que' }) },
      { value: 'lte', label: t('operators.lte', { default: 'Menor o igual' }) },
      { value: 'ne', label: t('operators.ne', { default: 'Distinto de' }) }
    ],
    date: [
      { value: 'between', label: t('operators.between', { default: 'Entre' }) },
      { value: 'equals', label: t('operators.equals', { default: 'Igual a' }) },
      { value: 'gt', label: t('operators.after', { default: 'Posterior a' }) },
      { value: 'gte', label: t('operators.from', { default: 'Desde' }) },
      { value: 'lt', label: t('operators.before', { default: 'Anterior a' }) },
      { value: 'lte', label: t('operators.until', { default: 'Hasta' }) }
    ],
    boolean: [
      { value: 'equals', label: t('operators.is', { default: 'Es' }) }
    ],
    select: [
      { value: 'in', label: t('operators.in', { default: 'En lista' }) },
      { value: 'equals', label: t('operators.equals', { default: 'Igual a' }) },
      { value: 'ne', label: t('operators.ne', { default: 'Distinto de' }) },
      { value: 'not_in', label: t('operators.not_in', { default: 'No en lista' }) }
    ]
  };

  // Ref to track currentFilters without triggering notification effect
  const currentFiltersRef = React.useRef(currentFilters);
  
  useEffect(() => {
    currentFiltersRef.current = currentFilters;
  }, [currentFilters]);

  useEffect(() => {
    if (!open) return;
    
    // Initialize state from currentFilters
    const s: Record<string, any> = {};
    const ops: Record<string, string> = {};
    
    // Default values
    visibleFields.forEach((f) => { 
      s[f.name] = f.type === 'boolean' ? 'any' : (f.type === 'range' || f.type === 'date' ? ['', ''] : '');
      // Default operators
      if (f.type === 'range' || f.type === 'date') ops[f.name] = 'between';
      else if (f.type === 'string') ops[f.name] = 'contains';
      else if (f.type === 'select') ops[f.name] = 'in'; // Multi-select by default
      else ops[f.name] = 'equals';
    });

    if (Array.isArray(currentFilters) && currentFilters.length > 0) {
      currentFilters.forEach((f: any) => {
        if (!f.field) return;
        
        const fieldConfig = visibleFields.find(field => field.name === f.field);
        if (!fieldConfig) return;

        let val = f.value;
        if (fieldConfig.type === 'boolean') {
             val = String(val); // "true" / "false"
        }
        
        s[f.field] = val;
        if (f.operator) ops[f.field] = f.operator;
      });
    }
    
    setState(s);
    setOperators(ops);
  }, [open, currentFilters, fields]); 

  // Map state to filters array
  const getFiltersFromState = () => {
    const filters: any[] = [];
    visibleFields.forEach((f) => {
      const val = state[f.name];
      const op = operators[f.name] || 'equals'; 

      // Skip empty values
      if (val === '' || val === undefined || val === null) return;
      if (Array.isArray(val) && val.every(v => v === '' || v === null || v === undefined)) return;
      if (f.type === 'boolean' && val === 'any') return;

      // Special handling for 'between' operator
      if (op === 'between' && (f.type === 'range' || f.type === 'date' || f.type === 'number')) {
         if (Array.isArray(val) && val.length === 2) {
            const hasMin = val[0] !== '' && val[0] !== null && val[0] !== undefined;
            const hasMax = val[1] !== '' && val[1] !== null && val[1] !== undefined;
            
            if (hasMin && hasMax) {
               filters.push({ field: f.name, operator: 'between', value: f.type === 'date' ? val : [Number(val[0]), Number(val[1])], label: f.label });
            } else if (hasMin) {
               filters.push({ field: f.name, operator: 'gte', value: f.type === 'date' ? val[0] : Number(val[0]), label: f.label });
            } else if (hasMax) {
               filters.push({ field: f.name, operator: 'lte', value: f.type === 'date' ? val[1] : Number(val[1]), label: f.label });
            }
         }
         return;
      }

      // Special handling for 'in' / 'not_in'
      if ((op === 'in' || op === 'not_in') && f.type === 'select') {
         if (Array.isArray(val) && val.length > 0) {
            filters.push({ field: f.name, operator: op, value: val, label: f.label });
         } else if (val && !Array.isArray(val)) {
            filters.push({ field: f.name, operator: op, value: [val], label: f.label });
         }
         return;
      }

      // Standard operators
      let finalVal = val;
      if (f.type === 'number' || f.type === 'range') {
         if (Array.isArray(val)) finalVal = Number(val[0]); 
         else finalVal = Number(val);
      }
      
      // If boolean
      if (f.type === 'boolean') {
         finalVal = val === 'true';
      }

      filters.push({ field: f.name, operator: op, value: finalVal, label: f.label });
    });
    return filters;
  };

  // Notify changes in real-time
  useEffect(() => {
    if (!onFilterChange) return;

    const filters = getFiltersFromState();
    
    const areFiltersEqual = (f1: any[], f2: any[]) => {
      if (!f1 || !f2) return false;
      if (f1.length !== f2.length) return false;
      
      const s1 = [...f1].sort((a, b) => a.field.localeCompare(b.field));
      const s2 = [...f2].sort((a, b) => a.field.localeCompare(b.field));
      
      for (let i = 0; i < s1.length; i++) {
        if (s1[i].field !== s2[i].field) return false;
        if (s1[i].operator !== s2[i].operator) return false;
        
        const v1 = s1[i].value;
        const v2 = s2[i].value;
        
        if (Array.isArray(v1) && Array.isArray(v2)) {
           if (v1.length !== v2.length) return false;
           if (v1.some((v: any, idx: number) => String(v) !== String(v2[idx]))) return false;
        } else if (String(v1) !== String(v2)) {
           return false;
        }
      }
      return true;
    };

    if (!areFiltersEqual(filters, currentFiltersRef.current || [])) {
      onFilterChange(filters);
    }
  }, [state, operators, visibleFields, onFilterChange]);

  if (!open && !inline) return null;

  const handleChange = (name: string, value: any) => {
    setState(prev => ({ ...prev, [name]: value }));
  };

  const handleOperatorChange = (name: string, op: string) => {
    setOperators(prev => ({ ...prev, [name]: op }));
  };

  const handleApply = () => {
    onApply(getFiltersFromState());
    onClose();
  };

  const handleClear = () => {
    const s: Record<string, any> = {};
    const ops: Record<string, string> = {};
    visibleFields.forEach((f) => { 
      s[f.name] = f.type === 'boolean' ? 'any' : (f.type === 'range' || f.type === 'date' ? ['', ''] : '');
      if (f.type === 'range' || f.type === 'date') ops[f.name] = 'between';
      else if (f.type === 'string') ops[f.name] = 'contains';
      else if (f.type === 'select') ops[f.name] = 'in';
      else ops[f.name] = 'equals';
    });
    setState(s);
    setOperators(ops);
  };

  const inner = (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleFields.map((f) => {
          const op = operators[f.name];
          const isBetween = op === 'between';
          
          return (
          <div key={f.name} className={cn(f.colSpan === 2 ? 'col-span-1 md:col-span-2' : '')}>
             <div className="flex justify-between items-center mb-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{f.label}</label>
            </div>
            
            <div className="flex gap-2">
               {/* Operator Selector */}
               <select 
                 className="w-1/3 h-10 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                 value={op}
                 onChange={(e) => handleOperatorChange(f.name, e.target.value)}
               >
                 {OPERATORS_BY_TYPE[f.type === 'range' ? 'range' : (f.type === 'date' ? 'date' : (f.type === 'select' ? 'select' : (f.type === 'number' ? 'number' : (f.type === 'boolean' ? 'boolean' : 'string'))))]?.map(o => (
                   <option key={o.value} value={o.value}>{o.label}</option>
                 ))}
               </select>

               {/* Input(s) */}
               <div className="flex-1">
                {(() => {
                  const custom = renderField ? renderField(f, state[f.name], (val) => handleChange(f.name, val)) : null;
                  if (custom) return custom;
                  
                  return (
                    <>
                 {(f.type === 'string' || (f.type === 'number' && !isBetween)) && (
                  <input 
                    type={f.type === 'number' ? 'number' : 'text'}
                    className="v2-input" 
                    placeholder={f.placeholder || f.label} 
                    value={Array.isArray(state[f.name]) ? state[f.name][0] : (state[f.name] || '')} 
                    onChange={(e) => {
                       if (f.type === 'range' || f.type === 'number') {
                          const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : [state[f.name] || '', ''];
                          cur[0] = e.target.value;
                          handleChange(f.name, cur);
                       } else {
                          handleChange(f.name, e.target.value);
                       }
                    }} 
                  />
                )}

                {f.type === 'date' && !isBetween && (
                   <input 
                      type="date" 
                      className="v2-input" 
                      value={Array.isArray(state[f.name]) ? state[f.name][0] || '' : state[f.name] || ''} 
                      onChange={(e) => {
                        const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : ['', ''];
                        cur[0] = e.target.value;
                        handleChange(f.name, cur);
                      }} 
                    />
                )}

                 {(f.type === 'date' || f.type === 'range' || f.type === 'number') && isBetween && (
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type={f.type === 'date' ? 'date' : 'number'}
                      className="v2-input" 
                      value={Array.isArray(state[f.name]) ? state[f.name][0] || '' : ''} 
                      onChange={(e) => {
                        const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : ['', ''];
                        cur[0] = e.target.value;
                        if (f.type === 'date' && cur[0] && !cur[1]) cur[1] = cur[0]; // Auto-fill
                        handleChange(f.name, cur);
                      }} 
                      placeholder={t('filters.min', { default: 'Min' })} 
                    />
                    <input 
                      type={f.type === 'date' ? 'date' : 'number'} 
                      className="v2-input" 
                      value={Array.isArray(state[f.name]) ? state[f.name][1] || '' : ''} 
                      onChange={(e) => {
                        const cur = Array.isArray(state[f.name]) ? [...state[f.name]] : ['', ''];
                        cur[1] = e.target.value;
                        if (f.type === 'date' && cur[1] && !cur[0]) cur[0] = cur[1]; // Auto-fill
                        handleChange(f.name, cur);
                      }} 
                      placeholder={t('filters.max', { default: 'Max' })} 
                    />
                  </div>
                )}

                {f.type === 'select' && (
                  <div className="space-y-2">
                     <select 
                      className="v2-input" 
                      value={(!Array.isArray(state[f.name]) && state[f.name]) ? state[f.name] : ''} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '') return;
                        
                        const isMulti = op === 'in' || op === 'not_in';
                        
                        if (isMulti) {
                           const current = Array.isArray(state[f.name]) ? state[f.name] : (state[f.name] ? [state[f.name]] : []);
                           if (!current.includes(val)) {
                             handleChange(f.name, [...current, val]);
                           }
                        } else {
                           handleChange(f.name, val);
                        }
                      }}
                    >
                      <option value="">{t('filters.any', { default: 'Cualquiera' })}</option>
                      {f.options?.map((o) => (
                        <option key={String(o.value)} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    
                    {/* Chips for multi-select (only if multi operator) */}
                    {(op === 'in' || op === 'not_in') && Array.isArray(state[f.name]) && state[f.name].length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {state[f.name].map((v: any) => {
                          const opt = f.options?.find(o => String(o.value) === String(v));
                          return (
                            <span key={String(v)} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {opt?.label || v}
                              <button 
                                type="button" 
                                onClick={() => {
                                  const next = state[f.name].filter((x: any) => x !== v);
                                  handleChange(f.name, next.length > 0 ? next : '');
                                }}
                                className="ml-1 text-blue-600 hover:text-blue-900 focus:outline-none"
                              >
                                ✕
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {f.type === 'boolean' && (
                  <select 
                    className="v2-input" 
                    value={state[f.name] ?? 'any'} 
                    onChange={(e) => handleChange(f.name, e.target.value)}
                  >
                    <option value="any">{t('filters.any', { default: 'Cualquiera' })}</option>
                    <option value="true">{t('common.yes', { default: 'Sí' })}</option>
                    <option value="false">{t('common.no', { default: 'No' })}</option>
                  </select>
                )}
                    </>
                  );
                })()}
               </div>
            </div>
          </div>
        )})}
      </div>

      {!inline && (
         <div className="flex justify-between items-center pt-6 border-t dark:border-gray-700 mt-6">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
            onClick={handleClear}
          >
            {t('common.clear', { default: 'Limpiar' })}
          </button>
           <div className="flex gap-2">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              onClick={onClose}
            >
              {t('common.cancel', { default: 'Cancelar' })}
            </button>
             <button 
              type="button" 
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
              onClick={handleApply}
            >
              {t('common.apply', { default: 'Aplicar' })}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (inline) {
    return inner;
  }

   return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto">
          <div className="border-b dark:border-gray-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{modalTitle}</h2>
            <button 
              type="button" 
              onClick={onClose} 
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {inner}
        </div>
      </div>
    </div>
  );
}

export default AdvancedSearchModal;