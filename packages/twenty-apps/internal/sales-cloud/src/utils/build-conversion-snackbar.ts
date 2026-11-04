import { type ConvertLeadsResult } from 'src/utils/lead-conversion-types';

type Snackbar = {
  message: string;
  variant: 'success' | 'warning' | 'error';
  detailedMessage?: string;
};

const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;

export const buildConversionSnackbar = ({
  total,
  converted,
  skipped,
  failed,
  results,
}: ConvertLeadsResult): Snackbar => {
  const firstError = results.find((result) => result.status === 'failed');
  const detailedMessage =
    firstError?.status === 'failed' ? firstError.error : undefined;

  if (failed === 0 && converted > 0) {
    return {
      message:
        skipped > 0
          ? `Converted ${plural(converted, 'lead')}, ${skipped} already converted.`
          : `Converted ${plural(converted, 'lead')}.`,
      variant: 'success',
    };
  }

  if (failed === 0) {
    return {
      message:
        total === 1 ? 'Lead was already converted.' : 'Leads were already converted.',
      variant: 'warning',
    };
  }

  if (converted === 0) {
    return { message: 'Lead conversion failed', variant: 'error', detailedMessage };
  }

  return {
    message: `Converted ${converted} of ${plural(total, 'lead')}; ${failed} failed.`,
    variant: 'warning',
    detailedMessage,
  };
};
