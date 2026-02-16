# @dnstyle/dynamic-ui-kit

A framework-agnostic, JSON-driven UI component library for building dynamic tables, forms, and modals with React.

## Features

- 📋 **JSON-driven configuration** - Define tables and forms with simple JSON
- 🔌 **Adapter pattern** - Plug in any backend/API with service adapters
- 🧩 **Extensible field system** - Register custom field components
- ✅ **Built-in validation** - Comprehensive validation with conditional logic
- 🎣 **Powerful hooks** - Reusable state management for pagination, forms, selection
- 🔧 **Config validation** - Validate JSON configs at development time
- 📦 **Tree-shakeable** - Import only what you need

## Installation

```bash
npm install @dnstyle/dynamic-ui-kit
# or
yarn add @dnstyle/dynamic-ui-kit
# or for local development
npm install ../path/to/dynamic-ui-kit
```

## Quick Start

### Using Hooks

```tsx
import { usePaginatedData, useFormState } from '@dnstyle/dynamic-ui-kit';

function MyTable() {
  const { state, actions, getPageData } = usePaginatedData({
    initialData: myData,
    pageSize: 10,
  });

  return (
    <table>
      <tbody>
        {getPageData().map(row => (
          <tr key={row.id}>...</tr>
        ))}
      </tbody>
    </table>
  );
}

function MyForm() {
  const { values, errors, getFieldProps, handleSubmit } = useFormState({
    initialValues: { name: '', email: '' },
    sections: formConfig.sections,
    onSubmit: (data) => saveData(data),
  });

  return (
    <form onSubmit={handleSubmit}>
      <input {...getFieldProps('name')} />
      <input {...getFieldProps('email')} />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Using Service Adapters

```tsx
import { createServiceAdapter } from '@dnstyle/dynamic-ui-kit';

const productsService = createServiceAdapter({
  baseUrl: '/api',
  entityName: 'products',
  headers: () => ({
    'Authorization': `Bearer ${getToken()}`,
  }),
});

// Fetch paginated data
const { data, total, page } = await productsService.list({
  page: 1,
  pageSize: 20,
  search: 'widget',
  sortColumn: 'name',
  sortDirection: 'asc',
});

// CRUD operations
await productsService.create({ name: 'New Product' });
await productsService.update(1, { name: 'Updated Product' });
await productsService.delete(1);
```

### Using the Field Registry

```tsx
import { 
  FieldRegistry, 
  registerField, 
  useFieldFactory 
} from '@dnstyle/dynamic-ui-kit';

// Register a custom field
registerField({
  type: 'color-picker',
  component: ColorPickerField,
  displayName: 'Color Picker',
});

// Use in a component
function DynamicForm({ config }) {
  const { renderSection } = useFieldFactory();
  const { values, handleChange, errors, touched } = useFormState({...});

  return (
    <form>
      {config.sections.map(section =>
        renderSection(section, values, {
          onChange: handleChange,
          errors,
          touched,
        })
      )}
    </form>
  );
}
```

### Validating Configuration

```tsx
import { validateConfig, parseConfig } from '@dnstyle/dynamic-ui-kit';

// Validate a config
const result = validateConfig(rawConfig);
if (!result.valid) {
  console.error('Config errors:', result.errors);
}

// Parse and normalize config
const tableConfig = parseConfig(rawTableJson, {
  generateLabels: true,
  defaultSortable: true,
});
```

## Module Exports

The library supports tree-shaking with multiple entry points:

```tsx
// Main entry (all exports)
import { usePaginatedData, validateConfig } from '@dnstyle/dynamic-ui-kit';

// Core utilities
import { formatValue, cn, debounce } from '@dnstyle/dynamic-ui-kit/core';

// Hooks only
import { useFormState, useTableSelection } from '@dnstyle/dynamic-ui-kit/hooks';

// Adapters
import { createServiceAdapter, createAxiosAdapter } from '@dnstyle/dynamic-ui-kit/adapters';

// Field system
import { FieldRegistry, TextField, baseFields } from '@dnstyle/dynamic-ui-kit/fields';

