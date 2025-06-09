# WisdomFlow

Store and search your personal principles across web and mobile apps.

## Development

- `make dev` – run backend and frontend in watch mode
- `make migrate` – run database migrations
- `make test` – run unit tests
- `cd mobile && npm install && npm start` – run Expo mobile app

## Deployment

Backend is deployed on Heroku via `Procfile` and frontend is served from Vercel using `vercel.json`.

## Local Hosting

To run everything offline on your machine:

1. Install backend dependencies and create a virtual environment:

   ```bash
   cd backend
   python -m venv venv
   . venv/bin/activate
   pip install -r requirements.txt
   ```

2. Apply database migrations so the database schema is up to date. Set the
   `DATABASE_URL` environment variable to your Postgres instance if you are not
   using the default SQLite database:

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
