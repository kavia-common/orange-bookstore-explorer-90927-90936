//
// Formatting utilities for consistent presentation across the app.
//

// PUBLIC_INTERFACE
export function formatCurrency(value, options = {}) {
  /**
   * Format a numeric value as currency using Intl.NumberFormat with safe fallbacks.
   * Params:
   *  - value: number|string|null|undefined
   *  - options: {
   *      locale?: string,           // e.g. 'en-US' (defaults to browser/undefined)
   *      currency?: string,         // e.g. 'USD', 'EUR' (defaults to 'USD')
   *      minimumFractionDigits?: number, // default 2
   *      maximumFractionDigits?: number, // default 2
   *    }
   * Returns:
   *  - string like "$12.99" or "€9.50"
   */
  const {
    locale = undefined,
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options || {};

  const num = Number(value ?? 0);
  if (Number.isNaN(num)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(num);
  } catch {
    // Fallback basic formatting if Intl or currency code fails
    const sign = currency === 'USD' ? '$' : '';
    return `${sign}${num.toFixed(Math.max(0, minimumFractionDigits))}`;
  }
}
