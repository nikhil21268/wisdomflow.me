# WisdomFlow

Store and search your personal principles across web and mobile apps.

## Development

- `make dev` – run backend and frontend in watch mode
- `make migrate` – run database migrations
- `make test` – run unit tests
- `cd mobile && npm install && npm start` – run Expo mobile app

Backend requires **Python 3.11**. Other versions may fail to install dependencies.

Database migrations require a **PostgreSQL** database. SQLite cannot be used
because the project relies on `UUID` and vector column types which are not
supported by SQLite.

## Deployment

Backend is deployed on Heroku via `Procfile` and frontend is served from Vercel using `vercel.json`.

## Local Hosting

To run everything offline on your machine:

1. Install backend dependencies and create a Python 3.11 virtual environment:

   ```bash
   cd backend
   python3.11 -m venv venv
   . venv/bin/activate
   pip install -r requirements.txt
   ```

2. Create a PostgreSQL database (for example with `createdb wisdomflow`) and
   **export** the connection string in the `DATABASE_URL` environment variable:

   ```bash
   export DATABASE_URL=postgresql://<user>:<password>@localhost/wisdomflow
   ```

   SQLite cannot be used because UUID and vector columns are unsupported.
   After exporting `DATABASE_URL`, run the migrations to initialize the schema:

   ```bash
   make migrate
   ```

3. Build the frontend so it can be served by Flask:

   ```bash
   cd ../frontend
   npm install
   npm run build
   ```

4. Start the backend which will also serve the compiled frontend:

   ```bash
   cd ../backend
   FLASK_APP=app.core flask run
   ```

Visit `http://localhost:5000` to use the app without any cloud services.
