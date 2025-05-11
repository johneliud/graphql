import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';

async function initializeApp() {
  const app = document.getElementById('app');

  // Check if user is logged in
  if (!localStorage.getItem('jwt')) {
    renderSignInView();
    validateSignInFormData();
  } else {
    await renderProfileView();
  }
}

// Handle profile view rendering
async function renderProfileView() {
  const app = document.getElementById('app');

  // Add logout button
  const logoutButton = document.createElement('button');
  logoutButton.className = 'logout-btn';
  logoutButton.textContent = 'Log Out';
  logoutButton.addEventListener('click', () => {
    localStorage.removeItem('jwt');
    // Show login view again
    renderSignInView();
    validateSignInFormData();
    window.location.reload();
  });

  // Add profile content
  const profileContent = document.createElement('div');
  profileContent.className = 'profile-container';
  profileContent.innerHTML = `
    <h2>Welcome to Your Profile</h2>
    <div class="profile-info">
      <!-- Profile content will be loaded here -->
    </div>
  `;

  app.innerHTML = '';
  app.appendChild(logoutButton);
  app.appendChild(profileContent);

  // Load profile data using GraphQL
  await loadProfileData();
}

// Handle profile data loading
async function loadProfileData() {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) return;

  try {
    const response = await fetch(
      'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          query: `{
          user {
            id
            username
            email
            createdAt
          }
        }`,
        }),
      }
    );

    if (!response.ok) throw new Error('Failed to load profile data');

    const data = await response.json();
    const userData = data.data.user;

    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
      profileInfo.innerHTML = `
        <p>Username: ${userData.username}</p>
        <p>Email: ${userData.email}</p>
        <p>Joined: ${new Date(userData.createdAt).toLocaleDateString()}</p>
      `;
    }
  } catch (error) {
    console.error('Error loading profile data:', error);
  }
}

// Listen for showProfile event
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  if (app) {
    app.addEventListener('showProfile', async (e) => {
      await renderProfileView();
    });

    // Initialize app on load
    initializeApp();
  }
});
