# NGO_Interface
The NGO Interface is a digital platform designed to streamline communication, collaboration, and resource management for Non-Governmental Organizations (NGOs). It serves as a central hub where NGOs, donors, volunteers, beneficiaries, and government agencies can interact seamlessly.

## Backend setup

1. Install dependencies
   ```bash
   cd backend
   npm install
   ```
2. Create a MySQL database (default `ngo_portal`) and user with permissions, or update the connection details.
3. Add a `.env` file in `backend/`:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=ngo_portal
   PORT=3001
   ```
4. Start the API:
   ```bash
   npm start
   ```

## Volunteer Database API

The Greenpeace volunteer modal now saves submissions to the backend database and can display the most recent sign-ups. Make sure the backend server is running before opening the Greenpeace page.

- `POST /volunteers` – stores a volunteer submission. Required fields: `name`, `email`, `location`. Optional: `phone`, `interests[]`, `experience`, `source`.
- `GET /volunteers?limit=5` – returns the latest volunteer entries (max 50).

The frontend expects the API at `http://localhost:3001`. To use another host, start the backend on the desired URL and set `window.__NGO_API_BASE_URL__` before loading the Greenpeace scripts.