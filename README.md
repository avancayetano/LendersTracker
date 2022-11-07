# LendersTracker

Backend: Flask

Frontend: React

Database: Render PostgreSQL

## Deployment options

### Option 1:

Backend Host: Render Web service

Frontend Host: GitHub pages or Render Static sites

### Option 2: (easier since we don't have to deal with CORS issues)

Same host for backend and frontend (Render). Flask will serve the build files of the React app.

#### Workflow for this option

Have two local development servers (1 for Flask, 1 for React). Before deploying, build the react app then make flask serve the build files.
