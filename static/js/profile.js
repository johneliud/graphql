import { LineGraph, BarGraph } from './svg_graphs.js';
import { GRAPHQL_QUERY } from './graphql_query.js';
import { displayPopup } from './display_popup.js';

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
  
  // Remove existing content
  const existingContent = document.querySelector('.signin-container, .profile-container, .about-container');
  if (existingContent) {
    existingContent.remove();
  }
  
  // Show loading indicator
  const loadingIndicator = document.createElement('div');
  loadingIndicator.className = 'loading-indicator';
  loadingIndicator.innerHTML = `
    <div class="spinner"></div>
    <p>Loading your profile data...</p>
  `;
  app.appendChild(loadingIndicator);

  // Add profile content
  const profileContent = document.createElement('div');
  profileContent.className = 'profile-container';
  profileContent.innerHTML = `
    <h2>Welcome to Your Profile</h2>
    <div class="profile-info">
      <div class="profile-section">
        <h3>Basic Information</h3>
        <div class="profile-details">
          <p><strong>Name:</strong> <span id="fullName">Loading...</span></p>
          <p><strong>Email:</strong> <span id="email">Loading...</span></p>
          <p><strong>Campus:</strong> <span id="campus">Loading...</span></p>
          <p><strong>Current Level:</strong> <span id="level">Loading...</span></p>
        </div>
      </div>

      <div class="profile-section">
        <h3>Audit Statistics</h3>
        <div class="audit-stats">
          <p><strong>Audit Ratio:</strong> <span id="auditRatio">Loading...</span></p>
          <p><strong>Total Upvotes:</strong> <span id="totalUp">Loading...</span></p>
          <p><strong>Total Downvotes:</strong> <span id="totalDown">Loading...</span></p>
        </div>
      </div>

      <div class="profile-section">
        <h3>XP Statistics</h3>
        <div class="xp-stats">
          <p><strong>Total XP:</strong> <span id="totalXp">Loading...</span></p>
        </div>
        <div id="xpGraph"></div>
      </div>

      <div class="profile-section">
        <h3>Project Statistics</h3>
        <div class="project-stats">
          <p><strong>Completed Projects:</strong> <span id="completedProjects">Loading...</span></p>
          <p><strong>Current Projects:</strong> <span id="currentProjects">Loading...</span></p>
        </div>
        <div id="projectGraph"></div>
      </div>
    </div>
  `;

  // Replace loading indicator with profile content
  setTimeout(() => {
    app.removeChild(loadingIndicator);
    app.appendChild(profileContent);
    
    // Add logout button
    const logoutButton = document.createElement('button');
    logoutButton.className = 'logout-btn';
    logoutButton.textContent = 'Log Out';
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('jwt');
      window.location.reload();
    });
    profileContent.prepend(logoutButton);
    
    // Load profile data
    loadProfileData();
  }, 1000);
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
          query: GRAPHQL_QUERY,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      displayPopup(error.message || 'Failed to load profile data', false);
      return;
    }

    const data = await response.json();

    if (!data.data || !data.data.user) {
      displayPopup('No user data found', false);
      return;
    }

    const userData = data.data.user;

    console.log(response);
    console.log(data);
    console.log(userData);

    // Update basic information
    document.getElementById('fullName').textContent = `${
      userData.firstName || ''
    } ${userData.lastName || ''}`;
    document.getElementById('email').textContent = userData.email || 'N/A';
    document.getElementById('campus').textContent = userData.campus || 'N/A';
    document.getElementById('level').textContent =
      userData.events?.[0]?.level || 'N/A';

    // Update audit statistics
    document.getElementById('auditRatio').textContent = `${
      userData.auditRatio || 0
    }%`;
    document.getElementById('totalUp').textContent = userData.totalUp || 0;
    document.getElementById('totalDown').textContent = userData.totalDown || 0;

    // Update XP statistics
    const totalXp = userData.totalXp?.aggregate?.sum?.amount || 0;
    document.getElementById('totalXp').textContent = totalXp.toLocaleString();

    // Create XP progress graph
    const xpGraph = document.getElementById('xpGraph');
    const xpData =
      userData.xp?.map((x) => ({
        createdAt: x.createdAt,
        amount: x.amount,
      })) || [];

    if (xpData.length > 0) {
      const lineGraph = new LineGraph(xpData);
      xpGraph.appendChild(lineGraph.render());
    }

    // Update project statistics
    const completedProjects = userData.completed_projects?.length || 0;
    const currentProjects = userData.current_projects?.length || 0;
    document.getElementById('completedProjects').textContent =
      completedProjects;
    document.getElementById('currentProjects').textContent = currentProjects;

    // Create project status graph
    const projectGraph = document.getElementById('projectGraph');
    const projectData = [
      { status: 'Completed', count: completedProjects },
      { status: 'Current', count: currentProjects },
    ];

    const barGraph = new BarGraph(projectData);
    projectGraph.appendChild(barGraph.render());
  } catch (error) {
    displayPopup(error.message || 'Error loading profile data', false);
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
