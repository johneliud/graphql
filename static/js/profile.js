import { LineGraph, BarGraph } from './svg_graphs.js';
import { GRAPHQL_QUERY } from './graphql_query.js';
import { displayPopup } from './display_popup.js';
import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';

// Handle profile view rendering
async function renderProfileView() {
  const app = document.getElementById('app');

  // Remove existing content
  const existingContent = document.querySelector(
    '.signin-container, .profile-container, .about-container, .sidebar, .profile-layout'
  );
  if (existingContent) {
    existingContent.remove();
  }

  // Create layout with sidebar and content area
  const profileLayout = document.createElement('div');
  profileLayout.className = 'profile-layout';

  // Create sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = `
    <h3>Dashboard</h3>
    <ul class="sidebar-menu">
      <li><a href="#basic-info" class="sidebar-link active">Basic Information</a></li>
      <li><a href="#audit-stats" class="sidebar-link">Audit Statistics</a></li>
      <li><a href="#xp-stats" class="sidebar-link">XP Statistics</a></li>
      <li><a href="#project-stats" class="sidebar-link">Project Statistics</a></li>
    </ul>
  `;

  // Create main content area
  const profileContent = document.createElement('div');
  profileContent.className = 'profile-container';

  // Show loading indicator
  profileContent.innerHTML = `
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading your profile data...</p>
    </div>
  `;

  // Add sidebar and content to layout
  profileLayout.appendChild(sidebar);
  profileLayout.appendChild(profileContent);
  app.appendChild(profileLayout);

  // Load profile data after a short delay
  setTimeout(() => {
    // Replace loading indicator with profile content
    profileContent.innerHTML = `
      <h2>Welcome to Your Profile</h2>
      <div class="profile-info">
        <div id="basic-info" class="profile-section">
          <h3>Basic Information</h3>
          <div class="profile-details">
            <p><strong>Name:</strong> <span id="fullName">Loading...</span></p>
            <p><strong>Email:</strong> <span id="email">Loading...</span></p>
            <p><strong>Campus:</strong> <span id="campus">Loading...</span></p>
            <p><strong>Current Level:</strong> <span id="level">Loading...</span></p>
          </div>
        </div>

        <div id="audit-stats" class="profile-section">
          <h3>Audit Statistics</h3>
          <div class="audit-stats">
            <p><strong>Audit Ratio:</strong> <span id="auditRatio">Loading...</span></p>
            <p><strong>Total Upvotes:</strong> <span id="totalUp">Loading...</span></p>
            <p><strong>Total Downvotes:</strong> <span id="totalDown">Loading...</span></p>
          </div>
        </div>

        <div id="xp-stats" class="profile-section">
          <h3>XP Statistics</h3>
          <div class="xp-stats">
            <p><strong>Total XP:</strong> <span id="totalXp">Loading...</span></p>
          </div>
          <div id="xpGraph"></div>
        </div>

        <div id="project-stats" class="profile-section">
          <h3>Project Statistics</h3>
          <div class="project-stats">
            <p><strong>Completed Projects:</strong> <span id="completedProjects">Loading...</span></p>
            <p><strong>Current Projects:</strong> <span id="currentProjects">Loading...</span></p>
          </div>
          <div id="projectGraph"></div>
        </div>
      </div>
    `;

    // Add event listeners for sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();

        sidebarLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
    loadProfileData();
  }, 1000);
}

// Handle profile data loading
async function loadProfileData() {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    displayPopup('No authentication token found. Please sign in.', false);
    renderSignInView();
    validateSignInFormData();
    return;
  }

  try {
    if (!jwt) {
      console.log('JWT is missing or invalid');
    }

    const response = await fetch(
      'https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt || ''}`,
        },
        body: JSON.stringify({
          query: GRAPHQL_QUERY,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      displayPopup(error.message || 'Failed to load profile data', false);

      // If unauthorized, clear token and redirect to sign in
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('jwt');
        renderSignInView();
        validateSignInFormData();
      }
      return;
    }

    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors && data.errors.length > 0) {
      const errorMessage = data.errors[0].message;
      console.error('GraphQL Error:', errorMessage);

      // If JWT verification failed, clear token and redirect to sign in
      if (errorMessage.includes('Could not verify JWT')) {
        localStorage.removeItem('jwt');
        displayPopup('Session expired. Please sign in again.', false);
        renderSignInView();
        validateSignInFormData();
        return;
      }

      displayPopup(errorMessage || 'Error in GraphQL response', false);
      return;
    }

    if (!data.data || !data.data.user) {
      displayPopup('No user data found', false);
      return;
    }

    const userData = data.data.user;

    console.log("userData: ", userData)

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
    app.addEventListener('showProfile', async () => {
      await renderProfileView();
    });
  }
});

export { renderProfileView };
