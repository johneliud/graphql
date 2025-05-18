export async function renderHeader() {
  const app = document.getElementById('app');
  const header = document.createElement('header');
  header.className = 'header';
  header.id = 'header';

  const isLoggedIn = localStorage.getItem('jwt') ? true : false;

  header.innerHTML = `
    <div class="logo">
      <a href="#" id="homeLink">GraphQL</a>
    </div>

    <div class="header-controls">
      ${
        isLoggedIn
          ? '<button id="logoutBtn" class="logout-btn">Log Out</button>'
          : ''
      }
      <div id="themeToggler" class="theme-toggler">
        <box-icon name='sun' size="md" class="sun"></box-icon>
        <box-icon name='moon' size="md" class="moon"></box-icon>
      </div>
    </div>
  `;

  app.appendChild(header);

  // Add event listeners for navigation
  document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload();
  });

  // Add logout button event listener if logged in
  if (isLoggedIn) {
    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.removeItem('jwt');
      window.location.reload();
    });
  }
}
