import { displayPopup } from '../display_popup.js';

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

    signInForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (messagePopup) {
        messagePopup.textContent = '';
        messagePopup.classList.remove('show', 'success', 'error');
      }

      const emailOrUsername = document.getElementById('emailOrUsername').value;
      const password = document.getElementById('password').value;

      console.log('Email or username: ', emailOrUsername);
      console.log('Password: ', password);

      if (emailOrUsername.trim().length === 0) {
        displayPopup(
          'Email or Username cannot be an empty field. Try again!',
          false
        );
        return;
      }

      if (password.trim().length === 0) {
        displayPopup('Password cannot be an empty field. Try again!', false);
        return;
      }

      const signInData = {
        emailOrUsername: emailOrUsername,
        password: password,
      };

      try {
        const response = await fetch(
          'https://learn.zone01kisumu.ke/api/auth/signin',
          {
            method: 'POST',
            headers: { Authorization: `Basic ${signInData}` },
          }
        );

        const result = await response.json();

        if (!result.success) {
          displayPopup(
            result.message || 'Sign in unsuccessful. Try again!',
            false
          );
          return;
        } else if (result.success) {
          displayPopup(result.message || 'Sign in successful!', true);
          signInForm.reset();

          setTimeout(() => {
            location.reload();
          }, 1500);
        }
      } catch (error) {
        displayPopup('Failed authenticating user. Try again!', false);
        return;
      }
    });
  });
}