// Config system
import { validateFormConfig, parseTableConfig } from '@dnstyle/dynamic-ui-kit/config';
```

## API Reference

### Hooks

| Hook | Description |
|------|-------------|
| `usePaginatedData` | Pagination, sorting, search state management |
| `useFormState` | Form values, validation, touched state |
| `useColumnConfig` | Column visibility, ordering, resizing |
| `useTableSelection` | Single/multiple row selection |
| `useFieldFactory` | Render fields from JSON config |
| `useFieldRegistry` | Access the field component registry |

### Adapters

| Adapter | Description |
|---------|-------------|
| `createServiceAdapter` | Fetch-based API adapter |
| `createAxiosAdapter` | Axios-based API adapter |
| `createFormAdapter` | Form data transformation adapter |

### Field Components

| Component | Type |
|-----------|------|
| `TextField` | text, email, password, tel, url |
| `NumberField` | number, percent |
| `CurrencyField` | currency |
| `TextareaField` | textarea |
| `SelectField` | select |
| `CheckboxField` | checkbox |
| `SwitchField` | switch |
| `HiddenField` | hidden |

### Config Validators

| Function | Description |
|----------|-------------|
| `validateTableConfig` | Validate table JSON config |
| `validateFormConfig` | Validate form JSON config |
| `validateConfig` | Auto-detect and validate config |
| `parseTableConfig` | Parse and normalize table config |
| `parseFormConfig` | Parse and normalize form config |

### Components

| Component | Description |
|-----------|-------------|
| `TableRenderer` | Configurable data table with pagination, sorting, filtering, and selection |
| `FormRenderer` | Dynamic form renderer with sections, validation, and conditional fields |
| `DynamicModal` | Modal wrapper with tabs, forms, and action buttons |

### Theming

The library supports light/dark theming:

- By default components follow the user's operating system preference via `prefers-color-scheme`.
- Components accept a `theme` prop with values `'system'`, `'light'`, or `'dark'` to force a specific theme per component.

### Using TableRenderer

```tsx
import { TableRenderer } from '@dnstyle/dynamic-ui-kit';
import '@dnstyle/dynamic-ui-kit/styles';

const tableConfig = {
  columns: [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'status', header: 'Status', type: 'badge' },
  ],
  pagination: { enabled: true, pageSize: 10 },
};

function UserTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  return (
    <TableRenderer
      config={tableConfig}
      data={users}
      totalCount={100}
      page={page}
      pageSize={10}
      onPageChange={setPage}
      onRowClick={(row) => console.log('Clicked:', row)}
      selectable
      selectionMode="multiple"
      onSelectionChange={(ids) => console.log('Selected:', ids)}
      striped
      hoverable
    />
  );
}
```

#### TableRenderer Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `TableConfig` | Table configuration object |
| `data` | `T[]` | Data array to display |
| `totalCount` | `number` | Total records for pagination |
| `page` | `number` | Current page (1-indexed) |
| `pageSize` | `number` | Items per page |
| `loading` | `boolean` | Show loading state |
| `error` | `string` | Error message to display |
| `onPageChange` | `(page: number) => void` | Page change callback |
| `onSortChange` | `(sort) => void` | Sort change callback |
| `onRowClick` | `(row, index) => void` | Row click callback |
| `selectable` | `boolean` | Enable row selection |
| `selectionMode` | `'single' \| 'multiple'` | Selection mode |
| `striped` | `boolean` | Stripe alternate rows |
| `hoverable` | `boolean` | Add hover effect |
| `bordered` | `boolean` | Add cell borders |
| `compact` | `boolean` | Compact padding |
| `stickyHeader` | `boolean` | Sticky header on scroll |
| `theme` | `'system' \| 'light' \| 'dark'` | Theme mode for the table. Defaults to `system` (follows `prefers-color-scheme`). |
| `renderActions` | `(row, index) => ReactNode` | Custom actions column |

### Using FormRenderer

```tsx
import { FormRenderer } from '@dnstyle/dynamic-ui-kit';
import '@dnstyle/dynamic-ui-kit/styles';

