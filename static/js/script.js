import { renderHeader } from './header/header.js';
import { toggleTheme } from './toggle_theme.js';
import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';

renderHeader();

// Theme functionality
const themeToggler = document.getElementById('themeToggler');
themeToggler.addEventListener('click', toggleTheme);

toggleTheme();

renderSignInView();

validateSignInFormData();
