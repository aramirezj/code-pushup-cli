import {
  MAX_DESCRIPTION_LENGTH,
  MAX_ISSUE_MESSAGE_LENGTH,
  MAX_TITLE_LENGTH,
} from '@code-pushup/models';

export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+|\//g, '-')
    .replace(/[^a-z\d-]/g, '');
}

export function pluralize(text: string, amount?: number): string {
  if (amount != null && Math.abs(amount) === 1) {
    return text;
  }

  if (text.endsWith('y')) {
    return `${text.slice(0, -1)}ies`;
  }
  if (text.endsWith('s')) {
    return `${text}es`;
  }
  return `${text}s`;
}

export function formatBytes(bytes: number, decimals = 2) {
  const positiveBytes = Math.max(bytes, 0);

  // early exit
  if (positiveBytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const dm = Math.max(decimals, 0);
  const sizes = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(positiveBytes) / Math.log(k));

  return `${Number.parseFloat((positiveBytes / Math.pow(k, i)).toFixed(dm))} ${
    sizes[i]
  }`;
}

export function pluralizeToken(token: string, times: number): string {
  return `${times} ${Math.abs(times) === 1 ? token : pluralize(token)}`;
}

export function formatDuration(duration: number, granularity = 0): string {
  if (duration < 1000) {
    return `${granularity ? duration.toFixed(granularity) : duration} ms`;
  }
  return `${(duration / 1000).toFixed(2)} s`;
}

export function formatDate(date: Date): string {
  const locale = 'en-US'; // fixed locale to ensure consistency across local defaults execution
  return date
    .toLocaleString(locale, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })
    .replace(/\u202F/g, ' '); // see https://github.com/nodejs/node/issues/45171
}

export function truncateText(
  text: string,
  options:
    | number
    | {
        maxChars: number;
        position?: 'start' | 'middle' | 'end';
        ellipsis?: string;
      },
): string {
  const {
    maxChars,
    position = 'end',
    ellipsis = '...',
  } = typeof options === 'number' ? { maxChars: options } : options;
  if (text.length <= maxChars) {
    return text;
  }

  const maxLength = maxChars - ellipsis.length;
  switch (position) {
    case 'start':
      return ellipsis + text.slice(-maxLength).trim();
    case 'middle':
      const halfMaxChars = Math.floor(maxLength / 2);
      return (
        text.slice(0, halfMaxChars).trim() +
        ellipsis +
        text.slice(-halfMaxChars).trim()
      );
    case 'end':
      return text.slice(0, maxLength).trim() + ellipsis;
  }
}

export function truncateTitle(text: string): string {
  return truncateText(text, MAX_TITLE_LENGTH);
}

export function truncateDescription(text: string): string {
  return truncateText(text, MAX_DESCRIPTION_LENGTH);
}

export function truncateIssueMessage(text: string): string {
  return truncateText(text, MAX_ISSUE_MESSAGE_LENGTH);
}
