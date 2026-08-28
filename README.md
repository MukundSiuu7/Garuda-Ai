# Garuda-AI

<p align="center">
  <img src="frontend/public/garuda%28512%29.svg" alt="Garuda-AI logo" width="160">
</p>

Garuda-AI is an investigation and network intelligence platform for exploring cases, entities, relationships, analytics, transactions, and AI-assisted analysis.

## Features

- Investigation dashboard
- Case and entity browsing
- Relationship network visualization
- Crime and transaction analytics
- AI analysis backed by investigation records
- Responsive interface with persistent dark/light mode
- MongoDB-backed API

## Project Structure

```text
.
├── backend/       Express and TypeScript API
├── frontend/      React, TypeScript, and Vite application
├── shared/        Shared project resources
└── vercel.json    Deployment configuration
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB database, such as MongoDB Atlas

## Configuration

Create `backend/.env` locally. Do not commit this file or put real credentials in source control.

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/crimegraph?retryWrites=true&w=majority
MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1
JWT_SECRET=replace-with-a-long-random-secret
```

The frontend uses `http://localhost:5000/api` during development and `/api` in production.

## Local Development

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend is normally available at `http://localhost:5173` and the API at `http://localhost:5000`.

## Available Commands

### Backend

```bash
npm run dev    # Start the API with TypeScript watch mode
npm start      # Start the API
npm run seed   # Seed the MongoDB database
```

### Frontend

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run Oxlint
npm run preview  # Preview the production build
```

## API Health Check

With the backend running, visit:

```text
http://localhost:5000/api/health
```

A healthy API returns:

```json
{
  "status": "ok",
  "message": "CrimeGraph API is running"
}
```

## Deployment

The project is configured for Vercel. Configure the following environment variables in the Vercel project settings for the backend deployment:

- `MONGODB_URI`
- `MONGODB_DNS_SERVERS` (optional)
- `JWT_SECRET`

Also allow Vercel to connect to the MongoDB deployment through the database provider's network access settings. Redeploy after changing environment variables.

Before deploying, run:

```bash
cd frontend
npm run build
```

## Security Notes

- Keep `.env` files and database credentials private.
- Rotate credentials immediately if they are exposed.
- Use a separate database user and secret for production.
- Restrict MongoDB network access where possible.
