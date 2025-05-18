import { renderHeader } from './header/header.js';
import { toggleTheme } from './toggle_theme.js';
import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';
import { isLoggedIn } from './validate_jwt.js';
import './profile.js';

function initApp() {
  renderHeader();

  const themeToggler = document.getElementById('themeToggler');
  themeToggler.addEventListener('click', toggleTheme);

  // Check auth status and render appropriate view
  if (isLoggedIn()) {
    // User is logged in, dispatch event to show profile
    const app = document.getElementById('app');
    app.dispatchEvent(new CustomEvent('showProfile'));
  } else {
    // Initialize signin view
    renderSignInView();
    validateSignInFormData();
  }
}

document.addEventListener('DOMContentLoaded', initApp);
