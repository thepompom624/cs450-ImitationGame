# AI guidelines (cs450-ImitationGame)

These notes summarize repository intent so future automation stays aligned with the team.

## Product

Minimal “IMDb-style” browser over six relational tables: **Movie**, **People**, **Actor**, **Director**, **Writer**, **ActsIn**. Static **HTML, CSS, and JavaScript**; data files are **CSV** under `assets/csv_files/` (files renamed to table names: `Movie.csv`, `People.csv`, etc.).

## Planned features (for humans to implement)

1. View all movies, actors, directors, and writers.
2. Filter movies by genre, year, and title.
3. Movie detail view: full movie fields and cast (via **ActsIn** + **People**).

## Division of labor (from README)

- **Frontend:** layout, navigation, styling, and **hooks** (IDs, semantic regions, filter controls) so the three features can be wired without restructuring pages.
- **Data / “backend” in the browser:** `js/data.js` is **skeleton only**—named functions, no loading or parsing logic—until a teammate implements CSV fetch/parse and joins.

## Design tokens (from FRONTEND.md)

- **Font:** Courier New (stack with monospace fallbacks).
- **Palette:** `#EAD2AC`, `#DF928E`, `#C58882`, `#D1DEDE`, `#1D201F`.
- **Logo:** `assets/images/imitationgamelogo.png`.
- **Chrome:** Header/nav with logo; primary sections—Home, Movies, Actors, Directors, Writers.

## What AI agents should not do without explicit team request

- Implement the three features end-to-end (real listings from CSV, working filters, populated detail pages).
- Replace CSV with another storage layer unless the course or team changes requirements.
- Large unrelated refactors or new frameworks.

## Local preview

Static files work from disk, but when you implement CSV loading with `fetch()`, use a local HTTP server (for example `python -m http.server` from the repo root) so browser security rules do not block file requests.

## References in repo

- `README.md` — deliverables and stack.
- `FRONTEND.md` — visual and IA notes.
- `SCRIPT.md` — presentation outline.
- `RESOURCES.md` — external docs/spreadsheets.