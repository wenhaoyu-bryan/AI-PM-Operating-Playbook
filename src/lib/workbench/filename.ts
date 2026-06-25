export function sanitizeFilename(name: string, suffix: string): string {
  const trimmed = (name || '').trim();

  // Replace characters that are not alphanumeric, CJK, or common safe chars
  const sanitized = trimmed
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/[^\w一-鿿㐀-䶿豈-﫿　-〿-]/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');

  const base = sanitized.length > 0 ? sanitized : 'operating-playbook';
  const truncated = base.length > 60 ? base.slice(0, 60).replace(/-+$/, '') : base;

  return truncated + suffix;
}