const formConfig = {
  id: 'product-form',
  title: 'Edit Product',
  sections: [
    {
      id: 'basic',
      title: 'Basic Information',
      columns: 2,
      fields: [
        { name: 'name', type: 'text', label: 'Product Name', required: true },
        { name: 'sku', type: 'text', label: 'SKU' },
        { name: 'description', type: 'textarea', label: 'Description', colSpan: 2 },
      ],
    },
    {
      id: 'pricing',
      title: 'Pricing',
      collapsible: true,
      fields: [
        { name: 'price', type: 'currency', label: 'Price', required: true },
        { name: 'cost', type: 'currency', label: 'Cost' },
        { 
          name: 'margin', 
          type: 'percent', 
          label: 'Margin',
          computed: { formula: '(price - cost) / price * 100', deps: ['price', 'cost'] }
        },
      ],
    },
  ],
};

function ProductForm() {
  const formRef = useRef<FormRendererRef>(null);
  const [values, setValues] = useState({ name: '', price: 0 });

  const handleSubmit = async (data) => {
    await api.post('/products', data);
  };

  return (
    <FormRenderer
      ref={formRef}
      config={formConfig}
      values={values}
      onChange={(name, value, allValues) => setValues(allValues)}
      onSubmit={handleSubmit}
      onCancel={() => history.back()}
    />
  );
}
```

#### FormRenderer Props

| Prop | Type | Description |
|------|------|-------------|
| `config` | `FormConfig` | Form configuration object |
| `values` | `T` | Current form values (controlled) |
| `initialValues` | `T` | Initial values (uncontrolled) |
| `errors` | `FormErrors` | External validation errors |
| `onSubmit` | `(values: T) => void` | Form submit handler |
| `onCancel` | `() => void` | Cancel button handler |
| `onChange` | `(name, value, values) => void` | Field change handler |
| `loading` | `boolean` | Disable form while loading |
| `disabled` | `boolean` | Disable all fields |
| `readOnly` | `boolean` | Make all fields read-only |
| `renderField` | `(props) => ReactNode` | Custom field renderer |
| `renderSection` | `(props) => ReactNode` | Custom section renderer |
| `hideButtons` | `boolean` | Hide submit/cancel buttons |
| `header` | `ReactNode` | Custom header content |
| `footer` | `ReactNode` | Custom footer content |

### Using DynamicModal

```tsx
import { DynamicModal } from '@dnstyle/dynamic-ui-kit';
import '@dnstyle/dynamic-ui-kit/styles';

function EditProductModal({ product, isOpen, onClose }) {
  return (
    <DynamicModal
      open={isOpen}
      onClose={onClose}
      title="Edit Product"
      subtitle={`Editing: ${product.name}`}
      size="lg"
      config={formConfig}
      initialValues={product}
      onSubmit={async (values) => {
        await api.put(`/products/${product.id}`, values);
        onClose();
      }}
      onDelete={async () => {
        await api.delete(`/products/${product.id}`);
        onClose();
      }}
      deleteConfirmation={{
        title: 'Delete Product',
        message: 'Are you sure? This action cannot be undone.',
        confirmLabel: 'Delete',
        confirmVariant: 'danger',
      }}
    />
  );
}

