function initDirectorsPage() {
  const container = document.getElementById("director-list");
  if (!container) return;

  window.dataReady
    .then(() => displayPersonRows(getDirectors(), container))
    .catch(() => showDataLoadError(container));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDirectorsPage);
} else {
  initDirectorsPage();
}
