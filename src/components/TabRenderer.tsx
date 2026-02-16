import React from 'react';
import { cn } from '../core/utils';
import { resolveLabel } from '../i18n/I18n';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabRendererProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'underline' | 'pills' | 'ghost';
}

export const TabRenderer: React.FC<TabRendererProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline'
}) => {
  return (
    <div className={cn('dui-tabs-container', className)}>
      <div className={cn(
        'flex items-center gap-1 border-b dark:border-gray-700',
        variant === 'pills' && 'border-none gap-2'
      )}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          if (variant === 'pills') {
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !tab.disabled && onChange(tab.id)}
                disabled={tab.disabled}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400',
                  tab.disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                {tab.icon && <span className="text-lg">{tab.icon}</span>}
                <span>{resolveLabel(tab.label)}</span>
              </button>
            );
          }

          // Default: underline
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => !tab.disabled && onChange(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all duration-200 focus:outline-none',
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {tab.icon && <span className="text-lg">{tab.icon}</span>}
              <span>{resolveLabel(tab.label)}</span>
              
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full shadow-[0_-2px_10px_rgba(37,99,235,0.5)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
