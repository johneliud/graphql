# graphql

## Project Overview

This project aims to create a personalized profile page by querying user data from a GraphQL API. The application features a secure login system and displays user information with interactive SVG-based data visualizations.

## Key Features

- **GraphQL Integration**: Connects to the platform's GraphQL endpoint to fetch user data
- **Secure Authentication**: Implements JWT-based login with support for both username and email credentials
- **Profile Display**: Shows at least three sections of user information (selectable from various options)
- **Data Visualization**: Includes SVG-generated statistical graphs displaying user progress and achievements

## Technical Requirements

### Authentication System
- Only accept credentials available for users registered to Zone01 system
- Login page accepts both `username:password` and `email:password`
- Implements Basic authentication with base64 encoding
- Handles JWT token retrieval from `/api/auth/signin`
- Includes proper error messaging for invalid credentials
- Provides logout functionality
- Uses Bearer authentication for GraphQL queries

### Profile Page Components
Must display at least three of the following information sections:
- Basic user identification
- XP amount
- Grades
- Audits
- Skills

### Data Visualization (Mandatory)
- Minimum of two different SVG-based statistical graphs
- Possible graph options include:
  - XP earned over time
  - XP by project
  - Audit ratio
  - PASS/FAIL ratio by project
  - Piscine stats (JS/Go)
  - Exercise attempt statistics

## API Endpoints
- GraphQL Endpoint: `https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`
- Authentication Endpoint: `https://learn.zone01kisumu.ke/api/auth/signin`

## UI Requirements
- Clean, user-friendly interface
- Responsive design
- Visually appealing data visualizations
- Clear information hierarchy
- Proper error handling and user feedback

## Development Notes
- All GraphQL queries will only return data for the authenticated user
- SVG graphs should consider principles of good data visualization
- Additional creative information displays are encouraged
- The project emphasizes learning GraphQL through practical implementation

## Getting Started

1. Clone the repository
2. Install dependencies
3. Implement the login system
4. Create GraphQL queries for required data
5. Design profile page layout
6. Develop SVG visualization components
7. Test authentication flow and data fetching
8. Implement error handling and edge cases