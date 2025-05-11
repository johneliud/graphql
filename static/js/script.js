import { renderHeader } from './header/header.js';
import { toggleTheme } from './toggle_theme.js';
import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';

// Initialize header
renderHeader();

// Theme functionality
const themeToggler = document.getElementById('themeToggler');
themeToggler.addEventListener('click', toggleTheme);

// Initialize signin view
renderSignInView();
validateSignInFormData();
