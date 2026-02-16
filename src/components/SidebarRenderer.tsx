import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from "react-dom";
import { useI18n, resolveLabel, t } from '../i18n/I18n';

export type SidebarItemType = 'link' | 'dropdown' | 'group' | 'separator';

export interface SidebarItem {
  type: SidebarItemType;
  id?: string; // required for dropdowns and keys
  label: string; // translation key or literal text
  icon?: string; // emoji or icon name
  path?: string;
  children?: SidebarItem[];
  roles?: string[]; // permissions: allowed roles
  badge?: string; // notification badge key (optional)
  description?: string; // accessible description
}

export interface SidebarRendererProps {
  items: SidebarItem[];
  collapsed: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
  currentPath: string;
  onNavigate?: (path: string) => void;
  LinkComponent?: React.ComponentType<any>;
  userRole?: string;
  t?: (key: string) => string; // Translation function
  logoContent?: React.ReactNode;
  headerContent?: React.ReactNode; // Optional extra header content
  footerContent?: React.ReactNode; 
  onLogout?: () => void;
}

const DefaultLink: React.FC<any> = ({ to, children, className, onClick }) => (
  <a href={to} className={className} onClick={(e) => {
    // If onClick is provided, it might handle navigation (SPA)
    if (onClick) onClick(e);
  }}>
    {children}
  </a>
);

