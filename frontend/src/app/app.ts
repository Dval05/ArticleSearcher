import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DatePipe],
  template: `
    <main class="page">
      <header class="hero">
        <p class="eyebrow">Angular + PLOS API --> Search articles by keywords. </p>
        <h1>Article Searcher by Danna Andrade</h1>
        <p class="sub"></p>
      </header>

      <section class="card search-card">
        <div class="search-row">
          <input #q
            type="text"
            placeholder="Enter keywords (e.g., university, climate)"
            [value]="query()"
            (input)="query.set(q.value)"
            (keyup.enter)="search()"
            aria-label="Search keywords"
          />
          <button class="primary" (click)="search()">Search</button>
        </div>
        <p class="hint">Tip: use a few words; up to 20 results are shown.</p>
        @if (loading()) {
          <p class="status">Loading results…</p>
        }
        @if (error()) {
          <p class="status error">{{ error() }}</p>
        }
      </section>

      <section class="card results-card">
        <div class="results-header">
          @if (results().length > 0) {
            <p class="result-count">Showing {{ (page() - 1) * rowsPerPage + 1 }}–{{ Math.min(page() * rowsPerPage, total()) }} of {{ total() }} results</p>
          }
        </div>
        <div class="table-wrapper">
          <table>
            <thead>
              <tr>
                <th style="width: 60px;">#</th>
                <th>Article Title</th>
                <th style="width: 180px;">Published</th>
                <th style="width: 240px;">DOI</th>
              </tr>
            </thead>
            <tbody>
              @if (!results().length && !loading()) {
                <tr><td colspan="4" class="empty">No results yet. Try a search.</td></tr>
              }
              @for (item of results(); track item.index) {
                <tr>
                  <td>{{ item.index }}</td>
                  <td>{{ item.title }}</td>
                  <td>{{ item.publicationDate | date: 'dd MMMM yyyy' }}</td>
                  <td>
                    @if (item.doi) {
                      <a [href]="'https://doi.org/' + item.doi" target="_blank" rel="noopener">{{ item.doi }}</a>
                    } @else {
                      <span>-</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        @if (totalPages > 1) {
          <div class="pagination">
            <button class="pagination-btn" (click)="goToPage(page() - 1)" [disabled]="!canPrevious">← Previous</button>
            @if (visiblePages[0] > 1) {
              <button class="pagination-btn" (click)="goToPage(1)">1</button>
              @if (visiblePages[0] > 2) {
                <span class="pagination-ellipsis">…</span>
              }
            }
            @for (p of visiblePages; track p) {
              <button class="pagination-btn" [class.active]="p === page()" (click)="goToPage(p)">{{ p }}</button>
            }
            @if (visiblePages[visiblePages.length - 1] < totalPages) {
              @if (visiblePages[visiblePages.length - 1] < totalPages - 1) {
                <span class="pagination-ellipsis">…</span>
              }
              <button class="pagination-btn" (click)="goToPage(totalPages)">{{ totalPages }}</button>
            }
            <button class="pagination-btn" (click)="goToPage(page() + 1)" [disabled]="!canNext">Next →</button>
          </div>
        }
      </section>
    </main>
  `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Article Searcher');
  protected readonly Math = Math;

  private http = inject(HttpClient);

  query = signal('');
  page = signal(1);
  rowsPerPage = 20;
  loading = signal(false);
  error = signal<string | null>(null);
  total = signal(0);
  results = signal<Array<{ index: number; title: string; publicationDate: string | null; doi: string | null }>>([]);

  search() {
    this.page.set(1);
    this.performSearch();
  }

  goToPage(p: number) {
    this.page.set(p);
    this.performSearch();
  }

  private performSearch() {
    const q = this.query().trim();
    this.loading.set(true);
    this.error.set(null);
    this.results.set([]);
    const page = this.page();
    const url = `/search?q=${encodeURIComponent(q)}&page=${page}&rows=${this.rowsPerPage}`;
    this.http.get<{ total: number; results: Array<{ index: number; title: string; publicationDate: string | null; doi: string | null }>; page: number; rows: number }>(url)
      .subscribe({
        next: (data) => {
          this.total.set(data.total ?? 0);
          this.results.set(data.results ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to search articles.');
          this.loading.set(false);
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.total() / this.rowsPerPage);
  }

  get canPrevious(): boolean {
    return this.page() > 1;
  }

  get canNext(): boolean {
    return this.page() < this.totalPages;
  }

  get visiblePages(): number[] {
    const current = this.page();
    const total = this.totalPages;
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, current + 2);

    if (end - start + 1 < maxVisible) {
      if (start === 1) {
        end = Math.min(total, start + maxVisible - 1);
      } else {
        start = Math.max(1, end - maxVisible + 1);
      }
    }

    const pages: number[] = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
