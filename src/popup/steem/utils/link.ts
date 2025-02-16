const OLD_DOMAINS = [
  'busy.org',
  'esteem.app',
  'steempeak.com',
  'partiko.app',
  'chainbb.com',
  'utopian.io',
  'steemkr.com',
  'strimi.pl',
  'steemhunt.com',
  'ulogs.org',
  'hede.io',
  'naturalmedicine.io',
  'steemit.com',
];

export function replaceOldDomains(link?: string) {
  if (!link) return '/';
  const regex = new RegExp(OLD_DOMAINS.join('|'), 'g');
  return `${link
    .replace(regex, 'steempro.com')
    .replace('~witnesses', 'witnesses')}`;
}
