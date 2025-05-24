export function toggleTheme() {
  const themeToggler = document.getElementById("themeToggler");
  const header = document.getElementById("header");
  const body = document.body;

  if (!themeToggler || !header) {
    console.error("Theme toggler or header element not found");
    return;
  }

  header.classList.toggle("dark-theme");
  body.classList.toggle("dark-theme");

  const isDarkTheme = body.classList.contains("dark-theme");
  if (isDarkTheme) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}

// Apply the saved theme on page load
export function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    const header = document.getElementById("header");
    
    if (header) {
      header.classList.add("dark-theme");
    }
    
    document.body.classList.add("dark-theme");
  }
}