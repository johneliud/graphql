export async function renderHeader() {
  const app = document.getElementById("app");
  const header = document.createElement("header");
  header.className = "header";
  header.id = "header";

  header.innerHTML = `
    <div class="logo">
      <a href="#" id="homeLink">GraphQL</a>
    </div>
    
    <nav class="nav-menu">
      <ul>
        <li><a href="#" id="profileLink" class="nav-link">Profile</a></li>
        <li><a href="#" id="aboutLink" class="nav-link">About</a></li>
      </ul>
    </nav>

    <div id="themeToggler" class="theme-toggler">
      <box-icon name='sun' size="md" class="sun"></box-icon>
      <box-icon name='moon' size="md" class="moon"></box-icon>
    </div>
  `;
  
  app.appendChild(header);
  
  // Add event listeners for navigation
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload();
  });
  
  document.getElementById('profileLink').addEventListener('click', (e) => {
    e.preventDefault();
    const app = document.getElementById('app');
    app.dispatchEvent(new CustomEvent('showProfile'));
  });
  
  document.getElementById('aboutLink').addEventListener('click', (e) => {
    e.preventDefault();
    renderAboutView();
  });
}

function renderAboutView() {
  const app = document.getElementById('app');
  const mainContent = document.querySelector('.signin-container, .profile-container, .about-container');
  
  if (mainContent) {
    mainContent.remove();
  }
  
  const aboutContainer = document.createElement('div');
  aboutContainer.className = 'about-container';
  aboutContainer.innerHTML = `
    <div class="about-content">
      <h2>About GraphQL Explorer</h2>
      <p>This application allows you to explore your Zone01 profile data using GraphQL.</p>
      <p>Built with vanilla JavaScript as a single-page application.</p>
    </div>
  `;
  
  app.appendChild(aboutContainer);
}
