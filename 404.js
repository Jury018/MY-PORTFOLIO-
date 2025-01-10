// Apply dark mode based on system preference
function applyDarkModePreference() {
  const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDarkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Reapply dark mode when the preference changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyDarkModePreference);

// Apply dark mode on page load
applyDarkModePreference();