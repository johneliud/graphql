# graphql 

## Project Overview  

This project creates a personalized profile page by querying user data from Zone01's GraphQL API. It features a secure login system and displays user information with interactive SVG-based data visualizations.  

### 🔗 Live Demo  
[View Hosted Project](https://graphql-uvsx.onrender.com)  

## Key Features  

- **GraphQL Integration** – Fetches user data from Zone01's GraphQL endpoint  
- **Secure Authentication** – JWT-based login (username/email + password)  
- **Profile Display** – Shows user info (XP, grades, audits, skills, etc.)  
- **Data Visualization** – Interactive SVG graphs for progress tracking  

## Prerequisites  

- **Zone01 Account Required** – Only registered Zone01 users can authenticate  
- Modern web browser (Firefox recommended)  

## Getting Started  

### 1. Clone the Repository  
```bash
git clone https://learn.zone01kisumu.ke/git/johnodhiambo0/graphql.git
cd graphql
```
### 2. Open with Live Server  

## Technical Implementation  

### Authentication  
- Login accepts `username:password` or `email:password`  
- Uses Basic Auth with base64 encoding  
- Retrieves JWT from `/api/auth/signin`  
- Implements proper error handling  

### Profile Data  
Displays at least 3 sections from:  
- Basic user info  
- XP amount  
- Grades  
- Audits  
- Skills  

### Mandatory Visualizations (SVG)  
- **Minimum 2 graph types** from:  
  - XP over time  
  - XP by project  
  - Audit ratio  
  - PASS/FAIL ratios  
  - Piscine stats  

## API Endpoints  
- **GraphQL**: `https://learn.zone01kisumu.ke/api/graphql-engine/v1/graphql`  
- **Auth**: `https://learn.zone01kisumu.ke/api/auth/signin`  

## Contribution  
Contributions welcome! Please fork the repository and submit pull requests.  

## License  
[MIT](https://github.com/johneliud/graphql/blob/main/LICENSE)  

---

**Note**: This application only works with valid Zone01 Kisumu credentials. Demo account available upon request.  

[➡️ Access Live Version](https://graphql-uvsx.onrender.com)
[Devto Article](https://dev.to/johneliud/building-a-dynamic-user-profile-dashboard-with-graphql-670)