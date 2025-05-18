import { LineGraph, BarGraph } from './svg_graphs.js';
import { GRAPHQL_QUERY } from './graphql_query.js';
import { displayPopup } from './display_popup.js';
import { renderSignInView } from './signin/signin_view.js';
import { validateSignInFormData } from './signin/signin_validation.js';
import { logout } from './validate_jwt.js';

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

  // Show loading indicator initially
  profileContent.innerHTML = `
    <div class="loading-indicator">
      <div class="spinner"></div>
      <p>Loading your profile data...</p>
    </div>
  `;

  // Add sidebar and content to app
  app.appendChild(sidebar);
  app.appendChild(profileContent);

  // Load profile data after a short delay
  setTimeout(() => {
    // Replace loading indicator with profile content
    profileContent.innerHTML = `
      <div class="profile-header">
        <h2>Welcome to Your Profile</h2>
        <button id="logoutBtn" class="logout-btn">Log Out</button>
      </div>
      <div class="profile-info">
        <div id="basic-info" class="profile-section">
          <h3>Basic Information</h3>
          <div class="profile-details">
            <p><strong>Name:</strong> <span id="fullName">Loading...</span></p>
            <p><strong>Username:</strong> <span id="username">Loading...</span></p>
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

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        logout();
        window.location.reload();
      });
    }

    // Load the profile data
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

    const userData = data.data.user[0];

    console.log('userData: ', userData);

    // Update page title with user's name
    const welcomeTitle = document.querySelector('.profile-header h2');
    if (welcomeTitle) {
      welcomeTitle.textContent = `Welcome, ${userData.firstName || 'User'}!`;
    }

    // Update basic information
    updateElementText(
      'fullName',
      `${userData.firstName || ''} ${userData.lastName || ''}`
    );
    updateElementText('username', userData.login || 'N/A');
    updateElementText('email', userData.email || 'N/A');
    updateElementText('campus', userData.campus || 'N/A');
    updateElementText('level', userData.events?.[0]?.level || 'N/A');

    // Update audit statistics
    const auditRatio = userData.auditRatio || 0;
    updateElementText('auditRatio', `${(auditRatio * 100).toFixed(2)}%`);
    updateElementText('totalUp', userData.totalUp?.toLocaleString() || 0);
    updateElementText('totalDown', userData.totalDown?.toLocaleString() || 0);

    // Update XP statistics
    const totalXp = userData.totalXp?.aggregate?.sum?.amount || 0;
    updateElementText('totalXp', totalXp.toLocaleString());

    // Create XP progress graph
    const xpGraph = document.getElementById('xpGraph');
    if (xpGraph) {
      const xpData =
        userData.xp?.map((x) => ({
          createdAt: x.createdAt,
          amount: x.amount || 0,
        })) || [];

      if (xpData.length > 0) {
        const lineGraph = new LineGraph(xpData);
        xpGraph.appendChild(lineGraph.render());
      } else {
        xpGraph.innerHTML = '<p>No XP data available</p>';
      }
    }

    // Update project statistics
    const completedProjects = userData.completed_projects?.length || 0;
    const currentProjects = userData.current_projects?.length || 0;
    updateElementText('completedProjects', completedProjects.toString());
    updateElementText('currentProjects', currentProjects.toString());

    // Create project status graph
    const projectGraph = document.getElementById('projectGraph');
    if (projectGraph) {
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
    }
  } catch (error) {
    displayPopup(error.message || 'Error loading profile data', false);
    console.error('Error loading profile data:', error);
  }
}

// Helper function to safely update element text content
function updateElementText(elementId, text) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = text;
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
