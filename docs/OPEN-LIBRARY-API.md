# Open Library Search API — Referencia oficial para filtros

Documentación base usada en este proyecto:

- [Search API](https://openlibrary.org/dev/docs/api/search)
- [Search Tips (HowTo)](https://openlibrary.org/search/howto)
- [Query cheatsheet (HowTo extended)](https://openlibrary.org/search/howto/more)

---

## Endpoint

```http
GET https://openlibrary.org/search.json?q={query}&fields={fields}&limit={n}&offset={n}
```

Parámetros adicionales: `sort`, `lang`, `page`.

---

## Mapeo UI → API (implementado en `src/services/library.ts`)

| Filtro UI | Campo Solr oficial | Ejemplo | Notas |
| :--- | :--- | :--- | :--- |
| Todas (materia) | `subject:fiction` | `subject:fiction` | Query base por defecto |
| Materia concreta | `subject:` | `subject:fantasy` | Búsqueda difusa (método principal oficial) |
| Idioma (exclusión) | `language:` | `language:spa` | ISO **639-2** de 3 letras (`eng`, `spa`, `fre`…) |
| Idioma (preferencia) | param `lang` | `lang=es` | ISO **639-1** de 2 letras; no excluye, prioriza edición |
| Autor | `author:` | `author:Tolkien` | Parcial; con espacios: `author:"Gabriel Garcia"` |
| Búsqueda libre | término sin campo | `dune` | Mínimo 3 caracteres |
| Año | `first_publish_year:` | `first_publish_year:[1990 TO 2020]` | Año de primera publicación de la obra |
| Ebook | `ebook_access:` | `ebook_access:public` | Valores: `no_ebook`, `borrowable`, `public`, `printdisabled`, `unclassified` |
| Orden | param `sort` | `sort=new` | `new`, `old`, `random`, `key`; omitir = relevancia |

---

## Paginación

| Param | Descripción |
| :--- | :--- |
| `limit` | Tamaño de página (30 en la app) |
| `offset` | Desplazamiento (`0`, `30`, `60`…) |
| `page` | Alternativa; empieza en `1` |

Respuesta: `numFound`, `start`, `docs[]`.

---

## Cuándo no hay resultados (comportamiento esperado)

Según la [FAQ oficial](https://openlibrary.org/search/howto/more#faq--debugging-queries):

- Combinar muchos filtros restrictivos puede devolver `numFound: 0` de forma legítima.
- `subject:` es **difuso**; no hay lista maestra de materias.
- Rangos de años invertidos no devuelven obras.
- Búsquedas libres de menos de 3 caracteres no se envían a la API.

---

## Coincidencia exacta de materia (opcional)

Para búsquedas exactas: `subject_key:fantasy` (normalizado: minúsculas, espacios → `_`).

La app usa `subject:` por defecto para maximizar resultados según la guía oficial.
