import React from 'react';
import { render, screen } from '@testing-library/react';
import { initI18n, getI18n } from '../../i18n/I18n';
import { FormRenderer } from '../FormRenderer';

describe('FormRenderer labels and sections', () => {
  beforeEach(() => initI18n());

  it('humanizes field label and section title when translations missing', () => {
    const config = {
      sections: [
        {
          id: 'status',
          title: 'product.sections.status',
          columns: 1,
          fields: [
            { name: 'isActive', label: 'product.fields.isActive', type: 'switch' },
          ]
        }
      ]
    } as any;

    render(<FormRenderer config={config} />);

    // Section title humanized from 'status' -> 'Status'
    expect(screen.getByText('Status')).toBeInTheDocument();

    // Field label humanized from 'isActive' -> 'Is Active'
    expect(screen.getByText('Is Active')).toBeInTheDocument();
  });

  it('uses translation when available', () => {
    initI18n({ translations: { en: { product: { fields: { isActive: 'Active?', }, sections: { status: 'State' } } }, defaultLocale: 'en' } as any });

    const config = {
      sections: [
        {
          id: 'status',
          title: 'product.sections.status',
          columns: 1,
          fields: [
            { name: 'isActive', label: 'product.fields.isActive', type: 'switch' },
          ]
        }
      ]
    } as any;

    render(<FormRenderer config={config} />);

    expect(screen.getByText('State')).toBeInTheDocument();
    expect(screen.getByText('Active?')).toBeInTheDocument();
  });
});