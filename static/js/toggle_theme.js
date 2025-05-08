export async function toggleTheme() {
  const themeToggler = document.getElementById("themeToggler");
  const header = document.getElementById("header");
  const body = document.body;

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
    document.getElementById("themeToggler").classList.add("active");
    document.getElementById("header").classList.add("dark-theme");
    document.body.classList.add("dark-theme");
  }
});
