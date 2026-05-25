export const stripPromptInjection = (value = '') =>
  String(value)
    .replace(/ignore (all|previous|above) instructions/gi, '[filtered]')
    .replace(/system prompt/gi, '[filtered]')
    .trim();

export const safeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
