const tests = [
  ['author:solnit', 'subject:literature AND author:solnit'],
  ['author_name:solnit', 'subject:literature AND author_name:solnit'],
  ['author:Tolkien', 'subject:literature AND author:Tolkien'],
  ['author_name:Tolkien', 'subject:literature AND author_name:Tolkien'],
  ['lang param es', null, 'language:spa', 'es'],
  ['lang param spa wrong?', null, 'language:spa', 'spa'],
  ['subject_key science fiction', 'subject_key:science_fiction'],
  ['subject science fiction fuzzy', 'subject:"science fiction"'],
  ['subject_key sci fi wrong', 'subject_key:sci-fi'],
];

for (const row of tests) {
  const [name, q, langFilter, langParam] = row;
  if (q) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=1&fields=key,title`;
    const json = await fetch(url, { headers: { 'User-Agent': 'test/1.0' } }).then((r) => r.json());
    console.log(name.padEnd(28), json.detail ? 'ERR' : json.numFound);
    continue;
  }

  const query = langFilter;
  const url = new URL('https://openlibrary.org/search.json');
  url.searchParams.set('q', query);
  url.searchParams.set('limit', '1');
  url.searchParams.set('fields', 'key,title');
  url.searchParams.set('lang', langParam);
  const json = await fetch(url, { headers: { 'User-Agent': 'test/1.0' } }).then((r) => r.json());
  console.log(name.padEnd(28), json.detail ? 'ERR' : json.numFound, `(lang=${langParam})`);
}
