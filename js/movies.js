/**
 * Renders movie rows into a container (table: title, year, genre).
 * @param {object[]} movies Rows from Movie.csv (already sorted if desired)
 * @param {HTMLElement} container Element to replace contents of (e.g. #movie-list)
 */
function displayMovieRows(movies, container) {
  if (!container) return;

  container.replaceChildren();

  const table = document.createElement("table");
  table.className = "movie-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const label of ["Title", "Year", "Genre"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);

  const tbody = document.createElement("tbody");
  for (const m of movies) {
    const tr = document.createElement("tr");
    const id = String(m.movie_id ?? "");

    const tdTitle = document.createElement("td");
    const link = document.createElement("a");
    link.href = `movie-detail.html?id=${encodeURIComponent(id)}`;
    link.textContent = String(m.Title ?? "");
    tdTitle.appendChild(link);

    const tdYear = document.createElement("td");
    tdYear.textContent = m.Year != null && m.Year !== "" ? String(m.Year) : "";

    const tdGenre = document.createElement("td");
    tdGenre.textContent = String(m.genre ?? "");

    tr.append(tdTitle, tdYear, tdGenre);
    tbody.appendChild(tr);
  }

  table.append(thead, tbody);
  container.appendChild(table);
}

function initMoviesPage() {
  const container = document.getElementById("movie-list");
  const sortSelect = document.getElementById("movie-sort");
  if (!container) return;

  function refresh() {
    const sortKey = sortSelect ? sortSelect.value : "title-asc";
    const sorted = sortMovies(getAllMovies(), sortKey);
    displayMovieRows(sorted, container);
  }

  window.dataReady.then(refresh).catch(() => showDataLoadError(container));

  sortSelect?.addEventListener("change", refresh);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMoviesPage);
} else {
  initMoviesPage();
}

window.displayMovieRows = displayMovieRows;
