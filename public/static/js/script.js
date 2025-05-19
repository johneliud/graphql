import { renderHeader } from './header/header.js';
import { toggleTheme } from './toggle_theme.js';
import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';
import { isLoggedIn } from './validate_jwt.js';
import { renderProfileView } from './profile.js';

function initApp() {
  renderHeader();

  const themeToggler = document.getElementById('themeToggler');
  themeToggler.addEventListener('click', toggleTheme);

  // Check auth status and render appropriate view
  if (isLoggedIn()) {
    renderProfileView();
  } else {
    renderSignInView();
    validateSignInFormData();
  }

  // Listen for auth state changes to update the header
  window.addEventListener('storage', (event) => {
    if (event.key === 'jwt') {
      // Re-render header when JWT changes (login/logout)
      const header = document.getElementById('header');
      if (header) {
        header.remove();
      }
      renderHeader();
      
      // If JWT was added (user logged in), show profile
      if (event.newValue) {
        renderProfileView();
      } else {
        // If JWT was removed (user logged out), show signin
        renderSignInView();
        validateSignInFormData();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', initApp);
