function initActorsPage() {
  const container = document.getElementById("actor-list");
  if (!container) return;

  window.dataReady
    .then(() => displayPersonRows(getActors(), container))
    .catch(() => showDataLoadError(container));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initActorsPage);
} else {
  initActorsPage();
}
