# ArticleSearcher

Full-stack demo using Angular (frontend) and Node/Express (backend) with an MVC-style backend structure to search PLOS articles.

## Structure

- frontend/ — Angular app (standalone components, SSR-ready)
- backend/ — Express server
  - src/controllers/searchController.js
  - src/services/plosService.js
  - src/models/article.js

## Run locally

1. Start backend:

```powershell
Push-Location "C:\Users\andra\OneDrive\Desktop\ESPE - ISOW\QUINTO_SEMESTRE\AWD\P3\ArticleSearcher\backend"
npm run dev
```

2. Start frontend:

```powershell
Push-Location "C:\Users\andra\OneDrive\Desktop\ESPE - ISOW\QUINTO_SEMESTRE\AWD\P3\ArticleSearcher\frontend"
npm start
```

Open http://localhost:4200 and search using keywords (e.g., "university"). Results show:
- #: incremental number in the list
- Article Title
- Published: formatted as day month year (e.g., 22 August 2022)
- DOI: link to https://doi.org/<doi>

## Notes
- Backend proxies the PLOS Search API: https://api.plos.org/search
- CORS enabled for local development.

## Docker (Render-friendly single container)

Build image:

```powershell
Push-Location "C:\Users\andra\OneDrive\Desktop\ESPE - ISOW\QUINTO_SEMESTRE\AWD\P3\ArticleSearcher"
docker build -t article-searcher:local .
```

Run container:

```powershell
docker run -p 3000:3000 article-searcher:local
```

Then open http://localhost:3000. The container serves the built Angular app and the `/search` API.

Render settings (example):
- Deploy type: Docker
- Docker command: leave blank to use CMD from Dockerfile
- Expose port: 3000
