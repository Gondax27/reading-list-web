const authorTests = [
  ['Rowling quoted', 'subject:fiction AND author_name:"Rowling"'],
  ['Rowling unquoted', 'subject:fiction AND author_name:Rowling'],
  ['Garcia quoted', 'subject:fiction AND author_name:"Garcia"'],
  ['Garcia unquoted', 'subject:fiction AND author_name:Garcia'],
  ['JK Rowling quoted', 'subject:fiction AND author_name:"J.K. Rowling"'],
  ['Martinez partial', 'subject:fiction AND author_name:Martinez'],
  ['Martinez quoted', 'subject:fiction AND author_name:"Martinez"'],
];

for (const [name, q] of authorTests) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=1&fields=title`;
  const json = await fetch(url, { headers: { 'User-Agent': 'test/1.0' } }).then((r) => r.json());
  console.log(name.padEnd(20), json.detail ? 'ERR' : json.numFound);
}

const borrowable = 'subject:fiction AND ebook_access:borrowable';
const b = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(borrowable)}&limit=1`).then((r) => r.json());
console.log('borrowable', b.numFound);

// Test actual production URL builder output via importing from vitest instead
console.log('\nDone');
