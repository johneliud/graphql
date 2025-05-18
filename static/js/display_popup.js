export function displayPopup(message, isSuccess) {
  let messagePopup = document.getElementById('messagePopup');
  
  // Create the popup element if it doesn't exist
  if (!messagePopup) {
    messagePopup = document.createElement('p');
    messagePopup.id = 'messagePopup';
    messagePopup.className = 'message-popup';
    document.body.appendChild(messagePopup);
  }

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
