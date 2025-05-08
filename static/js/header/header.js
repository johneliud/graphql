async function renderHeader() {
  const app = document.getElementById('app');
  const header = document.createElement('header');
  header.className = 'header';
  header.id = 'header';

  header.innerHTML = `
    <div class="logo">
      <a href="#">GraphQL</a>
    </div>

    <div class="theme-toggler">
      <box-icon name='sun' class="sun"></box-icon>
      <box-icon name='moon' class="moon"></box-icon>
    </div>
  `;
  app.appendChild(header);
}
