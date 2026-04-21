/**
 * Renders people rows (first name, last name, person id).
 * @param {object[]} people Rows from People (or role-filtered subsets)
 * @param {HTMLElement} container
 */
function displayPersonRows(people, container) {
  if (!container) return;

  const sorted = [...people].sort((a, b) => {
    const lastCmp = String(a.last_name ?? "").localeCompare(
      String(b.last_name ?? ""),
      undefined,
      { sensitivity: "base" }
    );
    if (lastCmp !== 0) return lastCmp;
    return String(a.first_name ?? "").localeCompare(String(b.first_name ?? ""), undefined, {
      sensitivity: "base",
    });
  });

  container.replaceChildren();

  const table = document.createElement("table");
  table.className = "movie-table";

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const label of ["First name", "Last name", "Person ID"]) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = label;
    headRow.appendChild(th);
  }
  thead.appendChild(headRow);

  const tbody = document.createElement("tbody");
  for (const p of sorted) {
    const tr = document.createElement("tr");
    const tdFirst = document.createElement("td");
    tdFirst.textContent = String(p.first_name ?? "");
    const tdLast = document.createElement("td");
    tdLast.textContent = String(p.last_name ?? "");
    const tdId = document.createElement("td");
    tdId.textContent = p.person_id != null ? String(p.person_id) : "";
    tr.append(tdFirst, tdLast, tdId);
    tbody.appendChild(tr);
  }

  table.append(thead, tbody);
  container.appendChild(table);
}

function showDataLoadError(container) {
  if (!container) return;
  container.innerHTML =
    '<p class="muted" style="margin:0">Could not load data. Use a local server (e.g. <code>python -m http.server</code>) so CSV files can load.</p>';
}

window.displayPersonRows = displayPersonRows;
window.showDataLoadError = showDataLoadError;
