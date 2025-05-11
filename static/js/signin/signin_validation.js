// import { displayPopup } from '../display_popup.js';

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
        console.error(`Input element with ID "${targetId}" not found.`)
    }
  });
}
