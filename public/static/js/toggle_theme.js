export async function toggleTheme() {
  const themeToggler = document.getElementById("themeToggler");
  const header = document.getElementById("header");
  const body = document.body;

  if (!themeToggler || !header) {
    console.error("Theme toggler or header element not found");
    return;
  }

  themeToggler.classList.toggle("active");
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
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    const themeToggler = document.getElementById("themeToggler");
    const header = document.getElementById("header");
    
    if (themeToggler) {
      themeToggler.classList.add("active");
    }
    
    if (header) {
      header.classList.add("dark-theme");
    }
    
    document.body.classList.add("dark-theme");
  }
});
