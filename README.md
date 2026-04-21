# F1 Dashboard

A full-stack F1 dashboard application with a Next.js client and Rust/Axum server.

## Project Structure

```
f1-dashboard/
├── client/          # Next.js frontend
│   ├── src/         # React components
│   ├── package.json
│   └── ...
├── src/             # Rust source code
├── Cargo.toml       # Rust dependencies
└── README.md        # This file
```

## Getting Started

### Client (Next.js)

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Server (Rust/Axum)

```bash
cargo run
```

The server runs on [http://localhost:3001](http://localhost:3001)

## Vercel Deployment (Frontend)

Deploy the `client` folder as the Vercel project root.

Set this environment variable in Vercel:

- `NEXT_PUBLIC_API_BASE_URL`: your deployed Rust API URL (example: `https://your-api.example.com`)

Notes:

- Vercel will deploy the Next.js frontend. The Rust/Axum API should be deployed separately (for example on Railway/Render/Fly).
- The frontend now reads the API base URL from `NEXT_PUBLIC_API_BASE_URL` in production.

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Rust, Axum, Tokio
