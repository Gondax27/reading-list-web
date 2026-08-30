import { readFileSync } from 'node:fs';

// Inline query builder mirroring production logic for probe script
const buildOpenLibraryQuery = (filters) => {
  const parts = [];
  parts.push(filters.subject ? `subject:${filters.subject}` : 'subject:fiction');

  if (filters.language) parts.push(`language:${filters.language}`);
  if (filters.author?.trim()) parts.push(`author_name:"${filters.author.trim().replace(/"/g, '\\"')}"`);
  if (filters.search?.trim().length >= 3) parts.push(filters.search.trim());
  if (filters.yearFrom || filters.yearTo) {
    parts.push(`first_publish_year:[${filters.yearFrom || '*'} TO ${filters.yearTo || '*'}]`);
  }
  if (filters.ebookAccess) parts.push(`ebook_access:${filters.ebookAccess}`);

  return parts.join(' AND ');
};

const DEFAULT = {
  search: '',
  subject: '',
  author: '',
  language: '',
  sort: 'relevance',
  yearFrom: '',
  yearTo: '',
  ebookAccess: '',
};

const subjects = ['', 'fiction', 'fantasy', 'science_fiction', 'mystery', 'romance', 'horror', 'history', 'biography', 'poetry'];
const languages = ['', 'spa', 'eng', 'fre', 'ger', 'por'];
const ebooks = ['', 'public', 'borrowable', 'no_ebook'];
const sorts = ['relevance', 'new', 'old', 'random'];

async function probe(name, filters) {
  const q = buildOpenLibraryQuery(filters);
  const params = new URLSearchParams({
    q,
    fields: 'key,title',
    limit: '1',
    offset: '0',
  });
  if (filters.sort !== 'relevance') params.set('sort', filters.sort);

  const url = `https://openlibrary.org/search.json?${params.toString()}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'reading-list-web-test/1.0' } });
  const json = await response.json();

  if (json.detail) {
    console.log(`FAIL ${name} | ${JSON.stringify(json.detail).slice(0, 120)} | ${q}`);
    return 'fail';
  }

  const count = json.numFound ?? 0;
  if (count === 0) {
    console.log(`ZERO ${name} | ${q}`);
    return 'zero';
  }

  return 'ok';
}

let fails = 0;
let zeros = 0;

for (const subject of subjects) {
  for (const language of languages) {
    const filters = { ...DEFAULT, subject, language };
    const result = await probe(`subject=${subject || 'default'}+lang=${language || 'all'}`, filters);
    if (result === 'fail') fails++;
    if (result === 'zero') zeros++;
  }
}

for (const ebookAccess of ebooks) {
  if (!ebookAccess) continue;
  for (const sort of sorts) {
    const filters = { ...DEFAULT, ebookAccess, sort };
    const result = await probe(`ebook=${ebookAccess}+sort=${sort}`, filters);
    if (result === 'fail') fails++;
    if (result === 'zero') zeros++;
  }
}

for (const subject of subjects) {
  if (!subject || subject === 'fiction') continue;
  for (const sort of sorts) {
    if (sort === 'relevance') continue;
    const filters = { ...DEFAULT, subject, sort };
    const result = await probe(`subject=${subject}+sort=${sort}`, filters);
    if (result === 'fail') fails++;
    if (result === 'zero') zeros++;
  }
}

// Edge cases seen in UI
const edgeCases = [
  ['author 2 chars ignored in q but still in store?', { ...DEFAULT, author: 'Jo' }],
  ['year only from', { ...DEFAULT, yearFrom: '2020' }],
  ['year only to', { ...DEFAULT, yearTo: '2000' }],
  ['year inverted', { ...DEFAULT, yearFrom: '2020', yearTo: '1990' }],
  ['search 3 chars + biography', { ...DEFAULT, subject: 'biography', search: 'life' }],
  ['borrowable + fantasy + spa', { ...DEFAULT, subject: 'fantasy', language: 'spa', ebookAccess: 'borrowable' }],
  ['public + poetry + ger', { ...DEFAULT, subject: 'poetry', language: 'ger', ebookAccess: 'public' }],
  ['history + ebook public', { ...DEFAULT, subject: 'history', ebookAccess: 'public' }],
  ['random + horror + fre', { ...DEFAULT, subject: 'horror', language: 'fre', sort: 'random' }],
];

for (const [name, filters] of edgeCases) {
  const result = await probe(name, filters);
  if (result === 'fail') fails++;
  if (result === 'zero') zeros++;
}

console.log(`\nSummary: fails=${fails}, zeros=${zeros}`);
