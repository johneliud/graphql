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

  // loadProfileData();
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

    console.log('data: ', data);

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

    const userData = data.data.user[0]; // Get the first user from the array

    console.log("userData: ", userData);

    // Update page title with user's name
    document.querySelector('.profile-container h2').textContent = 
      `Welcome, ${userData.firstName || 'User'}!`;

    // Update basic information
    document.getElementById('fullName').textContent = `${
      userData.firstName || ''
    } ${userData.lastName || ''}`;
    document.getElementById('email').textContent = userData.email || 'N/A';
    document.getElementById('campus').textContent = userData.campus || 'N/A';
    document.getElementById('level').textContent =
      userData.events?.[0]?.level || 'N/A';

    // Update audit statistics
    const auditRatio = userData.auditRatio || 0;
    document.getElementById('auditRatio').textContent = `${(auditRatio * 100).toFixed(2)}%`;
    document.getElementById('totalUp').textContent = userData.totalUp?.toLocaleString() || 0;
    document.getElementById('totalDown').textContent = userData.totalDown?.toLocaleString() || 0;

    // Update XP statistics
    const totalXp = userData.totalXp?.aggregate?.sum?.amount || 0;
    document.getElementById('totalXp').textContent = totalXp.toLocaleString();

    // Create XP progress graph
    const xpGraph = document.getElementById('xpGraph');
    const xpData =
      userData.xp?.map((x) => ({
        createdAt: x.createdAt,
        amount: x.amount || 0, // Ensure amount is never undefined
      })) || [];

    if (xpData.length > 0) {
      const lineGraph = new LineGraph(xpData);
      xpGraph.appendChild(lineGraph.render());
    } else {
      xpGraph.innerHTML = '<p>No XP data available</p>';
    }

    // Update project statistics
    const completedProjects = userData.completed_projects?.length || 0;
    const currentProjects = userData.current_projects?.length || 0;
    document.getElementById('completedProjects').textContent =
      completedProjects.toString();
    document.getElementById('currentProjects').textContent = 
      currentProjects.toString();

    // Create project status graph
    const projectGraph = document.getElementById('projectGraph');
    const projectData = [
      { status: 'Completed', count: completedProjects || 0 },
      { status: 'Current', count: currentProjects || 0 },
    ];

    if (completedProjects > 0 || currentProjects > 0) {
      const barGraph = new BarGraph(projectData);
      projectGraph.appendChild(barGraph.render());
    } else {
      projectGraph.innerHTML = '<p>No project data available</p>';
    }
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