// With Tabs
function TabbedModal() {
  return (
    <DynamicModal
      open={true}
      onClose={() => {}}
      title="Product Details"
      tabs={[
        { id: 'info', label: 'Information', content: infoFormConfig },
        { id: 'pricing', label: 'Pricing', content: pricingFormConfig },
        { id: 'inventory', label: 'Inventory', content: inventoryFormConfig },
      ]}
      onSubmit={handleSave}
    />
  );
}
```

#### DynamicModal Props

| Prop | Type | Description |
|------|------|-------------|
| `theme` | `'system' \| 'light' \| 'dark'` | (Optional) Force modal theme. Defaults to `system` which follows user's `prefers-color-scheme`. |

| Prop | Type | Description |
|------|------|-------------|
| `open` | `boolean` | Whether modal is visible |
| `onClose` | `() => void` | Close handler |
| `title` | `string` | Modal title |
| `subtitle` | `string` | Modal subtitle |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | Modal size |
| `config` | `FormConfig` | Form configuration |
| `tabs` | `ModalTab[]` | Tab configurations |
| `initialValues` | `T` | Initial form values |
| `onSubmit` | `(values: T) => void` | Submit handler |
| `onDelete` | `() => void` | Delete handler (shows delete button) |
| `actions` | `ModalAction[]` | Custom action buttons |
| `loading` | `boolean` | Loading state |
| `error` | `string` | Error message |
| `closeOnBackdropClick` | `boolean` | Close on overlay click |
| `closeOnEscape` | `boolean` | Close on Escape key |
| `deleteConfirmation` | `ConfirmationConfig` | Delete confirmation dialog |

## Styling

Import the CSS styles to use the default styling:

```tsx
// Import all styles
import '@dnstyle/dynamic-ui-kit/styles';

// Or import specific component styles
import '@dnstyle/dynamic-ui-kit/styles/table';
import '@dnstyle/dynamic-ui-kit/styles/form';
import '@dnstyle/dynamic-ui-kit/styles/modal';
```

The styles use CSS custom properties for easy theming:

```css
:root {
  /* Table variables */
  --dui-table-primary: #3b82f6;
  --dui-table-bg: #ffffff;
  --dui-table-border-color: #e5e7eb;
  --dui-table-header-bg: #f9fafb;

  /* Form variables */
  --dui-form-primary: #3b82f6;
  --dui-form-bg: #ffffff;
  --dui-form-border-color: #d1d5db;
  --dui-form-text-error: #ef4444;

  /* Modal variables */
  --dui-modal-primary: #3b82f6;
  --dui-modal-bg: #ffffff;
  --dui-modal-overlay-bg: rgba(0, 0, 0, 0.5);
  /* ... more variables */
}

/* Dark mode is automatically supported via @media (prefers-color-scheme: dark) */
```

## Internationalization (i18n)

The library includes built-in i18n support:

```tsx
import { I18nProvider, initI18n } from '@dnstyle/dynamic-ui-kit';

// Initialize with Spanish
initI18n({ locale: 'es' });

// Or use the provider
function App() {
  return (
    <I18nProvider locale="es">
      <MyApp />
    </I18nProvider>
  );
}
```

Supported translations include form validation messages, table pagination, and more.

By default the library ships a canonical set of translations (`defaultEnTranslations` / `defaultEsTranslations`). If you want to override or extend translations from your application, pass a partial `translations` map to `initI18n(...)` — the library will deep-merge your translations with its defaults so missing keys fall back to the canonical set. You can also call `getI18n().addTranslations(locale, {...})` at runtime to merge additional keys.

## Configuration Examples

### Table Configuration

```json
{
  "columns": [
    { "key": "name", "header": "Product Name", "sortable": true },
    { "key": "price", "header": "Price", "type": "currency" },
    { "key": "stock", "header": "Stock", "type": "number" },
    { "key": "status", "header": "Status", "type": "badge" }
  ],
  "pagination": { "pageSize": 20 },
  "selectable": true
}
```

### Form Configuration

```json
{
  "entity": "product",
  "sections": [
    {
      "title": "Basic Info",
      "fields": [
        { "name": "name", "type": "text", "required": true },
        { "name": "description", "type": "textarea" },
        { 
          "name": "price", 
          "type": "currency", 
          "validation": [{ "min": 0, "message": "Price must be positive" }]
        }
      ]
    },
    {
      "title": "Inventory",
      "showWhen": { "field": "trackInventory", "operator": "eq", "value": true },
      "fields": [
        { "name": "stock", "type": "number", "min": 0 },
        { "name": "lowStockThreshold", "type": "number" }
      ]
    }
  ]
}
```

## Development

```bash
# Install dependencies
npm install

# Build the library
npm run build

# Type check
npm run typecheck

# Run tests
npm test

# Development mode (watch)
npm run dev
```

## License

MIT © DNStyle

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a PR.
