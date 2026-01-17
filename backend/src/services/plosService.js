const axios = require('axios');

const PLOS_BASE_URL = 'https://api.plos.org/search';

async function searchArticles(query, rows = 20, start = 0) {
  const q = query && query.trim().length ? `title:${query}` : '*:*';
  const params = new URLSearchParams({ q, rows: String(rows), start: String(start) });
  const url = `${PLOS_BASE_URL}?${params.toString()}`;
  const { data } = await axios.get(url, { timeout: 10000 });
  const response = data && data.response ? data.response : {};
  const docs = response.docs || [];
  const total = response.numFound || 0;
  return {
    total,
    results: docs.map((doc, idx) => ({
      index: start + idx + 1,
      title: doc.title_display || doc.title || '',
      publicationDate: doc.publication_date || doc.published || null,
      doi: doc.id || null,
    })),
  };
}

module.exports = { searchArticles };
