const { searchArticles } = require('../services/plosService');

async function searchHandler(req, res) {
  try {
    const q = (req.query.q || '').toString();
    const rows = parseInt(req.query.rows || '20', 10);
    const page = parseInt(req.query.page || '1', 10);
    const start = (page - 1) * rows;
    const { total, results } = await searchArticles(q, rows, start);
    res.json({ total, results, page, rows });
  } catch (err) {
    console.error('Search error:', err.message);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}

module.exports = { searchHandler };
