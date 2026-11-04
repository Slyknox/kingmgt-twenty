import { type Currency } from 'src/utils/lead-conversion-types';

export const DEFAULT_CURRENCY_CODE = 'USD';

export const hasAmount = (
  value: Currency | null | undefined,
): value is { amountMicros: number; currencyCode?: string | null } =>
  typeof value?.amountMicros === 'number' && Number.isFinite(value.amountMicros);

// Twenty stores an empty currency as a null amount that keeps a currency code.
export const emptyCurrency = (currencyCode?: string | null) => ({
  amountMicros: null,
  currencyCode: currencyCode || DEFAULT_CURRENCY_CODE,
});

export const isSameCurrencyValue = (
  left: Currency | null | undefined,
  right: Currency | null | undefined,
): boolean => {
  if (!hasAmount(left) || !hasAmount(right)) {
    return !hasAmount(left) && !hasAmount(right);
  }

  return (
    left.amountMicros === right.amountMicros &&
    (left.currencyCode ?? '') === (right.currencyCode ?? '')
  );
};
