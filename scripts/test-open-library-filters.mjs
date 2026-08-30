const tests = [
  ['subject:fiction', 'subject:fiction'],
  ['subject:fantasy', 'subject:fantasy'],
  ['subject_key:fantasy', 'subject_key:fantasy'],
  ['subject:science_fiction', 'subject:science_fiction'],
  ['subject_key:science_fiction', 'subject_key:science_fiction'],
  ['subject sci fi quoted', 'subject:"science fiction"'],
  ['subject:mystery', 'subject:mystery'],
  ['subject_key:mystery', 'subject_key:mystery'],
  ['subject:romance', 'subject:romance'],
  ['subject:horror', 'subject:horror'],
  ['subject:history', 'subject:history'],
  ['subject:biography', 'subject:biography'],
  ['subject_key:biography', 'subject_key:biography'],
  ['subject:poetry', 'subject:poetry'],
  ['subject_key:poetry', 'subject_key:poetry'],
  ['lang fre', 'subject:fiction AND language:fre'],
  ['lang ger', 'subject:fiction AND language:ger'],
  ['lang por', 'subject:fiction AND language:por'],
  ['ebook no_ebook', 'subject:fiction AND ebook_access:no_ebook'],
  ['year', 'subject:fiction AND first_publish_year:[1990 TO 2020]'],
  ['author partial', 'subject:fiction AND author_name:Tolkien'],
  ['author exact', 'subject:fiction AND author_name:"Tolkien"'],
  ['fantasy+spa subject', 'subject:fantasy AND language:spa'],
  ['fantasy+spa subject_key', 'subject_key:fantasy AND language:spa'],
  ['biography+spa', 'subject:biography AND language:spa'],
  ['poetry+spa', 'subject:poetry AND language:spa'],
  ['history subject_key', 'subject_key:history'],
  ['horror subject_key', 'subject_key:horror'],
];

for (const [name, q] of tests) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=1&fields=key,title`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'reading-list-web-test/1.0' },
  });
  const json = await response.json();

  if (json.detail) {
    console.log(`${name.padEnd(24)} ERR  ${JSON.stringify(json.detail).slice(0, 100)}`);
    continue;
  }

  const count = json.numFound ?? json.num_found ?? 0;
  const flag = count === 0 ? 'ZERO' : ' OK ';
  console.log(`${name.padEnd(24)} ${flag} ${String(count).padStart(10)}  ${q}`);
}
