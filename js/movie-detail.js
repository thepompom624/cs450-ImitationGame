function personFullName(p) {
  if (!p) return "—";
  return `${String(p.first_name ?? "").trim()} ${String(p.last_name ?? "").trim()}`.trim() || "—";
}

function appendDetailRow(tbody, label, value) {
  const tr = document.createElement("tr");
  const th = document.createElement("th");
  th.scope = "row";
  th.textContent = label;
  const td = document.createElement("td");
  td.textContent = value != null && value !== "" ? String(value) : "—";
  tr.append(th, td);
  tbody.appendChild(tr);
}

function displayMovieDetail(movie, fieldsEl, castEl) {
  if (!fieldsEl || !castEl) return;

  fieldsEl.replaceChildren();

  const table = document.createElement("table");
  table.className = "movie-table movie-detail-table";
  const tbody = document.createElement("tbody");

  const director = getPersonById(movie.director_id);
  const writer = getPersonById(movie.writer_id);

  appendDetailRow(tbody, "Movie ID", movie.movie_id);
  appendDetailRow(tbody, "Year", movie.Year);
  appendDetailRow(tbody, "Runtime (minutes)", movie.runtime_min);
  appendDetailRow(tbody, "Country", movie.country_of_origin);
  appendDetailRow(tbody, "Genre", movie.genre);
  appendDetailRow(tbody, "Director", personFullName(director));
  appendDetailRow(tbody, "Writer", personFullName(writer));
  appendDetailRow(tbody, "Plot", movie.plot_summary);

  table.appendChild(tbody);
  fieldsEl.appendChild(table);

  const cast = getCastForMovie(movie.movie_id);
  displayPersonRows(cast, castEl);
}

function movieIdFromLocation() {
  const params = new URLSearchParams(window.location.search);
  let id = params.get("id");
  if (id != null) id = id.trim();
  if (id) return id;
  const hash = window.location.hash.replace(/^#/, "").trim();
  return hash || null;
}

function initMovieDetailPage() {
  const titleEl = document.getElementById("movie-detail-title");
  const taglineEl = document.getElementById("movie-detail-tagline");
  const fieldsEl = document.getElementById("movie-detail-fields");
  const castEl = document.getElementById("movie-detail-cast");
  if (!titleEl || !fieldsEl || !castEl) return;

  const id = movieIdFromLocation();

  if (!window.dataReady) {
    titleEl.textContent = "Could not load data";
    showDataLoadError(fieldsEl);
    return;
  }

  window.dataReady
    .then(() => {
      if (!id) {
        titleEl.textContent = "Movie not found";
        if (taglineEl) {
          taglineEl.textContent = "No movie id in the URL. Open a movie from the movies list.";
        }
        fieldsEl.replaceChildren();
        castEl.innerHTML =
          '<p class="muted" style="margin:0">Add <code>?id=101</code> or <code>#101</code> with a valid <code>movie_id</code>.</p>';
        return;
      }

      const movie = getMovieById(id);
      if (!movie) {
        titleEl.textContent = "Movie not found";
        if (taglineEl) {
          taglineEl.textContent = `No movie with id ${id}.`;
        }
        fieldsEl.replaceChildren();
        castEl.innerHTML = '<p class="muted" style="margin:0">Unknown movie; cast not available.</p>';
        return;
      }

      titleEl.textContent = String(movie.Title ?? "Untitled");
      document.title = `${titleEl.textContent} — Imitation Game`;
      if (taglineEl) {
        taglineEl.textContent =
          `${movie.genre ?? ""}${movie.Year != null ? ` · ${movie.Year}` : ""}`.trim() || "Movie details";
      }

      displayMovieDetail(movie, fieldsEl, castEl);
    })
    .catch(() => {
      titleEl.textContent = "Could not load data";
      if (taglineEl) taglineEl.textContent = "";
      showDataLoadError(fieldsEl);
      showDataLoadError(castEl);
    });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMovieDetailPage);
} else {
  initMovieDetailPage();
}

window.displayMovieDetail = displayMovieDetail;
