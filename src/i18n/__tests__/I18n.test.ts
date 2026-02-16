import { initI18n, getI18n } from '../I18n';

describe('I18n merge behavior', () => {
  beforeEach(() => {
    // Reset global instance
    initI18n();
  });

  it('merges translations passed to initI18n with defaults', () => {
    const customEn = { table: { showing: 'Showing CUSTOM {from} to {to} of {total}' } } as any;
    initI18n({ translations: { en: customEn }, defaultLocale: 'en' });
    const i18n = getI18n();

    expect(i18n.t('table.showing')).toBe('Showing CUSTOM {from} to {to} of {total}');
    // Non-overridden key stays from default
    expect(i18n.t('table.empty')).toBe(':(');
  });

  it('addTranslations deep merges nested keys', () => {
    initI18n();
    const i18n = getI18n();

    i18n.addTranslations('en', { table: { showing: 'Merged showing' } } as any);
    expect(i18n.t('table.showing')).toBe('Merged showing');
    // other keys remain
    expect(i18n.t('table.empty')).toBe(':(');
  });

  it('resolveLabel uses translation when available', () => {
    initI18n();
    const i18n = getI18n();

    // existing key
    expect(i18n.resolveLabel('table.empty')).toBe(':(');
  });

  it('resolveLabel humanizes last segment when missing', () => {
    initI18n();
    const i18n = getI18n();

    expect(i18n.resolveLabel('sales.fields.total')).toBe('Total');
    expect(i18n.resolveLabel('client.contact_name')).toBe('Contact Name');
    expect(i18n.resolveLabel('someMissingKey')).toBe('Some Missing Key');
  });

  it('resolveLabel respects provided fallback', () => {
    initI18n();
    const i18n = getI18n();

    expect(i18n.resolveLabel('nonexistent.key', 'Fallback Label')).toBe('Fallback Label');
  });
});
