function initWritersPage() {
  const container = document.getElementById("writer-list");
  if (!container) return;

  window.dataReady
    .then(() => displayPersonRows(getWriters(), container))
    .catch(() => showDataLoadError(container));
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initWritersPage);
} else {
  initWritersPage();
}
