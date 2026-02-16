import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock i18n for tests
jest.mock('../../i18n/I18n', () => ({
  useI18n: () => ({ t: (k: string, _p?: any, fallback?: string) => fallback ?? k }),
  resolveLabel: (v: any) => (typeof v === 'string' ? v : String(v))
}));

import TableRenderer from '../TableRenderer';
import type { TableConfig } from '../../core/types';

describe('TableRenderer custom behaviors', () => {
  it('renders object cell values sensibly (not [object Object])', () => {
    const config: TableConfig<any> = {
      id: 't1',
      columns: [
        { key: 'customVar', accessor: 'customVar', header: 'Custom', type: 'text' }
      ]
    };

    const data = [{ id: 1, customVar: { label: 'Etiqueta X', name: 'NombreX' } }];

    render(<TableRenderer config={config} data={data} />);

    expect(screen.getByText('Etiqueta X')).toBeInTheDocument();
    expect(screen.queryByText('[object Object]')).toBeNull();
  });

  it('performs client-side sorting when no onSortChange provided', () => {
    const config: TableConfig<any> = {
      id: 't2',
      columns: [
        { key: 'name', accessor: 'name', header: 'Name', type: 'text', sortable: true }
      ],
      pagination: { enabled: false }
    };

    const data = [
      { id: 1, name: 'Bravo' },
      { id: 2, name: 'Alpha' }
    ];

    render(<TableRenderer config={config} data={data} />);

    // Initial order: Bravo, Alpha
    const firstCellsBefore = screen.getAllByText(/(Bravo|Alpha)/i);
    expect(firstCellsBefore[0].textContent).toBe('Bravo');

    // Click header to sort asc
    const header = screen.getByText('Name');
    fireEvent.click(header);

    const cellsAfter = screen.getAllByText(/(Bravo|Alpha)/i);
    expect(cellsAfter[0].textContent).toBe('Alpha');
  });

  it('renders resize handle when column is resizable and responds to mouse events', () => {
    const config: TableConfig<any> = {
      id: 't3',
      columns: [
        // no explicit `resizable` property - should be resizable by default
        { key: 'name', accessor: 'name', header: 'Name', type: 'text' }
      ],
      pagination: { enabled: false }
    };

    const data = [{ id: 1, name: 'One' }];

    const { container } = render(<TableRenderer config={config} data={data} />);

    const handle = container.querySelector('.dui-table-th-resize-handle');
    expect(handle).toBeTruthy();

    // Simulate mousedown and mousemove; JSDOM lacks layout, so startWidth will be 0
    fireEvent.mouseDown(handle as Element, { clientX: 100 });
    fireEvent.mouseMove(window, { clientX: 160 });
    fireEvent.mouseUp(window);

    // After resize we expect config.columns[0]._computedWidth to be set (>= '40px')
    const computed = (config.columns as any)[0]._computedWidth;
    expect(computed).toMatch(/\d+px/);
  });
});
