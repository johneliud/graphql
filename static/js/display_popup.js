export function displayPopup(message, isSuccess) {
  const messagePopup = document.getElementById('messagePopup');

  messagePopup.textContent = message;
  messagePopup.classList.remove('success', 'error');

  messagePopup.classList.add('show');
  if (isSuccess) {
    messagePopup.classList.add('success');
  } else {
    messagePopup.classList.add('error');
  }

  setTimeout(() => {
    messagePopup.classList.remove('show', 'success', 'error');
  }, 3500);
}
