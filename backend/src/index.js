const express = require('express');
const cors = require('cors');
const path = require('path');
const { searchHandler } = require('./controllers/searchController');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/search', searchHandler);

app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'ArticleSearcher backend' });
});

const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('*', (_req, res) => {
  const indexPath = path.join(publicDir, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).end();
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