export const SidebarRenderer: React.FC<SidebarRendererProps> = ({
  items,
  collapsed,
  onToggleCollapse,
  currentPath,
  onNavigate,
  LinkComponent = DefaultLink,
  userRole,
  t: passedT, // Passed translation function
  logoContent,
  footerContent,
  onLogout
}) => {
  // Dropdown portal state
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  
  // Refs for tracking button positions
  const buttonRefs = useRef<{[key: string]: HTMLButtonElement | null}>({});
  
  // Use provided t or library t (shorthand)
  const translate = passedT || t;

  const isActive = (path?: string) => {
    if (!path) return false;
    // Simple check: exact match or starts with path (for nested routes)
    if (path === '/' || path === '/dashboard') return currentPath === path;
    return currentPath.startsWith(path);
  };

  const isChildActive = (item: SidebarItem): boolean => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some(child => isChildActive(child));
    }
    return false;
  };

  const toggleSidebar = () => onToggleCollapse && onToggleCollapse(!collapsed);

  const toggleMenu = (
    id: string,
    element: HTMLButtonElement | null
  ) => {
    if (openMenu === id) {
      setOpenMenu(null);
      setAnchorRect(null);
      return;
    }
    setOpenMenu(id);
    if (element) {
      setAnchorRect(element.getBoundingClientRect());
    }
  };

  useEffect(() => {
    if (!openMenu) return;
    function onDocClick(e: MouseEvent) {
      const target = e.target as Node;
      
      // If click is on the button that opened the menu, ignore (handled by toggleMenu)
      const buttonId = openMenu;
      if (buttonId && buttonRefs.current[buttonId]?.contains(target)) return;

      // if click inside any portal menu, keep open
      const menus = document.querySelectorAll('[data-portal="true"]');
      for (const m of Array.from(menus)) {
        if (m.contains(target)) return;
      }
      setOpenMenu(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openMenu]);

  // Filter items based on permissions
  const filteredItems = items.filter(item => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!userRole) return false;
    return item.roles.includes(userRole);
  });

  const renderItem = (item: SidebarItem, index: number) => {
    // Permission check inside recursion (though main list is already filtered)
    if (item.roles && item.roles.length > 0 && userRole && !item.roles.includes(userRole)) {
      return null;
    }

    if (item.type === 'separator') {
      if (collapsed) return null;
      return (
        <li key={`sep-${index}`} className="none text-gray-100">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </li>
      );
    }

    if (item.type === 'link') {
      const active = isActive(item.path);
      return (
        <li key={item.id || item.path || index}>
          <LinkComponent
            to={item.path}
            onClick={(e: any) => {
              if (onNavigate && item.path) {
                // If onNavigate is provided, we might want to let the Link handle it or intercept it
                // Usually LinkComponent (Link from react-router) handles navigation.
                // onNavigate might be for sidebar closing actions on mobile etc.
                onNavigate(item.path);
              }
            }}
            className={`group relative flex items-center gap-3 px-4 rounded-xl transition-all duration-200 ${
              active
                ? "bg-gradient-to-r from-blue-400/20 to-blue-400/20 shadow-lg shadow-blue-500/30"
                : "hover:bg-white/5 hover:shadow-md hover:shadow-blue-500/10"
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                active ? "" : ""
              }`}
            >
              <span className="text-xl">{item.icon || '📄'}</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-sm tracking-wide">
                {translate(item.label)}
              </span>
            )}
            {active && !collapsed && (
              <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
            )}
            {/* Badge here if needed */}
          </LinkComponent>
        </li>
      );
    }

    if (item.type === 'dropdown') {
      // For dropdowns, we check if any child is active to highlight the parent
      const anyChildActive = isChildActive(item);
      const isOpen = openMenu === item.id;
      
      return (
        <li key={item.id || index}>
          <button
            ref={el => buttonRefs.current[item.id!] = el}
            onClick={(e) => toggleMenu(item.id!, e.currentTarget)}
            className={`group w-full relative flex items-center gap-3 px-4 rounded-xl transition-all duration-200 text-left ${
              isOpen || anyChildActive
                ? 'bg-gradient-to-r from-blue-400/20 to-blue-400/20 shadow-lg shadow-blue-500/30'
                : 'hover:bg-white/5 hover:shadow-md hover:shadow-blue-500/10'
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200`}
            >
              <span className="text-xl">{item.icon || '📁'}</span>
            </div>
            {!collapsed && (
              <>
                <span className="font-semibold text-sm tracking-wide flex-1">
                  {translate(item.label)}
                </span>
                <span
                  className={`transition-transform duration-300 text-xs ${isOpen ? "rotate-90" : ""}`}
                >
                  ▸
                </span>
              </>
            )}
          </button>
        </li>
      );
    }

    return null;
  };

  // Render Portal Menus
  const renderPortalMenus = () => {
    return items.map(item => {
      if (item.type !== 'dropdown' || !item.children || !item.id) return null;
      if (openMenu !== item.id || !anchorRect) return null;

      // Filter children permissions
      const visibleChildren = item.children.filter(child => {
        if (!child.roles || child.roles.length === 0) return true;
        if (!userRole) return false;
        return child.roles.includes(userRole);
      });

      if (visibleChildren.length === 0) return null;

      return createPortal(
        <ul
          key={`menu-${item.id}`}
          data-portal="true"
          className="fixed bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl shadow-blue-500/20 z-50 min-w-max overflow-hidden transition-colors"
          style={{
            left: `${anchorRect.right + 12}px`,
            top: `${anchorRect.top}px`,
          }}
        >
          {visibleChildren.map((child, idx) => {
            const isFirst = idx === 0;
            const isLast = idx === visibleChildren.length - 1;
            
            if (child.type === 'separator') {
              return (
                 <li key={idx} className="border-t border-gray-200/50 dark:border-white/10"></li>
              );
            }

            return (
              <li key={child.id || child.path || idx}>
                <LinkComponent
                  to={child.path}
                  onClick={() => {
                    setOpenMenu(null);
                    if (onNavigate && child.path) onNavigate(child.path);
                  }}
                  className={`group flex items-center gap-3 px-5 py-3.5 text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/40 dark:hover:to-purple-900/40 transition-all duration-200 ${
                    isFirst ? 'first:rounded-t-2xl' : ''
                  } ${isLast ? 'last:rounded-b-2xl' : ''}`}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform">
                    {child.icon || '•'}
                  </span>
                  <span className="font-semibold text-sm">
                    {translate(child.label)}
                  </span>
                </LinkComponent>
              </li>
            );
          })}
        </ul>,
        document.body
      );
    });
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white z-40 transition-all duration-300 overflow-y-auto overflow-x-hidden ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        {/* Overlay pattern for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>

        {/* Header */}
        <div
          className={`relative flex items-center ${collapsed ? "justify-center" : "justify-between"} p-5 border-b border-white/10 backdrop-blur-sm`}
        >
          {logoContent}
          
          <div className="flex items-center gap-2">
             {/* Expansion/Collapse Button */}
             <button
                onClick={toggleSidebar}
                className="relative hover:bg-white/10 rounded-lg transition-all duration-200 group z-20 focus:outline-none focus:ring-2 focus:ring-white/30 p-1"
                title={collapsed ? translate('nav.expand') : translate('nav.collapse')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <svg
                  className="relative w-5 h-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
          </div>
        </div>

        {/* Navigation Items */}
        <ul className="relative space-y-1 mt-4">
          {filteredItems.map(renderItem)}
          
          {/* Default Logout - if provided and not in items list, append at bottom */}
          {onLogout && (
             <li>
              <button
                onClick={onLogout}
                className="group w-full relative flex items-center gap-3 px-4 rounded-xl transition-all duration-200 mt-2"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200">
                  <span className="text-xl">🚪</span>
                </div>
                {!collapsed && (
                  <span className="font-semibold text-sm tracking-wide">
                    {translate('nav.logout')}
                  </span>
                )}
              </button>
            </li>
          )}
        </ul>

         {/* Bottom decoration */}
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600"></div>
      </div>

      {renderPortalMenus()}
    </>
  );
};
