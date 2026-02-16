import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock i18n to avoid provider issues in tests
jest.mock('../../i18n/I18n', () => ({
  useI18n: () => ({ t: (k: string, _p?: any, fallback?: string) => fallback ?? k }),
  resolveLabel: (v: any) => (typeof v === 'string' ? v : String(v))
}));

import TableRenderer from '../TableRenderer';
import type { TableConfig } from '../../core/types';

describe('TableRenderer truncation behavior', () => {
  it('truncates string values to MIN_CHAR_DISPLAY when column is narrow', () => {
    const config: TableConfig<any> = {
      id: 't-trunc',
      columns: [
        { key: 'name', accessor: 'name', header: 'Name', type: 'text', _computedWidth: '40px' }
      ],
      pagination: { enabled: false }
    } as any;

    const data = [{ id: 1, name: 'VeryLongProductName' }];

    const { container } = render(<TableRenderer config={config} data={data} />);

    const cell = container.querySelector('.dui-table-body td');
    expect(cell).toBeTruthy();
    expect(cell?.textContent).toMatch(/…$/); // ends with ellipsis
    // Should be truncated to at most 6 chars + ellipsis
    expect(cell?.textContent?.replace(/\s+/g, '')?.length).toBeLessThanOrEqual(7);
  });
});
