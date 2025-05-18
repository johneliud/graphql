import { displayPopup } from '../display_popup.js';
import { renderProfileView } from '../profile.js';

export async function validateSignInFormData() {
  const signInForm = document.getElementById('signinForm');
  const messagePopup = document.getElementById('messagePopup');

  if (!signInForm) {
    console.error('Signin form not found');
    return;
  }

  if (!messagePopup) {
    console.error('Message popup not found');
    return;
  }

  const passwordVisibilityBtn = document.querySelector(
    '.toggle-password-visibility'
  );

  if (passwordVisibilityBtn) {
    passwordVisibilityBtn.addEventListener('click', (e) => {
      const targetId = e.target.closest('button').dataset.target;
      const input = document.getElementById(targetId);

      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
        } else {
          input.type = 'password';
        }
      } else {
        console.error(`Input element with ID "${targetId}" not found.`);
      }
    });
  }

  signInForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (messagePopup) {
      messagePopup.textContent = '';
      messagePopup.classList.remove('show', 'success', 'error');
    }

    const emailOrUsername = document
      .getElementById('emailOrUsername')
      .value.trim();
    const password = document.getElementById('password').value;

    // Basic validation
    if (!emailOrUsername) {
      displayPopup('Email or Username cannot be empty', false);
      return;
    }

    if (!password) {
      displayPopup('Password cannot be empty', false);
      return;
    }

    try {
      const signInBtn = document.querySelector('.sign-in-btn');
      if (signInBtn) {
        signInBtn.disabled = true;
        signInBtn.textContent = 'Signing in...';
      }

      // Basic Auth header
      const authString = btoa(`${emailOrUsername}:${password}`);

      // Make request to signin endpoint
      const response = await fetch(
        'https://learn.zone01kisumu.ke/api/auth/signin',
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        displayPopup(data.message || 'Sign in unsuccessful!', false);
        if (signInBtn) {
          signInBtn.disabled = false;
          signInBtn.textContent = 'Sign In';
        }
        return;
      }
      
      displayPopup('Sign in successful!', true);
      const jwt = data.jwt;

      // Store JWT in localStorage
      localStorage.setItem('jwt', jwt);
      renderProfileView();
    } catch (error) {
      displayPopup(error.message || 'Error during sign in', false);
      const signInBtn = document.querySelector('.sign-in-btn');
      if (signInBtn) {
        signInBtn.disabled = false;
        signInBtn.textContent = 'Sign In';
      }
    }
  });
}
