import './profile.js';
import { renderHeader } from './header/header.js';
import { toggleTheme } from './toggle_theme.js';

renderHeader();

// Theme functionality
const themeToggler = document.getElementById('themeToggler');
themeToggler.addEventListener('click', toggleTheme);

renderSignInView();
